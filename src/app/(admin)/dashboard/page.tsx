import { db } from '@/db';
import { rooms, invoices, leases, tenants, payments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { WhatsAppReminderButton } from '@/components/admin/WhatsAppReminderButton';
import { getSeedData } from '@/db/seed';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let allRooms;
  let allInvoices;
  let allPayments;

  try {
    allRooms = await db.select().from(rooms);
    allInvoices = await db.select().from(invoices).orderBy(desc(invoices.createdAt));
    allPayments = await db.select().from(payments).where(eq(payments.status, 'menunggu_verifikasi'));
  } catch {
    const seed = getSeedData();
    allRooms = seed.rooms;
    allInvoices = seed.invoices;
    allPayments = seed.payments.filter((p) => p.status === 'menunggu_verifikasi');
  }

  const totalRooms = allRooms.length;
  const occupiedRooms = allRooms.filter((r) => r.status === 'terisi').length;
  const vacantRooms = allRooms.filter((r) => r.status === 'kosong').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const pendingVerificationCount = allPayments.length;
  const unpaidCount = allInvoices.filter((i) => i.status === 'belum_bayar' || i.status === 'terlambat').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Operasional</h2>
        <p className="text-sm text-slate-600 mt-1">
          Pantau status keterisian kamar, verifikasi pembayaran, dan tindak lanjuti tagihan kos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tingkat Okupansi</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">{occupancyRate}%</p>
          <p className="text-xs text-slate-500 mt-1">{occupiedRooms} dari {totalRooms} kamar terisi</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kamar Kosong</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{vacantRooms}</p>
          <p className="text-xs text-slate-500 mt-1">Siap dipasarkan</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Menunggu Verifikasi</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{pendingVerificationCount}</p>
          <p className="text-xs text-slate-500 mt-1">Bukti bayar baru diunggah</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Belum Bayar</p>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">{unpaidCount}</p>
          <p className="text-xs text-slate-500 mt-1">Perlu pengingat</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Tagihan Jatuh Tempo & Pengingat</h3>
          <span className="text-xs text-slate-500">Kirim pesan WhatsApp semi-manual</span>
        </div>
        <div className="divide-y divide-slate-100">
          {allInvoices.slice(0, 5).map((inv) => (
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
                  Nominal: Rp {inv.amount.toLocaleString('id-ID')} · Jatuh Tempo: {new Date(inv.dueDate).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <WhatsAppReminderButton
                  data={{
                    phoneNumber: '08123456789',
                    tenantName: 'Penghuni Kos',
                    roomNumber: 'Kamar',
                    amount: inv.amount,
                    dueDate: new Date(inv.dueDate).toLocaleDateString('id-ID'),
                    invoiceUrl: `https://kosmanis.com/i/${inv.token}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
