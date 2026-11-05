import { pgTable, uuid, text, integer, timestamp, unique } from 'drizzle-orm/pg-core';
import { properties } from './properties';
import { leases } from './leases';

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    propertyId: uuid('property_id')
      .references(() => properties.id)
      .notNull(),
    leaseId: uuid('lease_id')
      .references(() => leases.id)
      .notNull(),
    invoiceNumber: text('invoice_number').notNull().unique(),
    periodMonth: integer('period_month').notNull(), // 1 - 12
    periodYear: integer('period_year').notNull(),
    amount: integer('amount').notNull(), // dalam Rupiah
    status: text('status', {
      enum: ['belum_bayar', 'menunggu_verifikasi', 'lunas', 'terlambat', 'dibatalkan'],
    })
      .notNull()
      .default('belum_bayar'),
    dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('unique_lease_period').on(table.leaseId, table.periodMonth, table.periodYear),
  ]
);

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
