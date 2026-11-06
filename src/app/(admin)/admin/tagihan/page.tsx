import { db } from '@/db';
import { invoices, payments } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getSeedData } from '@/db/seed';
import { acceptPaymentFormAction, rejectPaymentFormAction } from '@/server/actions/invoices';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { FilePlus } from 'lucide-react';

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
      <AdminPageHeader
        title="Tagihan & Pembayaran"
        description="Verifikasi bukti pembayaran transfer/QRIS dan pantau status tagihan bulanan."
        action={
          /* TODO: Modal Buat Tagihan Manual saat mutation siap */
          <button
            type="button"
            disabled
            className="h-10 px-5 rounded-full bg-[#1CA3D4] text-white text-[14px] font-semibold inline-flex items-center gap-2 opacity-60 cursor-not-allowed"
            title="Fitur Buat Tagihan segera hadir"
          >
            <FilePlus className="w-4 h-4" />
            <span>Buat Tagihan</span>
          </button>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#1F2937]">Daftar Tagihan Sewa</h2>
          <span className="text-[13px] text-[#6B7280]">{allInvoices.length} tagihan</span>
        </div>

        <div className="border border-[#E5E7EB] rounded-[12px] overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1F2937]">
              <thead className="bg-[#F3F9FD] text-[12px] uppercase font-semibold text-[#6B7280] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-3.5">No. Tagihan</th>
                  <th className="px-6 py-3.5">Periode</th>
                  <th className="px-6 py-3.5">Jumlah</th>
                  <th className="px-6 py-3.5">Jatuh Tempo</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Bukti Bayar</th>
                  <th className="px-6 py-3.5 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {allInvoices.map((inv) => {
                  const payment = inv.id ? paymentMap.get(inv.id) : undefined;
                  const dueDateFormatted = new Date(inv.dueDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={inv.id} className="h-16 hover:bg-[#F3F9FD] transition">
                      <td className="px-6 py-4 font-semibold text-[#0F172A] whitespace-nowrap">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-[#4B5563] whitespace-nowrap text-[14px]">
                        Bulan {inv.periodMonth} / {inv.periodYear}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#0F172A] whitespace-nowrap tabular-nums text-[14px]">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-[#4B5563] whitespace-nowrap tabular-nums text-[14px]">
                        {dueDateFormatted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment ? (
                          <span className="text-[13px] font-medium text-[#1CA3D4] hover:underline cursor-pointer">
                            Lihat Bukti
                          </span>
                        ) : (
                          <span className="text-[13px] text-[#9CA3AF]">Belum ada</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {payment && payment.status === 'menunggu_verifikasi' ? (
                          <div className="flex items-center justify-end gap-2">
                            <form action={acceptPaymentFormAction}>
                              <input type="hidden" name="paymentId" value={payment.id} />
                              <button
                                type="submit"
                                className="px-3.5 py-1.5 text-xs font-semibold bg-[#16A34A] text-white rounded-full hover:bg-[#15803D] transition focus:outline-none focus-visible:outline-2 focus-visible:outline-[#16A34A]"
                              >
                                Terima
                              </button>
                            </form>
                            <form action={rejectPaymentFormAction}>
                              <input type="hidden" name="paymentId" value={payment.id} />
                              <input
                                type="hidden"
                                name="reason"
                                value="Bukti transfer tidak terbaca"
                              />
                              <button
                                type="submit"
                                className="px-3.5 py-1.5 text-xs font-semibold bg-white text-[#DC2626] border border-[#DC2626] rounded-full hover:bg-[#FEE2E2] transition focus:outline-none focus-visible:outline-2 focus-visible:outline-[#DC2626]"
                              >
                                Tolak
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-[13px] text-[#9CA3AF]">-</span>
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
    </div>
  );
}
