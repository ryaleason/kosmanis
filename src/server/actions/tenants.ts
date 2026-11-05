'use server';

import { db } from '@/db';
import { tenants, leases, rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';
import { validateTenantLeaseInput } from '@/lib/validators';

export async function createTenantLeaseAction(input: unknown) {
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
