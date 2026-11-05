import { pgTable, uuid, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const roomTypes = pgTable('room_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .references(() => properties.id)
    .notNull(),
  name: text('name').notNull(),
  description: text('description'),
  facilities: jsonb('facilities').$type<string[]>().default([]),
  basePrice: integer('base_price').notNull(), // dalam Rupiah
  depositAmount: integer('deposit_amount').notNull().default(0),
  electricityMode: text('electricity_mode', {
    enum: ['termasuk_sewa', 'bayar_sendiri'],
  })
    .notNull()
    .default('termasuk_sewa'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .references(() => properties.id)
    .notNull(),
  roomTypeId: uuid('room_type_id')
    .references(() => roomTypes.id)
    .notNull(),
  roomNumber: text('room_number').notNull(),
  floor: integer('floor').notNull().default(1),
  status: text('status', { enum: ['kosong', 'terisi', 'segera_kosong'] })
    .notNull()
    .default('kosong'),
  images: jsonb('images').$type<string[]>().default([]),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type RoomType = typeof roomTypes.$inferSelect;
export type NewRoomType = typeof roomTypes.$inferInsert;
export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
