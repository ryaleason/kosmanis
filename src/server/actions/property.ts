import { z } from 'zod';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';

export const propertySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nama kos wajib diisi'),
  category: z.enum(['putra', 'putri', 'campur']),
  description: z.string().optional(),
  address: z.string().min(1, 'Alamat wajib diisi'),
  city: z.string().min(1, 'Kota wajib diisi'),
  whatsappNumber: z.string().min(1, 'Nomor WhatsApp wajib diisi'),
  rules: z.array(z.string()).default([]),
  facilities: z.array(z.string()).default([]),
  qrisImageUrl: z.string().optional(),
  bankAccounts: z
    .array(
      z.object({
        bankName: z.string(),
        accountNumber: z.string(),
        accountHolder: z.string(),
      })
    )
    .default([]),
});

export type PropertyInput = z.infer<typeof propertySchema>;

export function validatePropertyInput(input: unknown): PropertyInput {
  return propertySchema.parse(input);
}

export async function updatePropertySettingsAction(input: unknown) {
  'use server';
  await requireRole(['pemilik']);
  const validated = validatePropertyInput(input);

  await db
    .update(properties)
    .set({
      name: validated.name,
      category: validated.category,
      description: validated.description,
      address: validated.address,
      city: validated.city,
      whatsappNumber: validated.whatsappNumber,
      rules: validated.rules,
      facilities: validated.facilities,
      qrisImageUrl: validated.qrisImageUrl,
      bankAccounts: validated.bankAccounts,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, validated.id));

  return { success: true };
}
