import { db } from '@/db';
import { tenants, leases } from '@/db/schema';
import { getSeedData } from '@/db/seed';


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
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Penghuni & Kontrak Sewa</h2>
        <p className="text-sm text-slate-600 mt-1">
          Daftar penyewa aktif beserta rincian kontrak dan snapshot biaya sewa.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Daftar Penghuni Aktif</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">No. HP</th>
                <th className="px-6 py-3">NIK</th>
                <th className="px-6 py-3">Tarif Sewa (Snapshot)</th>
                <th className="px-6 py-3">Kontak Darurat</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allTenants.map((tenant) => {
                const lease = tenant.id ? leaseMap.get(tenant.id) : undefined;
                return (
                  <tr key={tenant.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">{tenant.name}</td>
                    <td className="px-6 py-4">{tenant.phoneNumber}</td>
                    <td className="px-6 py-4 text-xs font-mono">{tenant.idCardNumber || '-'}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {lease ? `Rp ${lease.rentAmount.toLocaleString('id-ID')}/bln` : '-'}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {tenant.emergencyContactName ? (
                        <>
                          <p className="font-medium text-slate-700">{tenant.emergencyContactName}</p>
                          <p className="text-slate-400">{tenant.emergencyContactPhone}</p>
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {tenant.status}
                      </span>
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
