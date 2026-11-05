import { z } from 'zod';
import { db } from '@/db';
import { rooms, roomTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';

export const roomTypeSchema = z.object({
  propertyId: z.string().uuid(),
  name: z.string().min(1, 'Nama tipe kamar wajib diisi'),
  description: z.string().optional(),
  facilities: z.array(z.string()).default([]),
  basePrice: z.number().int().positive('Harga sewa harus lebih dari 0'),
  depositAmount: z.number().int().nonnegative().default(0),
  electricityMode: z.enum(['termasuk_sewa', 'bayar_sendiri']).default('termasuk_sewa'),
});

export const roomSchema = z.object({
  propertyId: z.string().uuid(),
  roomTypeId: z.string().uuid(),
  roomNumber: z.string().min(1, 'Nomor kamar wajib diisi'),
  floor: z.number().int().positive().default(1),
  status: z.enum(['kosong', 'terisi', 'segera_kosong']).default('kosong'),
  images: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type RoomTypeInput = z.infer<typeof roomTypeSchema>;
export type RoomInput = z.infer<typeof roomSchema>;

export function validateRoomTypeInput(input: unknown): RoomTypeInput {
  return roomTypeSchema.parse(input);
}

export function validateRoomInput(input: unknown): RoomInput {
  return roomSchema.parse(input);
}

export async function createRoomTypeAction(input: unknown) {
  'use server';
  await requireRole(['pemilik', 'admin']);
  const validated = validateRoomTypeInput(input);

  const [created] = await db
    .insert(roomTypes)
    .values(validated)
    .returning();

  return { success: true, data: created };
}

export async function createRoomAction(input: unknown) {
  'use server';
  await requireRole(['pemilik', 'admin']);
  const validated = validateRoomInput(input);

  const [created] = await db
    .insert(rooms)
    .values(validated)
    .returning();

  return { success: true, data: created };
}

export async function updateRoomStatusAction(
  roomId: string,
  status: 'kosong' | 'terisi' | 'segera_kosong'
) {
  'use server';
  await requireRole(['pemilik', 'admin']);

  await db
    .update(rooms)
    .set({ status, updatedAt: new Date() })
    .where(eq(rooms.id, roomId));

  return { success: true };
}
