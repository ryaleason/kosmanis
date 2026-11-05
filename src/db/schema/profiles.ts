import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id),
  role: text('role', { enum: ['pemilik', 'admin', 'penghuni'] }).notNull().default('penghuni'),
  fullName: text('full_name').notNull(),
  phoneNumber: text('phone_number'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
