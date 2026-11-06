import { db } from '@/db';
import { properties } from '@/db/schema';
import { getSeedData } from '@/db/seed';
import { updatePropertyFormAction } from '@/server/actions/property';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export default async function AdminSettingsPage() {
  let property;

  try {
    const [p] = await db.select().from(properties).limit(1);
    property = p;
  } catch {
    property = getSeedData().property;
  }

  if (!property) {
    property = getSeedData().property;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pengaturan Karakteristik Kos"
        description="Atur identitas, kategori jenis kelamin penghuni, aturan kos, fasilitas bersama, dan rekening pembayaran."
      />

      <div className="max-w-4xl border border-[#E5E7EB] rounded-[12px] bg-white p-6 sm:p-8">
        <form action={updatePropertyFormAction} className="space-y-6">
          <input type="hidden" name="id" value={property.id} />

          {/* Bagian 1: Identitas & Kategori */}
          <div className="space-y-5">
            <div>
              <h2 className="text-[18px] font-semibold text-[#1F2937]">
                Identitas & Kategori Hunian
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                Pengaturan dasar nama properti dan target gender penghuni.
              </p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-[14px] font-semibold text-[#1F2937] mb-1"
              >
                Nama Kos
              </label>
              <p className="text-[13px] text-[#6B7280] mb-2">
                Nama resmi kos yang akan ditampilkan pada etalase publik dan invoice.
              </p>
              <input
                id="name"
                type="text"
                name="name"
                defaultValue={property.name}
                className="w-full h-11 px-4 border border-[#E5E7EB] rounded-[12px] bg-white text-[14px] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1CA3D4] transition"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-[14px] font-semibold text-[#1F2937] mb-1"
              >
                Kategori Penghuni Kos
              </label>
              <p className="text-[13px] text-[#6B7280] mb-2">
                Kategori ini akan tampil sebagai label identitas dan filter pencarian di etalase publik.
              </p>
              <select
                id="category"
                name="category"
                defaultValue={property.category}
                className="w-full h-11 px-4 border border-[#E5E7EB] rounded-[12px] bg-white text-[14px] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1CA3D4] transition"
              >
                <option value="campur">Kos Campur (Putra & Putri)</option>
                <option value="putra">Khusus Putra</option>
                <option value="putri">Khusus Putri</option>
              </select>
            </div>
          </div>

          <div className="border-b border-[#E5E7EB]" />

          {/* Bagian 2: Kontak & Lokasi */}
          <div className="space-y-5">
            <div>
              <h2 className="text-[18px] font-semibold text-[#1F2937]">
                Kontak & Lokasi Properti
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                Informasi narahubung WhatsApp dan alamat fisik kos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="city"
                  className="block text-[14px] font-semibold text-[#1F2937] mb-1"
                >
                  Kota
                </label>
                <p className="text-[13px] text-[#6B7280] mb-2">
                  Wilayah kota atau kabupaten operasional.
                </p>
                <input
                  id="city"
                  type="text"
                  name="city"
                  defaultValue={property.city}
                  className="w-full h-11 px-4 border border-[#E5E7EB] rounded-[12px] bg-white text-[14px] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1CA3D4] transition"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="whatsappNumber"
                  className="block text-[14px] font-semibold text-[#1F2937] mb-1"
                >
                  Nomor WhatsApp Pengelola
                </label>
                <p className="text-[13px] text-[#6B7280] mb-2">
                  Format angka (misal: 08123456789) untuk menerima booking.
                </p>
                <input
                  id="whatsappNumber"
                  type="text"
                  name="whatsappNumber"
                  defaultValue={property.whatsappNumber}
                  className="w-full h-11 px-4 border border-[#E5E7EB] rounded-[12px] bg-white text-[14px] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1CA3D4] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-[14px] font-semibold text-[#1F2937] mb-1"
              >
                Alamat Lengkap
              </label>
              <p className="text-[13px] text-[#6B7280] mb-2">
                Alamat jalan, nomor bangunan, dan patokan lokasi terdekat.
              </p>
              <textarea
                id="address"
                name="address"
                rows={3}
                defaultValue={property.address}
                className="w-full p-4 border border-[#E5E7EB] rounded-[12px] bg-white text-[14px] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1CA3D4] transition"
                required
              />
            </div>
          </div>

          <div className="border-b border-[#E5E7EB]" />

          {/* Bagian 3: Deskripsi Singkat */}
          <div className="space-y-5">
            <div>
              <h2 className="text-[18px] font-semibold text-[#1F2937]">
                Deskripsi Kos
              </h2>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                Gambaran umum fasilitas dan keunggulan untuk calon penyewa.
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-[14px] font-semibold text-[#1F2937] mb-1"
              >
                Deskripsi Singkat Kos
              </label>
              <p className="text-[13px] text-[#6B7280] mb-2">
                Paragraf penjelasan yang tampil pada bagian hero etalase publik.
              </p>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={property.description || ''}
                className="w-full p-4 border border-[#E5E7EB] rounded-[12px] bg-white text-[14px] text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1CA3D4] transition"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="h-11 px-7 rounded-full bg-[#1CA3D4] hover:bg-[#1693C9] text-white text-[14px] font-semibold transition focus:outline-none focus-visible:outline-2 focus-visible:outline-[#1CA3D4]"
            >
              Simpan Perubahan Karakteristik Kos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
