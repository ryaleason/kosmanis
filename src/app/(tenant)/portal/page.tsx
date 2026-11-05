import Link from 'next/link';
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getSeedData } from '@/db/seed';
import { formatRupiah, formatDateWIB } from '@/lib/format';
import { Home, Receipt, Calendar, ArrowUpRight } from 'lucide-react';


export default async function TenantPortalPage() {
  let tenantInvoices;
  let activeLease;
  let activeRoom;

  try {
    const seed = getSeedData();
    tenantInvoices = await db.select().from(invoices).orderBy(desc(invoices.createdAt));
    activeLease = seed.leases[0];
    activeRoom = seed.rooms[0];
  } catch {
    const seed = getSeedData();
    tenantInvoices = seed.invoices;
    activeLease = seed.leases[0];
    activeRoom = seed.rooms[0];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Halo, Penghuni Kos!</h1>
        <p className="text-sm text-slate-600 mt-1">
          Pantau masa sewa kamar Anda dan riwayat tagihan bulanan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Kamar Anda</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">
              Kamar {activeRoom?.roomNumber || '101'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Tarif: {formatRupiah(activeLease?.rentAmount || 1500000)}/bulan
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Masa Sewa Kontrak</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              Berakhir: {activeLease ? formatDateWIB(activeLease.endDate) : '-'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Jatuh tempo tiap tgl {activeLease?.dueDay || 1}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-500" />
            <span>Riwayat Tagihan Sewa</span>
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {tenantInvoices.map((inv) => (
            <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">{inv.invoiceNumber}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      inv.status === 'lunas'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'menunggu_verifikasi'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Periode: Bulan {inv.periodMonth}/{inv.periodYear} · Jumlah: {formatRupiah(inv.amount)}
                </p>
              </div>

              <Link
                href={`/i/${inv.token}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 self-start sm:self-auto"
              >
                <span>Buka Tagihan & Bukti</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
