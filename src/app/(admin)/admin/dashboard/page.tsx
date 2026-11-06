import { db } from '@/db';
import { rooms, invoices, payments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { WhatsAppReminderButton } from '@/components/admin/WhatsAppReminderButton';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getSeedData } from '@/db/seed';

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
  const recentInvoices = allInvoices.slice(0, 5);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard Operasional"
        description="Pantau status keterisian kamar, verifikasi pembayaran, dan tindak lanjuti tagihan kos."
      />

      {/* Baris Statistik Tunggal */}
      <div className="border border-[#E5E7EB] rounded-[12px] bg-white divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tingkat Okupansi */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1CA3D4] shrink-0" />
              <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Tingkat Okupansi
              </span>
            </div>
            <p className="text-[36px] font-bold text-[#0F172A] leading-tight mt-3">
              {occupancyRate}%
            </p>
          </div>
          <div className="mt-3">
            <div className="w-full bg-[#E5E7EB] h-[6px] rounded-full overflow-hidden">
              <div
                className="bg-[#1CA3D4] h-full rounded-full transition-all"
                style={{ width: `${Math.min(occupancyRate, 100)}%` }}
              />
            </div>
            <p className="text-[13px] text-[#6B7280] mt-2">
              {occupiedRooms} dari {totalRooms} kamar terisi
            </p>
          </div>
        </div>

        {/* Kamar Kosong */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1CA3D4] shrink-0" />
              <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Kamar Kosong
              </span>
            </div>
            <p className="text-[36px] font-bold text-[#0F172A] leading-tight mt-3">
              {vacantRooms}
            </p>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-3">Siap dipasarkan</p>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  pendingVerificationCount > 0 ? 'bg-[#D97706]' : 'bg-[#1CA3D4]'
                }`}
              />
              <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Menunggu Verifikasi
              </span>
            </div>
            <p className="text-[36px] font-bold text-[#0F172A] leading-tight mt-3">
              {pendingVerificationCount}
            </p>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-3">Bukti bayar baru diunggah</p>
        </div>

        {/* Belum Bayar */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  unpaidCount > 0 ? 'bg-[#DC2626]' : 'bg-[#1CA3D4]'
                }`}
              />
              <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Belum Bayar
              </span>
            </div>
            <p className="text-[36px] font-bold text-[#0F172A] leading-tight mt-3">
              {unpaidCount}
            </p>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-3">Perlu tindak lanjut / pengingat</p>
        </div>
      </div>

      {/* Daftar Tagihan Jatuh Tempo & Pengingat */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#1F2937]">
            Tagihan Jatuh Tempo & Pengingat
          </h2>
          <span className="text-[13px] text-[#6B7280]">
            Kirim pesan WhatsApp semi-manual
          </span>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="border border-dashed border-[#E5E7EB] rounded-[12px] p-8 text-center bg-white">
            <p className="text-[14px] text-[#6B7280]">
              Tidak ada tagihan jatuh tempo saat ini.
            </p>
          </div>
        ) : (
          <div className="border border-[#E5E7EB] rounded-[12px] bg-white divide-y divide-[#E5E7EB] overflow-hidden">
            {recentInvoices.map((inv) => {
              const dueDateFormatted = new Date(inv.dueDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={inv.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F3F9FD] transition"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-semibold text-[#0F172A]">
                        {inv.invoiceNumber}
                      </span>
                      <StatusBadge status={inv.status} />
                    </div>
                    <p className="text-[13px] text-[#6B7280] mt-1.5">
                      Nominal:{' '}
                      <strong className="font-semibold text-[#1F2937]">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </strong>{' '}
                      · Jatuh Tempo: {dueDateFormatted}
                    </p>
                  </div>
                  <div>
                    <WhatsAppReminderButton
                      data={{
                        phoneNumber: '08123456789',
                        tenantName: 'Penghuni Kos',
                        roomNumber: 'Kamar',
                        amount: inv.amount,
                        dueDate: dueDateFormatted,
                        invoiceUrl: `https://kosmanis.com/i/${inv.token}`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
