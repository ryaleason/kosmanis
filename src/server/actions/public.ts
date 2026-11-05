import { z } from 'zod';
import { db } from '@/db';
import { bookingRequests, surveySlots } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const publicBookingSchema = z.object({
  propertyId: z.string().uuid(),
  roomId: z.string().uuid().optional(),
  name: z.string().min(1, 'Nama wajib diisi'),
  phoneNumber: z.string().min(8, 'Nomor WhatsApp tidak valid'),
  plannedStartDate: z.string(),
  durationMonths: z.number().int().min(1).default(1),
  notes: z.string().optional(),
});

export async function submitBookingAction(input: unknown) {
  'use server';
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

export const publicSurveySchema = z.object({
  propertyId: z.string().uuid(),
  slotId: z.string().uuid(),
  name: z.string().min(1, 'Nama wajib diisi'),
  phoneNumber: z.string().min(8, 'Nomor WhatsApp tidak valid'),
});

export async function submitSurveyAction(input: unknown) {
  'use server';
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
