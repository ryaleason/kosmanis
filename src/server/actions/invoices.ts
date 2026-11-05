'use server';

import { db } from '@/db';
import { invoices, payments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth/session';
import { verifyPaymentSchema } from '@/lib/validators';

export async function verifyPaymentAction(input: unknown) {
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

export async function acceptPaymentFormAction(formData: FormData): Promise<void> {
  const paymentId = formData.get('paymentId') as string;
  if (!paymentId) throw new Error('ID Pembayaran diperlukan');
  await verifyPaymentAction({ paymentId, status: 'diterima' });
}

export async function rejectPaymentFormAction(formData: FormData): Promise<void> {
  const paymentId = formData.get('paymentId') as string;
  const reason = (formData.get('reason') as string) || 'Bukti transfer tidak terbaca';
  if (!paymentId) throw new Error('ID Pembayaran diperlukan');
  await verifyPaymentAction({ paymentId, status: 'ditolak', rejectionReason: reason });
}
