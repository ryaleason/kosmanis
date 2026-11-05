import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category', { enum: ['putra', 'putri', 'campur'] }).notNull().default('campur'),
  description: text('description'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  whatsappNumber: text('whatsapp_number').notNull(),
  rules: jsonb('rules').$type<string[]>().default([]),
  facilities: jsonb('facilities').$type<string[]>().default([]),
  qrisImageUrl: text('qris_image_url'),
  bankAccounts: jsonb('bank_accounts').$type<
    { bankName: string; accountNumber: string; accountHolder: string }[]
  >().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
