import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const surveySlots = pgTable('survey_slots', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .references(() => properties.id)
    .notNull(),
  date: text('date').notNull(), // 'YYYY-MM-DD'
  timeSlot: text('time_slot').notNull(), // misal '10:00 - 11:00'
  quota: integer('quota').notNull().default(3),
  bookedCount: integer('booked_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type SurveySlot = typeof surveySlots.$inferSelect;
export type NewSurveySlot = typeof surveySlots.$inferInsert;
