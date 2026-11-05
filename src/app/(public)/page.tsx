import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/db';
import { properties, roomTypes, rooms } from '@/db/schema';
import { getSeedData } from '@/db/seed';
import { formatRupiah } from '@/lib/format';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Clock,
  CalendarCheck,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Wind,
  Bath,
  BedDouble,
  UtensilsCrossed,
  ShieldAlert,
  HelpCircle,
  BadgeCheck,
} from 'lucide-react';

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
  const minPrice =
    allRoomTypes.length > 0 ? Math.min(...allRoomTypes.map((t) => t.basePrice)) : 1500000;

  const waLink = `https://wa.me/${property.whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${property.name}, saya tertarik untuk menanyakan info dan ketersediaan kamar.`
  )}`;

  return (
    <div className="space-y-10 sm:space-y-14 py-8 sm:py-12 bg-white pb-20">
      {/* =========================================================================
          1. HERO SECTION (Container Biru Pudar dengan Background Halaman Putih)
          ========================================================================= */}
      <section className="max-w-[110rem] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-[36px] sm:rounded-[48px] overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px] lg:min-h-[520px]">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-center space-y-6 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-sky-800 text-xs font-semibold border border-sky-200 shadow-xs w-fit mx-auto lg:mx-0">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>PILIHAN HUNIAN TERBAIK DI {property.city.toUpperCase()}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Tinggal Nyaman, Tenang & Aman di{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">
                  {property.name}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {property.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  href="/kamar"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition flex items-center justify-center gap-2"
                >
                  <span>Lihat Pilihan Kamar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#fasilitas"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition flex items-center justify-center gap-2"
                >
                  <span>Fasilitas & Layanan</span>
                </a>
              </div>

              {/* Micro-Features Strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  {property.city}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-sky-700 font-semibold">
                  Mulai {formatRupiah(minPrice)}/bln
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-emerald-700 font-semibold">Air & WiFi Gratis</span>
              </div>
            </div>

            {/* Right Column: The exact curved blue shape with kos.jpeg inside */}
            <div className="lg:col-span-5 relative min-h-[360px] sm:min-h-[440px] lg:min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-0">
              {/* Outer Curved Shape (rounded-bl on desktop to sweep inwards) */}
              <div className="relative w-full h-full min-h-[340px] sm:min-h-[420px] lg:min-h-full rounded-[32px] lg:rounded-none lg:rounded-bl-[260px] overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-cyan-500 shadow-lg">
                <Image
                  src="/images/kos.jpeg"
                  alt={`Gedung ${property.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover object-center"
                />

                {/* Subtle soft gradient overlay so cyan accents blend smoothly */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950/30 via-transparent to-sky-500/10 pointer-events-none" />
              </div>

              {/* Floating Badge 1 (Top-Right): rounded-2xl square with cyan inner icon */}
              <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-sky-100 flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-left pr-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kamar Kosong</p>
                  <p className="text-xs font-extrabold text-sky-700">{vacantRooms} Kamar Tersedia</p>
                </div>
              </div>

              {/* Floating Badge 2 (Mid-Left Edge / Boundary Overlap): rounded-2xl square with cyan inner icon */}
              <div className="absolute bottom-8 left-6 sm:bottom-12 sm:left-8 lg:-left-7 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-sky-100 flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left pr-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keamanan 24 Jam</p>
                  <p className="text-xs font-extrabold text-slate-800">CCTV & Akses Gerbang</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. 4 QUICK ACTION / INFO CARDS (Tampil Bersih di Background Putih)
          ========================================================================= */}
      <section className="max-w-[110rem] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Vibrant Cyan Solid Card */}
          <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-600 text-white p-6 rounded-3xl shadow-md shadow-sky-500/15 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 text-white">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Akses & Survei</h3>
              <p className="text-sky-100 text-xs font-medium mt-1">Setiap Hari (08.00 - 20.00)</p>
              <p className="text-xs text-sky-50 mt-2.5 leading-relaxed">
                Bisa survei lokasi langsung atau video call via WhatsApp pengelola.
              </p>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3.5 py-2 rounded-xl transition w-fit"
            >
              <span>Jadwalkan Survei</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Booking Kamar */}
          <div className="bg-[#f0f8fb] p-6 rounded-3xl border border-sky-100/90 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white text-sky-600 shadow-xs flex items-center justify-center mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Booking Kamar</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Pilih tipe kamar favorit Anda dan amankan slot sewa sebelum kehabisan.
              </p>
            </div>
            <Link
              href="/kamar"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition"
            >
              <span>Lihat Kamar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Fasilitas Komplit */}
          <div className="bg-[#f0f8fb] p-6 rounded-3xl border border-sky-100/90 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white text-sky-600 shadow-xs flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Fasilitas Komplit</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                AC, Springbed, Kamar Mandi Dalam, Dapur Bersama & WiFi Cepat 100 Mbps.
              </p>
            </div>
            <a
              href="#fasilitas"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition"
            >
              <span>Cek Fasilitas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Lokasi Strategis */}
          <div className="bg-[#f0f8fb] p-6 rounded-3xl border border-sky-100/90 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white text-sky-600 shadow-xs flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Lokasi Strategis</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {property.address}, {property.city}. Dekat perkantoran dan fasilitas umum.
              </p>
            </div>
            <a
              href="#lokasi"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition"
            >
              <span>Peta & Lokasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FASILITAS & LAYANAN (Container Biru Pudar)
          ========================================================================= */}
      <section id="fasilitas" className="max-w-[110rem] mx-auto px-4 sm:px-6">
        <div className="bg-[#f0f8fb] border border-sky-100/90 rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
              FASILITAS & LAYANAN
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Standar Kenyamanan Lengkap untuk Keseharian Anda
            </h2>
            <p className="text-sm text-slate-600">
              Semua fasilitas dirawat secara berkala demi menjamin kenyamanan belajar, istirahat, dan bekerja.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Building Photo Highlight Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src="/images/kos.jpeg"
                  alt="Fasilitas Kos Manis"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                    Lingkungan Bersih & Tenang
                  </span>
                  <p className="text-sm font-semibold mt-1">
                    Aturan jam tenang pukul 22.00 WIB untuk memastikan istirahat berkualitas.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Grid of Facility Cards with White Cards inside Pale Blue Section */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-sky-100/70 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">AC Tiap Kamar</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Sejuk dan nyaman untuk istirahat.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sky-100/70 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Kamar Mandi Dalam</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Bersih dengan kloset duduk & shower.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sky-100/70 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Kasur Springbed</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Lengkap dengan sprei & bantal.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sky-100/70 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">WiFi 100 Mbps Gratis</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Koneksi stabil untuk WFH & kuliah.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sky-100/70 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Dapur Bersama</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Kompor, kulkas, dan tempat cuci piring.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sky-100/70 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Keamanan & CCTV</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Pengawasan 24 jam & gerbang terkunci.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PILIHAN TIPE KAMAR (Container Biru Pudar)
          ========================================================================= */}
      <section className="max-w-[110rem] mx-auto px-4 sm:px-6">
        <div className="bg-[#f0f8fb] border border-sky-100/90 rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-600">PILIHAN KAMAR</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                Pilihan Tipe Kamar Siap Huni
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Foto asli apa adanya tanpa manipulasi berlebih.
              </p>
            </div>
            <Link
              href="/kamar"
              className="text-xs font-bold px-5 py-2.5 rounded-full bg-white text-sky-700 hover:bg-sky-50 border border-sky-200 transition flex items-center gap-1.5 w-fit shadow-xs"
            >
              <span>Lihat Semua Kamar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allRoomTypes.map((type) => (
              <div
                key={type.id}
                className="bg-white rounded-3xl border border-sky-100 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Photo Thumbnail */}
                <div className="relative h-48 w-full bg-slate-100">
                  <Image
                    src="/images/kos.jpeg"
                    alt={type.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 backdrop-blur text-sky-800 shadow-sm border border-sky-100">
                      {type.electricityMode === 'termasuk_sewa' ? 'Listrik Termasuk' : 'Listrik Token'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{type.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{type.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-extrabold text-sky-600">
                        {formatRupiah(type.basePrice)}
                      </span>
                      <span className="text-xs text-slate-400 block font-normal">/bulan</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Fasilitas Kamar:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {type.facilities &&
                        (type.facilities as string[]).map((fac, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-100"
                          >
                            <CheckCircle2 className="w-3 h-3 text-sky-600" />
                            {fac}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Deposit: <strong>{formatRupiah(type.depositAmount ?? 0)}</strong>
                  </span>
                  <Link
                    href="/kamar"
                    className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    <span>Pilih & Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SPECIALITY BANNER (Full-width Rounded Cyan Banner)
          ========================================================================= */}
      <section className="max-w-[110rem] mx-auto px-4 sm:px-6">
        <div className="rounded-[36px] bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 text-white p-8 sm:p-12 shadow-xl shadow-sky-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-2xl -z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold text-white w-fit mx-auto lg:mx-0">
                <BadgeCheck className="w-4 h-4 text-sky-200" />
                <span>SISTEM SEWA DIGITAL & TRANSPARAN</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Bayar Sewa & Bukti Pembayaran Praktis Lewat WhatsApp
              </h3>
              <p className="text-sky-50 text-sm sm:text-base leading-relaxed">
                Tagihan resmi otomatis dikirim ke nomor WhatsApp Anda setiap bulan dengan QRIS statis. Cukup transfer, upload bukti lewat tautan instan tanpa perlu repot login akun.
              </p>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-white hover:bg-sky-50 text-sky-700 font-extrabold text-sm shadow-lg transition flex items-center gap-2.5 shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Tanya Admin via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ALUR SEWA MUDAH (Container Biru Pudar)
          ========================================================================= */}
      <section className="max-w-[110rem] mx-auto px-4 sm:px-6">
        <div className="bg-[#f0f8fb] border border-sky-100/90 rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-600">PROSES MUDAH</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              4 Langkah Mudah Menyewa di {property.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 font-bold text-lg flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">Pilih Kamar</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pilih tipe kamar dan lihat status ketersediaan kosong secara real-time di website.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 font-bold text-lg flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">Jadwalkan Survei</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hubungi pengelola untuk cek fisik kamar atau lakukan reservasi langsung.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 font-bold text-lg flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">Konfirmasi & DP</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Admin mencatat kontrak sewa dan mengirim bukti konfirmasi resmi via WhatsApp.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 font-bold text-lg flex items-center justify-center mx-auto">
                4
              </div>
              <h4 className="font-bold text-sm text-slate-900">Terima Kunci</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Serah terima kunci kamar dan Anda resmi menjadi penghuni di {property.name}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. ATURAN KOS & FAQ (Container Biru Pudar)
          ========================================================================= */}
      <section id="aturan" className="max-w-[110rem] mx-auto px-4 sm:px-6">
        <div className="bg-[#f0f8fb] border border-sky-100/90 rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Aturan & Tata Tertib */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-5">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Aturan & Tata Tertib Kos</span>
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                {property.rules &&
                  (property.rules as string[]).map((rule, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* FAQ */}
            <div id="faq" className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-5">
                <HelpCircle className="w-5 h-5 text-sky-600" />
                <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <h4 className="font-bold text-xs text-slate-900">
                    Apakah biaya air dan internet sudah termasuk harga sewa?
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Ya, fasilitas air bersih dan WiFi cepat 100 Mbps sudah termasuk dalam biaya sewa bulanan tanpa biaya tambahan.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <h4 className="font-bold text-xs text-slate-900">
                    Bagaimana sistem penagihan sewa tiap bulannya?
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Tagihan dikirimkan otomatis ke nomor WhatsApp Anda setiap bulan dengan tautan unik. Anda cukup mentransfer ke QRIS/rekening kos lalu mengunggah bukti bayar langsung.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <h4 className="font-bold text-xs text-slate-900">
                    Apakah bisa melakukan survei lokasi terlebih dahulu?
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Tentu saja! Anda bisa langsung menghubungi kami via tombol WhatsApp di pojok kanan bawah untuk mencocokkan jadwal survei.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. LOKASI KOS (Container Biru Pudar)
          ========================================================================= */}
      <section id="lokasi" className="max-w-[110rem] mx-auto px-4 sm:px-6">
        <div className="bg-[#f0f8fb] rounded-[36px] p-8 border border-sky-100/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-600">LOKASI KOS</p>
            <h3 className="text-xl font-extrabold text-slate-900">{property.name}</h3>
            <p className="text-sm text-slate-600 flex items-center gap-1.5 justify-center sm:justify-start">
              <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
              <span>{property.address}, {property.city}</span>
            </p>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${property.name} ${property.address} ${property.city}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
          >
            <span>Buka Google Maps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
