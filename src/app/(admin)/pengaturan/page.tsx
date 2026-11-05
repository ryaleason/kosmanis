import { db } from '@/db';
import { properties } from '@/db/schema';
import { getSeedData } from '@/db/seed';
import { updatePropertySettingsAction } from '@/server/actions/property';

export const dynamic = 'force-dynamic';

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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Karakteristik Kos</h2>
        <p className="text-sm text-slate-600 mt-1">
          Atur identitas, kategori jenis kelamin penghuni, aturan kos, fasilitas bersama, dan rekening pembayaran.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <form
          action={async (formData: FormData) => {
            'use server';
            const name = formData.get('name') as string;
            const category = formData.get('category') as 'putra' | 'putri' | 'campur';
            const address = formData.get('address') as string;
            const city = formData.get('city') as string;
            const whatsappNumber = formData.get('whatsappNumber') as string;
            const description = formData.get('description') as string;

            await updatePropertySettingsAction({
              id: property.id,
              name,
              category,
              address,
              city,
              whatsappNumber,
              description,
              rules: property.rules || [],
              facilities: property.facilities || [],
              bankAccounts: property.bankAccounts || [],
            });
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Kos</label>
            <input
              type="text"
              name="name"
              defaultValue={property.name}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori Penghuni Kos</label>
            <select
              name="category"
              defaultValue={property.category}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="campur">Kos Campur (Putra & Putri)</option>
              <option value="putra">Khusus Putra</option>
              <option value="putri">Khusus Putri</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Kategori ini akan tampil sebagai label identitas dan filter pencarian di etalase publik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kota</label>
              <input
                type="text"
                name="city"
                defaultValue={property.city}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp Pengelola</label>
              <input
                type="text"
                name="whatsappNumber"
                defaultValue={property.whatsappNumber}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
            <textarea
              name="address"
              rows={2}
              defaultValue={property.address}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Singkat Kos</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={property.description || ''}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
            >
              Simpan Perubahan Karakteristik Kos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
