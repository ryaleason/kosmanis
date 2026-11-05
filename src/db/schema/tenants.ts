import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { properties } from './properties';
import { profiles } from './profiles';

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .references(() => properties.id)
    .notNull(),
  profileId: uuid('profile_id').references(() => profiles.id),
  name: text('name').notNull(),
  idCardNumber: text('id_card_number'), // NIK
  idCardImageUrl: text('id_card_image_url'),
  phoneNumber: text('phone_number').notNull(),
  emergencyContactName: text('emergency_contact_name'),
  emergencyContactPhone: text('emergency_contact_phone'),
  status: text('status', { enum: ['aktif', 'keluar'] }).notNull().default('aktif'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
