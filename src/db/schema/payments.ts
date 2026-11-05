import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { properties } from './properties';
import { invoices } from './invoices';
import { profiles } from './profiles';

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id')
    .references(() => properties.id)
    .notNull(),
  invoiceId: uuid('invoice_id')
    .references(() => invoices.id)
    .notNull(),
  amount: integer('amount').notNull(), // dalam Rupiah
  paymentMethod: text('payment_method', { enum: ['transfer_manual', 'qris_statis'] })
    .notNull()
    .default('transfer_manual'),
  proofImageUrl: text('proof_image_url').notNull(),
  status: text('status', { enum: ['menunggu_verifikasi', 'diterima', 'ditolak'] })
    .notNull()
    .default('menunggu_verifikasi'),
  rejectionReason: text('rejection_reason'),
  verifiedBy: uuid('verified_by').references(() => profiles.id),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
