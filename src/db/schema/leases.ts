import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { properties } from './properties';
import { tenants } from './tenants';
import { rooms } from './rooms';

export const leases = pgTable('leases', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .references(() => properties.id)
    .notNull(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id)
    .notNull(),
  roomId: uuid('room_id')
    .references(() => rooms.id)
    .notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  rentAmount: integer('rent_amount').notNull(), // snapshot dalam Rupiah
  depositAmount: integer('deposit_amount').notNull().default(0), // snapshot dalam Rupiah
  dueDay: integer('due_day').notNull().default(1), // tanggal jatuh tempo (1-31)
  status: text('status', { enum: ['aktif', 'selesai', 'dibatalkan'] })
    .notNull()
    .default('aktif'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Lease = typeof leases.$inferSelect;
export type NewLease = typeof leases.$inferInsert;
