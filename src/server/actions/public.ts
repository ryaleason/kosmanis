'use server';

import { db } from '@/db';
import { bookingRequests, surveySlots } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { publicBookingSchema, publicSurveySchema } from '@/lib/validators';

export async function submitBookingAction(input: unknown) {
  const validated = publicBookingSchema.parse(input);

  const [booking] = await db
    .insert(bookingRequests)
    .values({
      propertyId: validated.propertyId,
      roomId: validated.roomId || null,
      name: validated.name,
      phoneNumber: validated.phoneNumber,
      plannedStartDate: new Date(validated.plannedStartDate),
      durationMonths: validated.durationMonths,
      notes: validated.notes,
      status: 'baru',
    })
    .returning();

  return { success: true, bookingId: booking.id };
}

export async function submitSurveyAction(input: unknown) {
  const validated = publicSurveySchema.parse(input);

  const [slot] = await db
    .select()
    .from(surveySlots)
    .where(eq(surveySlots.id, validated.slotId))
    .limit(1);

  if (!slot) {
    throw new Error('Jadwal survei tidak ditemukan');
  }

  if (slot.bookedCount >= slot.quota) {
    throw new Error('Kuota slot survei ini sudah penuh');
  }

  await db
    .update(surveySlots)
    .set({ bookedCount: slot.bookedCount + 1 })
    .where(eq(surveySlots.id, validated.slotId));

  return { success: true };
}
