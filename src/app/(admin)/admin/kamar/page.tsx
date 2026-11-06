import { db } from '@/db';
import { rooms, roomTypes } from '@/db/schema';
import { getSeedData } from '@/db/seed';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Plus } from 'lucide-react';

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
      <AdminPageHeader
        title="Manajemen Kamar & Tipe"
        description="Kelola nomor kamar, status ketersediaan, serta spesifikasi tipe kamar."
        action={
          /* TODO: Modal Tambah Tipe Kamar saat backend mutation siap */
          <button
            type="button"
            disabled
            className="h-10 px-5 rounded-full bg-[#1CA3D4] text-white text-[14px] font-semibold inline-flex items-center gap-2 opacity-60 cursor-not-allowed"
            title="Fitur Tambah Tipe segera hadir"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tipe</span>
          </button>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#1F2937]">Daftar Kamar Fisik</h2>
          <span className="text-[13px] text-[#6B7280]">{allRooms.length} kamar</span>
        </div>

        <div className="border border-[#E5E7EB] rounded-[12px] overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1F2937]">
              <thead className="bg-[#F3F9FD] text-[12px] uppercase font-semibold text-[#6B7280] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-3.5">No. Kamar</th>
                  <th className="px-6 py-3.5">Tipe</th>
                  <th className="px-6 py-3.5">Lantai</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {allRooms.map((room) => (
                  <tr key={room.id} className="h-16 hover:bg-[#F3F9FD] transition">
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">{room.roomNumber}</td>
                    <td className="px-6 py-4 text-[#1F2937]">
                      {typeMap.get(room.roomTypeId) || 'Standard'}
                    </td>
                    <td className="px-6 py-4 text-[#4B5563]">Lantai {room.floor}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={room.status} />
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#6B7280]">
                      {room.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
