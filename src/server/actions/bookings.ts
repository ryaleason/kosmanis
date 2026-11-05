'use server';

import { db } from '@/db';
import { bookingRequests, rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';
import { bookingStatusSchema } from '@/lib/validators';

export async function updateBookingStatusAction(input: unknown) {
  await requireRole(['pemilik', 'admin']);
  const validated = bookingStatusSchema.parse(input);

  const [booking] = await db
    .select()
    .from(bookingRequests)
    .where(eq(bookingRequests.id, validated.bookingId))
    .limit(1);

  if (!booking) {
    throw new Error('Permintaan booking tidak ditemukan');
  }

  await db
    .update(bookingRequests)
    .set({
      status: validated.status,
      holdUntil: validated.holdUntil ? new Date(validated.holdUntil) : null,
    })
    .where(eq(bookingRequests.id, validated.bookingId));

  // Jika ditolak atau kedaluwarsa dan sebelumnya menahan kamar
  if ((validated.status === 'ditolak' || validated.status === 'kedaluwarsa') && booking.roomId) {
    const [currentRoom] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, booking.roomId))
      .limit(1);

    if (currentRoom && currentRoom.status === 'kosong') {
      await db
        .update(rooms)
        .set({ status: 'kosong', updatedAt: new Date() })
        .where(eq(rooms.id, booking.roomId));
    }
  }

  return { success: true };
}
