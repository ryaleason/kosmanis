import { db } from '@/db';
import { rooms, roomTypes } from '@/db/schema';
import { getSeedData } from '@/db/seed';


export default async function AdminRoomsPage() {
  let allRooms;
  let allRoomTypes;

  try {
    allRooms = await db.select().from(rooms);
    allRoomTypes = await db.select().from(roomTypes);
  } catch {
    const seed = getSeedData();
    allRooms = seed.rooms;
    allRoomTypes = seed.roomTypes;
  }

  const typeMap = new Map(allRoomTypes.map((t) => [t.id, t.name]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Kamar & Tipe</h2>
          <p className="text-sm text-slate-600 mt-1">
            Kelola nomor kamar, status ketersediaan, serta spesifikasi tipe kamar.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Daftar Kamar Fisik</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">No. Kamar</th>
                <th className="px-6 py-3">Tipe</th>
                <th className="px-6 py-3">Lantai</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allRooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{room.roomNumber}</td>
                  <td className="px-6 py-4">{typeMap.get(room.roomTypeId) || 'Standard'}</td>
                  <td className="px-6 py-4">Lantai {room.floor}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        room.status === 'kosong'
                          ? 'bg-emerald-100 text-emerald-800'
                          : room.status === 'terisi'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {room.status === 'kosong'
                        ? 'Kosong'
                        : room.status === 'terisi'
                        ? 'Terisi'
                        : 'Segera Kosong'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{room.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
