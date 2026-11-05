import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { properties } from './properties';
import { rooms } from './rooms';

export const bookingRequests = pgTable('booking_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .references(() => properties.id)
    .notNull(),
  roomId: uuid('room_id').references(() => rooms.id),
  name: text('name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  plannedStartDate: timestamp('planned_start_date', { withTimezone: true }).notNull(),
  durationMonths: integer('duration_months').notNull().default(1),
  status: text('status', {
    enum: ['baru', 'dihubungi', 'survei_dijadwalkan', 'disetujui', 'ditolak', 'kedaluwarsa'],
  })
    .notNull()
    .default('baru'),
  holdUntil: timestamp('hold_until', { withTimezone: true }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type BookingRequest = typeof bookingRequests.$inferSelect;
export type NewBookingRequest = typeof bookingRequests.$inferInsert;
