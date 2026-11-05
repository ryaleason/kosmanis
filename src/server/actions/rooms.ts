'use server';

import { db } from '@/db';
import { rooms, roomTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';
import { validateRoomTypeInput, validateRoomInput } from '@/lib/validators';

export async function createRoomTypeAction(input: unknown) {
  await requireRole(['pemilik', 'admin']);
  const validated = validateRoomTypeInput(input);

  const [created] = await db
    .insert(roomTypes)
    .values(validated)
    .returning();

  return { success: true, data: created };
}

export async function createRoomAction(input: unknown) {
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
  await requireRole(['pemilik', 'admin']);

  await db
    .update(rooms)
    .set({ status, updatedAt: new Date() })
    .where(eq(rooms.id, roomId));

  return { success: true };
}
