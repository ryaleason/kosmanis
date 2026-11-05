import { db } from '@/db';
import { invoices, payments } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getSeedData } from '@/db/seed';
import { acceptPaymentFormAction, rejectPaymentFormAction } from '@/server/actions/invoices';


export default async function AdminInvoicesPage() {
  let allInvoices;
  let allPayments;

  try {
    allInvoices = await db.select().from(invoices).orderBy(desc(invoices.createdAt));
    allPayments = await db.select().from(payments);
  } catch {
    const seed = getSeedData();
    allInvoices = seed.invoices;
    allPayments = seed.payments;
  }

  const paymentMap = new Map(allPayments.map((p) => [p.invoiceId, p]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tagihan & Pembayaran</h2>
        <p className="text-sm text-slate-600 mt-1">
          Verifikasi bukti pembayaran transfer/QRIS dan pantau status tagihan bulanan.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Daftar Tagihan Sewa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">No. Tagihan</th>
                <th className="px-6 py-3">Periode</th>
                <th className="px-6 py-3">Jumlah</th>
                <th className="px-6 py-3">Jatuh Tempo</th>
                <th className="px-6 py-3">Status Tagihan</th>
                <th className="px-6 py-3">Bukti Bayar</th>
                <th className="px-6 py-3 text-right">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allInvoices.map((inv) => {
                const payment = inv.id ? paymentMap.get(inv.id) : undefined;
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">Bulan {inv.periodMonth} / {inv.periodYear}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      Rp {inv.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">{new Date(inv.dueDate).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          inv.status === 'lunas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'menunggu_verifikasi'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment ? (
                        <span className="text-xs text-blue-600 underline cursor-pointer">
                          Lihat Bukti
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment && payment.status === 'menunggu_verifikasi' ? (
                        <div className="flex items-center justify-end gap-2">
                          <form action={acceptPaymentFormAction}>
                            <input type="hidden" name="paymentId" value={payment.id} />
                            <button
                              type="submit"
                              className="px-2.5 py-1 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            >
                              Terima
                            </button>
                          </form>
                          <form action={rejectPaymentFormAction}>
                            <input type="hidden" name="paymentId" value={payment.id} />
                            <input type="hidden" name="reason" value="Bukti transfer tidak terbaca" />
                            <button
                              type="submit"
                              className="px-2.5 py-1 text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 rounded hover:bg-rose-100"
                            >
                              Tolak
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
