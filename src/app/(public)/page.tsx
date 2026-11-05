import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/db';
import { properties, roomTypes, rooms } from '@/db/schema';
import { getSeedData } from '@/db/seed';
import { formatRupiah } from '@/lib/format';
import { CheckCircle2, ShieldAlert, Sparkles, MapPin, ArrowRight } from 'lucide-react';


export default async function HomePage() {
  let property;
  let allRoomTypes;
  let allRooms;

  try {
    const [p] = await db.select().from(properties).limit(1);
    property = p || getSeedData().property;
    allRoomTypes = await db.select().from(roomTypes);
    allRooms = await db.select().from(rooms);
  } catch {
    const seed = getSeedData();
    property = seed.property;
    allRoomTypes = seed.roomTypes;
    allRooms = seed.rooms;
  }

  const vacantRooms = allRooms.filter((r) => r.status === 'kosong').length;
  const minPrice = allRoomTypes.length > 0 ? Math.min(...allRoomTypes.map((t) => t.basePrice)) : 1000000;

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 border-b border-slate-200">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/kos.jpeg"
            alt={property.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/75 to-slate-950/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Kamar Tersedia Real-time: {vacantRooms} Kamar Kosong</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Tinggal Nyaman & Tenang di <span className="text-blue-400">{property.name}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 leading-relaxed">
            {property.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/kamar"
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-blue-500/25 transition flex items-center justify-center gap-2"
            >
              <span>Lihat Pilihan Kamar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#aturan"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-sm transition"
            >
              Fasilitas & Aturan Kos
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-300" />
              {property.city}
            </span>
            <span>Mulai dari {formatRupiah(minPrice)}/bulan</span>
            <span>Air & WiFi Gratis</span>
          </div>
        </div>
      </section>

      {/* Tipe Kamar Unggulan */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pilihan Tipe Kamar</h2>
            <p className="text-sm text-slate-600 mt-1">
              Semua kamar difoto apa adanya tanpa manipulasi berlebih.
            </p>
          </div>
          <Link href="/kamar" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>Lihat Semua Kamar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allRoomTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{type.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                  </div>
                  <span className="text-lg font-extrabold text-blue-600 shrink-0">
                    {formatRupiah(type.basePrice)}
                    <span className="text-xs text-slate-400 font-normal">/bln</span>
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Fasilitas Kamar:</p>
                  <div className="flex flex-wrap gap-2">
                    {type.facilities &&
                      (type.facilities as string[]).map((fac, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {fac}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Deposit Awal: {formatRupiah(type.depositAmount ?? 0)}</span>
                <Link
                  href="/kamar"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Cek Ketersediaan Kamar →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fasilitas & Aturan Kos */}
      <section id="aturan" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Fasilitas Bersama</span>
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {property.facilities &&
                (property.facilities as string[]).map((fac, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span>{fac}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Aturan & Tata Tertib Kos</span>
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {property.rules &&
                (property.rules as string[]).map((rule, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Pertanyaan yang Sering Diajukan (FAQ)</h2>
          <p className="text-sm text-slate-600 mt-1">Jawaban cepat untuk hal-hal yang sering ditanyakan calon penghuni.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-sm text-slate-900">Apakah biaya air dan internet sudah termasuk harga sewa?</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Ya, fasilitas air bersih dan koneksi WiFi cepat 100 Mbps sudah termasuk dalam biaya sewa bulanan tanpa biaya tambahan.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-sm text-slate-900">Bagaimana sistem pembayaran sewa setiap bulannya?</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Tagihan dikirimkan otomatis ke nomor WhatsApp Anda setiap bulan dengan tautan pembayaran yang aman. Anda cukup mentransfer ke rekening kos atau scan QRIS statis lalu mengunggah bukti bayar langsung tanpa perlu login.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-sm text-slate-900">Apakah bisa melakukan survei lokasi terlebih dahulu?</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Tentu saja! Anda bisa langsung menghubungi kami via tombol WhatsApp di pojok kanan bawah untuk menjadwalkan survei kamar.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
