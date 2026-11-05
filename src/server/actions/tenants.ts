import { z } from 'zod';
import { db } from '@/db';
import { tenants, leases, rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';

export const tenantLeaseSchema = z.object({
  propertyId: z.string().uuid(),
  tenantName: z.string().min(1, 'Nama penghuni wajib diisi'),
  idCardNumber: z.string().optional(),
  phoneNumber: z.string().min(1, 'Nomor HP wajib diisi'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  roomId: z.string().uuid(),
  rentAmount: z.number().int().positive('Nomor sewa snapshot wajib berupa bilangan bulat positif'),
  depositAmount: z.number().int().nonnegative().default(0),
  dueDay: z.number().int().min(1).max(31).default(1),
  startDate: z.string(), // ISO String
  endDate: z.string(), // ISO String
});

export type TenantLeaseInput = z.infer<typeof tenantLeaseSchema>;

export function validateTenantLeaseInput(input: unknown): TenantLeaseInput {
  return tenantLeaseSchema.parse(input);
}

export async function createTenantLeaseAction(input: unknown) {
  'use server';
  await requireRole(['pemilik', 'admin']);
  const validated = validateTenantLeaseInput(input);

  // 1. Simpan data tenant
  const [tenant] = await db
    .insert(tenants)
    .values({
      propertyId: validated.propertyId,
      name: validated.tenantName,
      idCardNumber: validated.idCardNumber,
      phoneNumber: validated.phoneNumber,
      emergencyContactName: validated.emergencyContactName,
      emergencyContactPhone: validated.emergencyContactPhone,
      status: 'aktif',
    })
    .returning();

  // 2. Simpan kontrak sewa dengan snapshot harga sewa dan deposit permanen (FR-59)
  const [lease] = await db
    .insert(leases)
    .values({
      propertyId: validated.propertyId,
      tenantId: tenant.id,
      roomId: validated.roomId,
      startDate: new Date(validated.startDate),
      endDate: new Date(validated.endDate),
      rentAmount: validated.rentAmount, // Snapshot permanen
      depositAmount: validated.depositAmount, // Snapshot permanen
      dueDay: validated.dueDay,
      status: 'aktif',
    })
    .returning();

  // 3. Ubah status kamar menjadi 'terisi' secara otomatis sesuai aturan domain
  await db
    .update(rooms)
    .set({ status: 'terisi', updatedAt: new Date() })
    .where(eq(rooms.id, validated.roomId));

  return { success: true, data: { tenant, lease } };
}
