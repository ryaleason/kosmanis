import { notFound } from 'next/navigation';
import { db } from '@/db';
import { invoices, leases, tenants, rooms, properties } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSeedData } from '@/db/seed';
import { formatRupiah, formatDateWIB } from '@/lib/format';
import { UploadProofForm } from '@/components/tenant/UploadProofForm';
import { QrCode, CreditCard, Clock, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface InvoicePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvoiceTokenPage({ params }: InvoicePageProps) {
  const { token } = await params;

  let invoice;
  let lease;
  let tenant;
  let room;
  let property;

  try {
    const [inv] = await db.select().from(invoices).where(eq(invoices.token, token)).limit(1);
    invoice = inv;

    if (invoice) {
      const [l] = await db.select().from(leases).where(eq(leases.id, invoice.leaseId)).limit(1);
      lease = l;
      if (lease) {
        const [t] = await db.select().from(tenants).where(eq(tenants.id, lease.tenantId)).limit(1);
        tenant = t;
        const [r] = await db.select().from(rooms).where(eq(rooms.id, lease.roomId)).limit(1);
        room = r;
      }
      const [p] = await db.select().from(properties).where(eq(properties.id, invoice.propertyId)).limit(1);
      property = p;
    }
  } catch {
    const seed = getSeedData();
    invoice = seed.invoices.find((i) => i.token === token) || seed.invoices[0];
    lease = seed.leases[0];
    tenant = seed.tenants[0];
    room = seed.rooms[0];
    property = seed.property;
  }

  if (!invoice) {
    notFound();
  }

  const isPaid = invoice.status === 'lunas';
  const isPending = invoice.status === 'menunggu_verifikasi';

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header Tagihan */}
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {property?.name || 'Kos Manis'}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold mt-1">Tagihan Sewa Kamar</h1>
              <p className="text-xs text-slate-400 mt-0.5">No. Tagihan: {invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isPaid
                    ? 'bg-emerald-500 text-white'
                    : isPending
                    ? 'bg-amber-400 text-amber-950'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {isPaid && <CheckCircle2 className="w-3.5 h-3.5" />}
                {isPending && <Clock className="w-3.5 h-3.5" />}
                {invoice.status === 'lunas'
                  ? 'Lunas'
                  : invoice.status === 'menunggu_verifikasi'
                  ? 'Menunggu Verifikasi'
                  : 'Belum Bayar'}
              </span>
            </div>
          </div>
        </div>

        {/* Rincian Tagihan */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-100 text-xs">
            <div>
              <p className="text-slate-400 uppercase font-semibold">Nama Penghuni</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{tenant?.name || 'Penghuni'}</p>
              <p className="text-slate-500">{tenant?.phoneNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold">Kamar & Periode</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                Kamar {room?.roomNumber || '101'}
              </p>
              <p className="text-slate-500">Bulan {invoice.periodMonth} / {invoice.periodYear}</p>
            </div>
          </div>

          <div className="flex items-baseline justify-between py-2">
            <span className="text-sm font-semibold text-slate-700">Total yang Harus Dibayar</span>
            <span className="text-2xl font-black text-blue-600">
              {formatRupiah(invoice.amount)}
            </span>
          </div>

          <div className="text-xs text-slate-500">
            Jatuh tempo: <strong>{formatDateWIB(invoice.dueDate)}</strong>
          </div>

          {/* Instruksi Pembayaran */}
          {!isPaid && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Instruksi Transfer Rekening Kos</span>
              </h3>

              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                {property?.bankAccounts &&
                  property.bankAccounts.map((acc, i) => (
                    <div key={i} className="flex justify-between items-center py-1">
                      <div>
                        <p className="font-bold text-slate-800">{acc.bankName}</p>
                        <p className="text-slate-500 text-[11px]">{acc.accountHolder}</p>
                      </div>
                      <span className="font-mono font-bold text-blue-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                        {acc.accountNumber}
                      </span>
                    </div>
                  ))}
              </div>

              {property?.qrisImageUrl && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                    <QrCode className="w-4 h-4" />
                    <span>Scan QRIS Kos Manis</span>
                  </div>
                  <div className="w-44 h-44 bg-white border border-slate-300 rounded-lg mx-auto flex items-center justify-center text-xs text-slate-400">
                    Gambar QRIS Statis
                  </div>
                </div>
              )}

              {/* Form Unggah Bukti Bayar */}
              <div className="pt-4">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Unggah Bukti Transfer</h4>
                <UploadProofForm invoiceToken={token} />
              </div>
            </div>
          )}

          {isPaid && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
              <p className="text-xs font-semibold text-emerald-800">
                Terima kasih! Pembayaran Anda telah diverifikasi oleh pengelola kos. Kuitansi ini berlaku sebagai bukti pelunasan sah.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
