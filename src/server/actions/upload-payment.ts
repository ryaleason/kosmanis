import { z } from 'zod';
import { db } from '@/db';
import { invoices, payments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isAllowedMimeType, isAllowedFileSize } from '@/lib/storage';

export const uploadPaymentProofSchema = z.object({
  invoiceToken: z.string().min(1, 'Token tagihan tidak valid'),
  paymentMethod: z.enum(['transfer_manual', 'qris_statis']).default('transfer_manual'),
  proofImageUrl: z.string().min(1, 'Bukti pembayaran wajib dilampirkan'),
});

export async function uploadPaymentProofAction(input: unknown) {
  'use server';
  const validated = uploadPaymentProofSchema.parse(input);

  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.token, validated.invoiceToken))
    .limit(1);

  if (!invoice) {
    throw new Error('Tagihan tidak ditemukan atau tautan telah kedaluwarsa');
  }

  if (invoice.status === 'lunas') {
    throw new Error('Tagihan ini sudah lunas');
  }

  // 1. Buat record payment
  const [payment] = await db
    .insert(payments)
    .values({
      propertyId: invoice.propertyId,
      invoiceId: invoice.id,
      amount: invoice.amount,
      paymentMethod: validated.paymentMethod,
      proofImageUrl: validated.proofImageUrl,
      status: 'menunggu_verifikasi',
    })
    .returning();

  // 2. Ubah status invoice menjadi menunggu_verifikasi
  await db
    .update(invoices)
    .set({ status: 'menunggu_verifikasi' })
    .where(eq(invoices.id, invoice.id));

  return { success: true, paymentId: payment.id };
}
