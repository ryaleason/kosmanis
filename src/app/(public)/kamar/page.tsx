import { db } from '@/db';
import { properties, roomTypes, rooms } from '@/db/schema';
import { getSeedData } from '@/db/seed';
import { formatRupiah } from '@/lib/format';
import { BookingModal } from '@/components/public/BookingModal';


export default async function RoomsCatalogPage() {
  let property;
  let allRooms;
  let allRoomTypes;

  try {
    const [p] = await db.select().from(properties).limit(1);
    property = p || getSeedData().property;
    allRooms = await db.select().from(rooms);
    allRoomTypes = await db.select().from(roomTypes);
  } catch {
    const seed = getSeedData();
    property = seed.property;
    allRooms = seed.rooms;
    allRoomTypes = seed.roomTypes;
  }

  const typeMap = new Map(allRoomTypes.map((t) => [t.id, t]));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Katalog Kamar & Ketersediaan</h1>
        <p className="text-sm text-slate-600 mt-1">
          Pilih kamar yang sesuai dengan kebutuhan Anda. Status kamar diperbarui secara real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allRooms.map((room) => {
          const type = typeMap.get(room.roomTypeId);
          const isVacant = room.status === 'kosong';

          return (
            <div
              key={room.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-400 relative">
                  <span className="text-xs font-semibold">Foto Kamar {room.roomNumber}</span>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        room.status === 'kosong'
                          ? 'bg-emerald-600 text-white'
                          : room.status === 'terisi'
                          ? 'bg-slate-700 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {room.status === 'kosong'
                        ? 'Kosong'
                        : room.status === 'terisi'
                        ? 'Terisi'
                        : 'Segera Kosong'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Kamar {room.roomNumber}</h3>
                      <p className="text-xs text-slate-500">Lantai {room.floor} · {type?.name || 'Tipe Kamar'}</p>
                    </div>
                    <span className="text-base font-extrabold text-blue-600">
                      {type ? formatRupiah(type.basePrice) : '-'}
                      <span className="text-xs font-normal text-slate-400">/bln</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                    {type?.description || 'Fasilitas lengkap dan siap huni.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {type?.facilities &&
                      (type.facilities as string[]).slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {f}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                {isVacant ? (
                  <BookingModal
                    propertyId={property.id || ''}
                    roomId={room.id}
                    roomNumber={room.roomNumber}
                    roomTypeName={type?.name}
                  />
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 bg-slate-100 text-slate-400 font-semibold text-xs rounded-xl cursor-not-allowed"
                  >
                    Kamar Sedang Terisi
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
