import { z } from 'zod';
import { db } from '@/db';
import { invoices, payments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';

export const verifyPaymentSchema = z.object({
  paymentId: z.string().uuid(),
  status: z.enum(['diterima', 'ditolak']),
  rejectionReason: z.string().optional(),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

export async function verifyPaymentAction(input: unknown) {
  'use server';
  const profile = await requireRole(['pemilik', 'admin']);
  const validated = verifyPaymentSchema.parse(input);

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, validated.paymentId))
    .limit(1);

  if (!payment) {
    throw new Error('Data pembayaran tidak ditemukan');
  }

  // Update status payment
  await db
    .update(payments)
    .set({
      status: validated.status,
      rejectionReason: validated.rejectionReason,
      verifiedBy: profile.id,
      verifiedAt: new Date(),
    })
    .where(eq(payments.id, validated.paymentId));

  // Jika diterima, ubah invoice menjadi lunas. Jika ditolak, kembali ke belum_bayar
  const invoiceStatus = validated.status === 'diterima' ? 'lunas' : 'belum_bayar';
  await db
    .update(invoices)
    .set({ status: invoiceStatus })
    .where(eq(invoices.id, payment.invoiceId));

  return { success: true };
}
