import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookingRequests, rooms } from '@/db/schema';
import { and, lt, isNotNull, inArray, eq } from 'drizzle-orm';
import { verifyCronAuth } from '@/lib/cron';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!verifyCronAuth(authHeader)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid CRON_SECRET' }, { status: 401 });
  }

  const now = new Date();

  try {
    // 1. Cari booking yang sedang di-hold namun batas waktu (holdUntil) sudah terlewati
    const expiredBookings = await db
      .select()
      .from(bookingRequests)
      .where(
        and(
          inArray(bookingRequests.status, ['disetujui', 'dihubungi']),
          isNotNull(bookingRequests.holdUntil),
          lt(bookingRequests.holdUntil, now)
        )
      );

    let releasedRoomsCount = 0;

    for (const booking of expiredBookings) {
      // Ubah status booking jadi kedaluwarsa
      await db
        .update(bookingRequests)
        .set({ status: 'kedaluwarsa' })
        .where(eq(bookingRequests.id, booking.id));

      // Kembalikan status kamar menjadi kosong jika kamar belum terisi kontrak aktif
      if (booking.roomId) {
        const [room] = await db
          .select()
          .from(rooms)
          .where(eq(rooms.id, booking.roomId))
          .limit(1);

        if (room && room.status !== 'terisi') {
          await db
            .update(rooms)
            .set({ status: 'kosong', updatedAt: new Date() })
            .where(eq(rooms.id, booking.roomId));
          releasedRoomsCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Berhasil memproses kedaluwarsa booking hold',
      expiredBookingsFound: expiredBookings.length,
      roomsReleasedToVacant: releasedRoomsCount,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memproses kedaluwarsa booking' },
      { status: 500 }
    );
  }
}
