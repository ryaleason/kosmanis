import { db } from '@/db';
import { tenants, leases } from '@/db/schema';
import { getSeedData } from '@/db/seed';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { MaskedNik } from '@/components/admin/MaskedNik';
import { UserPlus } from 'lucide-react';

export default async function AdminTenantsPage() {
  let allTenants;
  let allLeases;

  try {
    allTenants = await db.select().from(tenants);
    allLeases = await db.select().from(leases);
  } catch {
    const seed = getSeedData();
    allTenants = seed.tenants;
    allLeases = seed.leases;
  }

  const leaseMap = new Map(allLeases.map((l) => [l.tenantId, l]));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Penghuni & Kontrak Sewa"
        description="Daftar penyewa aktif beserta rincian kontrak dan snapshot biaya sewa."
        action={
          /* TODO: Modal Tambah Penghuni saat backend onboarding siap */
          <button
            type="button"
            disabled
            className="h-10 px-5 rounded-full bg-[#1CA3D4] text-white text-[14px] font-semibold inline-flex items-center gap-2 opacity-60 cursor-not-allowed"
            title="Fitur Tambah Penghuni segera hadir"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Penghuni</span>
          </button>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#1F2937]">Daftar Penghuni Aktif</h2>
          <span className="text-[13px] text-[#6B7280]">{allTenants.length} penghuni</span>
        </div>

        <div className="border border-[#E5E7EB] rounded-[12px] overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1F2937]">
              <thead className="bg-[#F3F9FD] text-[12px] uppercase font-semibold text-[#6B7280] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-3.5">Nama</th>
                  <th className="px-6 py-3.5">No. HP</th>
                  <th className="px-6 py-3.5">NIK</th>
                  <th className="px-6 py-3.5">Tarif Sewa (Snapshot)</th>
                  <th className="px-6 py-3.5">Kontak Darurat</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {allTenants.map((tenant) => {
                  const lease = tenant.id ? leaseMap.get(tenant.id) : undefined;
                  return (
                    <tr key={tenant.id} className="h-16 hover:bg-[#F3F9FD] transition">
                      <td className="px-6 py-4 font-semibold text-[#0F172A] whitespace-nowrap">
                        {tenant.name}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#4B5563] whitespace-nowrap font-[family-name:inherit] tabular-nums">
                        {tenant.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <MaskedNik nik={tenant.idCardNumber} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lease ? (
                          <div className="inline-flex items-baseline">
                            <span className="text-[14px] font-semibold text-[#0F172A] tabular-nums">
                              Rp {lease.rentAmount.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[12px] text-[#6B7280] ml-1">/bln</span>
                          </div>
                        ) : (
                          <span className="text-[#6B7280] text-[14px]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[14px]">
                        {tenant.emergencyContactName ? (
                          <div>
                            <p className="font-medium text-[#1F2937]">
                              {tenant.emergencyContactName}
                            </p>
                            <p className="text-[13px] text-[#4B5563] tabular-nums">
                              {tenant.emergencyContactPhone}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[#6B7280]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={tenant.status} />
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
