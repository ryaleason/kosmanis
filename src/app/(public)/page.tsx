import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/db';
import { properties, roomTypes, rooms } from '@/db/schema';
import { getSeedData } from '@/db/seed';
import { formatRupiah } from '@/lib/format';
import { FaqAccordion } from '@/components/public/FaqAccordion';
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

  const waLink = `https://wa.me/${property.whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${property.name}, saya tertarik untuk menanyakan info dan ketersediaan kamar.`
  )}`;

  const rulesList = (property.rules as string[])?.length
    ? (property.rules as string[])
    : [
        'Tamu lawan jenis dilarang menginap di dalam kamar.',
        'Jam tenang mulai pukul 22.00 WIB untuk kenyamanan bersama.',
        'Dilarang merokok di dalam kamar ber-AC.',
        'Menjaga kebersihan area bersama (dapur & lorong).',
      ];

  const faqList = [
    {
      question: 'Apakah biaya air dan internet sudah termasuk harga sewa?',
      answer:
        'Ya, fasilitas air bersih dan WiFi cepat 100 Mbps sudah termasuk dalam biaya sewa bulanan tanpa biaya tambahan.',
    },
    {
      question: 'Bagaimana sistem penagihan sewa tiap bulannya?',
      answer:
        'Tagihan resmi dikirimkan otomatis ke nomor WhatsApp Anda setiap bulan dengan tautan unik. Anda cukup mentransfer ke QRIS/rekening kos lalu mengonfirmasi bukti bayar langsung.',
    },
    {
      question: 'Apakah bisa melakukan survei lokasi terlebih dahulu?',
      answer:
        'Tentu saja! Anda bisa langsung menghubungi kami via tombol WhatsApp untuk mencocokkan jadwal survei fisik atau video call.',
    },
  ];

  const facilitiesList = [
    {
      icon: Wind,
      title: 'AC Tiap Kamar',
      desc: 'Sejuk dan nyaman untuk istirahat.',
    },
    {
      icon: Bath,
      title: 'Kamar Mandi Dalam',
      desc: 'Bersih dengan kloset duduk & shower.',
    },
    {
      icon: BedDouble,
      title: 'Kasur Springbed',
      desc: 'Lengkap dengan sprei & bantal.',
    },
    {
      icon: Wifi,
      title: 'WiFi 100 Mbps Gratis',
      desc: 'Koneksi stabil untuk WFH & kuliah.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Dapur Bersama',
      desc: 'Kompor, kulkas, dan tempat cuci piring.',
    },
    {
      icon: ShieldCheck,
      title: 'Keamanan & CCTV',
      desc: 'Pengawasan 24 jam & gerbang terkunci.',
    },
  ];

  const rentalSteps = [
    {
      number: '1',
      title: 'Pilih Kamar',
      desc: 'Pilih tipe kamar dan lihat status ketersediaan kosong secara real-time di website.',
    },
    {
      number: '2',
      title: 'Jadwalkan Survei',
      desc: 'Hubungi pengelola untuk cek fisik kamar atau lakukan reservasi langsung.',
    },
    {
      number: '3',
      title: 'Konfirmasi & DP',
      desc: 'Admin mencatat kontrak sewa dan mengirim bukti konfirmasi resmi via WhatsApp.',
    },
    {
      number: '4',
      title: 'Terima Kunci',
      desc: `Serah terima kunci kamar dan Anda resmi menjadi penghuni di ${property.name}.`,
    },
  ];

  return (
    <div className="bg-white">
      {/* =========================================================================
          HERO SECTION (Fullscreen Full-Bleed 100vh - JANGAN UBAH)
          ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-gradient-to-b from-sky-50/40 bg-[#00000003] border-b border-slate-100/80">
        {/* Full-width Background Image dengan Opacity 10% */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="/images/background.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-[5%] pointer-events-none"
          />
        </div>

        {/* Inner Container: diisi max-w-7xl mx-auto sesuai referensi */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black leading-[1.14]">
                Tinggal Nyaman, Tenang & Aman di{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">
                  {property.name}
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {property.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                <Link
                  href="/kamar"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2.5"
                >
                  <span>Lihat Pilihan Kamar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#fasilitas"
                  className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200 shadow-xs transition flex items-center justify-center gap-2"
                >
                  <span>Fasilitas & Layanan</span>
                </a>
              </div>

              {/* Social Proof / Stats Strip */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 shadow-xs flex items-center justify-center font-bold text-xs shrink-0 border border-sky-100">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-slate-900 text-sm leading-tight">{vacantRooms} Kamar</p>
                    <p className="text-slate-500 text-[11px]">Tersedia Real-time</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 shadow-xs flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-100">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-slate-900 text-sm leading-tight">100 Mbps</p>
                    <p className="text-slate-500 text-[11px]">Air & WiFi Gratis</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 shadow-xs flex items-center justify-center font-bold text-xs shrink-0 border border-cyan-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-slate-900 text-sm leading-tight">24 Jam</p>
                    <p className="text-slate-500 text-[11px]">Keamanan & Gerbang</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Image Artwork */}
            <div className="lg:col-span-6 relative w-full flex items-center justify-center py-4 sm:py-6">
              {/* Soft Ambient Glow */}
              <div className="absolute w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-tr from-sky-300/30 via-cyan-200/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

              <div className="relative w-full aspect-[1080/696] scale-100 sm:scale-120 lg:scale-120 bottom-5 origin-center transition-transform">
                <Image
                  src="/images/kos.png"
                  alt={`Gedung ${property.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 850px"
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          1. INFO STRIP (Full-Width Navy, Pengganti 4 Kartu)
          ========================================================================= */}
      <section className="w-full bg-[#0F172A] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/15 py-8 sm:py-10">
            {/* Kolom 1: Jam Survei */}
            <div className="py-6 sm:py-2 sm:px-6 first:pl-0 last:pr-0 flex flex-col justify-between">
              <div>
                <Clock className="w-6 h-6 text-white stroke-[1.5] mb-3" />
                <h3 className="text-base font-semibold text-white">Akses & Survei</h3>
                <p className="text-[13px] text-slate-300 mt-1 leading-normal">
                  Setiap hari (08.00 - 20.00) langsung atau video call.
                </p>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-[13px] font-medium text-[#1CA3D4] hover:underline inline-flex items-center gap-1.5 w-fit"
              >
                <span>Jadwalkan Survei</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Kolom 2: Booking Kamar */}
            <div className="py-6 sm:py-2 sm:px-6 first:pl-0 last:pr-0 flex flex-col justify-between">
              <div>
                <CalendarCheck className="w-6 h-6 text-white stroke-[1.5] mb-3" />
                <h3 className="text-base font-semibold text-white">Booking Kamar</h3>
                <p className="text-[13px] text-slate-300 mt-1 leading-normal">
                  Pilih tipe kamar favorit dan amankan slot sewa.
                </p>
              </div>
              <Link
                href="/kamar"
                className="mt-4 text-[13px] font-medium text-[#1CA3D4] hover:underline inline-flex items-center gap-1.5 w-fit"
              >
                <span>Lihat Kamar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Kolom 3: Fasilitas Lengkap */}
            <div className="py-6 sm:py-2 sm:px-6 first:pl-0 last:pr-0 flex flex-col justify-between">
              <div>
                <Wifi className="w-6 h-6 text-white stroke-[1.5] mb-3" />
                <h3 className="text-base font-semibold text-white">Fasilitas Lengkap</h3>
                <p className="text-[13px] text-slate-300 mt-1 leading-normal">
                  AC, kamar mandi dalam, dan WiFi 100 Mbps gratis.
                </p>
              </div>
              <a
                href="#fasilitas"
                className="mt-4 text-[13px] font-medium text-[#1CA3D4] hover:underline inline-flex items-center gap-1.5 w-fit"
              >
                <span>Cek Fasilitas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Kolom 4: Lokasi Strategis */}
            <div className="py-6 sm:py-2 sm:px-6 first:pl-0 last:pr-0 flex flex-col justify-between">
              <div>
                <MapPin className="w-6 h-6 text-white stroke-[1.5] mb-3" />
                <h3 className="text-base font-semibold text-white">Lokasi Strategis</h3>
                <p className="text-[13px] text-slate-300 mt-1 leading-normal">
                  {property.address}, {property.city}. Dekat fasilitas umum.
                </p>
              </div>
              <a
                href="#lokasi"
                className="mt-4 text-[13px] font-medium text-[#1CA3D4] hover:underline inline-flex items-center gap-1.5 w-fit"
              >
                <span>Petunjuk Arah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FASILITAS & LAYANAN (Background Putih)
          ========================================================================= */}
      <section id="fasilitas" className="w-full bg-white py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Kiri: Label, Heading, Paragraf, Foto Lingkungan */}
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1CA3D4] mb-2 block">
                FASILITAS & LAYANAN
              </span>
              <h2 className="text-[32px] sm:text-[36px] font-semibold text-[#1F2937] leading-tight mb-4">
                Standar Kenyamanan Lengkap untuk Keseharian Anda
              </h2>
              <p className="text-base text-[#6B7280] leading-[1.7] mb-6">
                Semua fasilitas dirawat secara berkala demi menjamin kenyamanan belajar, istirahat, dan bekerja.
              </p>
              <div className="relative aspect-[4/3] w-full rounded-[12px] overflow-hidden border border-[#E5E7EB]">
                <Image
                  src="/images/kamar.png"
                  alt={`Fasilitas ${property.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
              </div>
              <p className="text-[13px] text-[#6B7280] mt-3">
                Lingkungan bersih dan tenang dengan aturan jam tenang pukul 22.00 WIB.
              </p>
            </div>

            {/* Kanan: 6 Fasilitas List Baris (Grid 2 Kolom) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
              {facilitiesList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 py-5 border-b border-[#E5E7EB]">
                    <Icon className="w-7 h-7 text-[#1CA3D4] shrink-0 mt-0.5 stroke-[1.5]" />
                    <div>
                      <h4 className="text-base font-semibold text-[#1F2937]">{item.title}</h4>
                      <p className="text-[14px] text-[#6B7280] mt-1 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. PILIHAN KAMAR (Background #F3F9FD)
          ========================================================================= */}
      <section id="kamar" className="w-full bg-[#F3F9FD] py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1CA3D4] mb-2 block">
                PILIHAN KAMAR
              </span>
              <h2 className="text-[32px] sm:text-[36px] font-semibold text-[#1F2937] leading-tight">
                Pilihan Tipe Kamar Siap Huni
              </h2>
              <p className="text-base text-[#6B7280] mt-1 leading-[1.7]">
                Foto asli apa adanya tanpa manipulasi berlebih.
              </p>
            </div>
            <Link
              href="/kamar"
              className="text-sm font-semibold text-[#1CA3D4] hover:text-[#1693C9] flex items-center gap-1.5 transition shrink-0"
            >
              <span>Lihat Semua Kamar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* List Kartu Kamar Horizontal Ditumpuk Vertikal */}
          <div className="space-y-8">
            {allRoomTypes.map((type, idx) => {
              const isReversed = idx % 2 === 1;
              return (
                <div
                  key={type.id}
                  className={`bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden flex flex-col ${
                    isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  }`}
                >
                  {/* Foto 40% Lebar */}
                  <div
                    className={`w-full lg:w-[40%] relative min-h-[260px] lg:min-h-[290px] rounded-t-[12px] lg:rounded-t-none ${
                      isReversed ? 'lg:rounded-r-[12px]' : 'lg:rounded-l-[12px]'
                    } overflow-hidden bg-slate-100`}
                  >
                    {/* TODO: tiap kamar harus pakai foto berbeda, jangan foto yang sama */}
                    <Image
                      src="/images/kamar.png"
                      alt={type.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 480px"
                      className="object-cover"
                    />
                  </div>

                  {/* Konten Kanan 60% Lebar */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div>
                          <h3 className="text-2xl font-semibold text-[#1F2937]">{type.name}</h3>
                          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1CA3D4] mt-1">
                            <CheckCircle2 className="w-4 h-4 text-[#1CA3D4]" />
                            {type.electricityMode === 'termasuk_sewa'
                              ? 'Listrik Termasuk'
                              : 'Listrik Token'}
                          </span>
                        </div>
                        <div className="sm:text-right shrink-0 mt-2 sm:mt-0">
                          <span className="text-[28px] font-bold text-[#1CA3D4]">
                            {formatRupiah(type.basePrice)}
                          </span>
                          <span className="text-sm text-[#6B7280] font-normal ml-1">/bulan</span>
                        </div>
                      </div>

                      <p className="text-[14px] text-[#6B7280] mt-3 leading-relaxed">
                        {type.description}
                      </p>

                      <p className="text-[13px] text-[#4B5563] mt-4 font-medium">
                        {type.facilities && (type.facilities as string[]).length > 0
                          ? (type.facilities as string[]).join(' · ')
                          : 'AC · Kamar Mandi Dalam · Kasur Springbed'}
                      </p>
                    </div>

                    <div>
                      <div className="border-t border-[#E5E7EB] my-5" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="text-[14px] text-[#6B7280] font-medium">
                          Deposit: {formatRupiah(type.depositAmount ?? 0)}
                        </span>
                        <Link
                          href="/kamar"
                          className="bg-[#1CA3D4] hover:bg-[#1693C9] text-white text-sm font-semibold px-6 py-2.5 rounded-full inline-flex items-center justify-center gap-1.5 transition w-full sm:w-auto"
                        >
                          <span>Pilih & Booking</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PEMBAYARAN (CTA - Solid Primer #1693C9)
          ========================================================================= */}
      <section className="w-full bg-[#1693C9] py-16 sm:py-20 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-[28px] sm:text-[36px] font-semibold text-white leading-tight mb-3">
                Bayar Sewa & Konfirmasi Pembayaran Praktis Lewat WhatsApp
              </h2>
              <p className="text-base text-white/90 leading-[1.7]">
                Tagihan resmi dikirim ke nomor WhatsApp Anda setiap bulan dengan QRIS statis. Cukup transfer dan konfirmasi bukti lewat WhatsApp tanpa repot.
              </p>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#1693C9] hover:bg-slate-100 text-sm sm:text-base font-semibold px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 shrink-0 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Tanya Admin via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PROSES SEWA (Background Putih)
          ========================================================================= */}
      <section className="w-full bg-white py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1CA3D4] mb-2 block">
              PROSES SEWA
            </span>
            <h2 className="text-[32px] sm:text-[36px] font-semibold text-[#1F2937] leading-tight mb-3">
              4 Langkah Mudah Menyewa di {property.name}
            </h2>
            <p className="text-base text-[#6B7280] leading-[1.7]">
              Alur sewa transparan dan cepat tanpa prosedur berbelit-belit.
            </p>
          </div>

          {/* Desktop: Horizontal dengan Garis Penghubung Tipis 1px */}
          <div className="hidden lg:grid grid-cols-4 gap-8 relative">
            <div className="absolute top-6 left-12 right-12 h-px bg-[#E5E7EB] -z-0" />
            {rentalSteps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg ${
                    idx === 0
                      ? 'bg-[#1CA3D4] text-white'
                      : 'border border-[#1CA3D4] bg-white text-[#1CA3D4]'
                  }`}
                >
                  {step.number}
                </div>
                <h3 className="text-base font-semibold text-[#1F2937] mt-4 mb-1">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile: Timeline Vertikal dengan Garis 1px di Kiri */}
          <div className="lg:hidden border-l border-[#E5E7EB] pl-8 space-y-8 relative ml-4">
            {rentalSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base absolute -left-[53px] top-0 ${
                    idx === 0
                      ? 'bg-[#1CA3D4] text-white'
                      : 'border border-[#1CA3D4] bg-white text-[#1CA3D4]'
                  }`}
                >
                  {step.number}
                </div>
                <h3 className="text-base font-semibold text-[#1F2937]">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#6B7280] mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ATURAN & FAQ (Background #F3F9FD)
          ========================================================================= */}
      <section id="aturan" className="w-full bg-[#F3F9FD] py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Kiri: Aturan & Tata Tertib (4 Kolom) */}
            <div className="lg:col-span-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1CA3D4] mb-2 block">
                TATA TERTIB
              </span>
              <h2 className="text-[28px] sm:text-[32px] font-semibold text-[#1F2937] leading-tight mb-6">
                Aturan & Tata Tertib
              </h2>
              <div className="divide-y divide-[#E5E7EB] border-t border-[#E5E7EB]">
                {rulesList.map((rule, idx) => (
                  <div key={idx} className="py-4 flex items-start gap-4">
                    <span className="text-base font-semibold text-[#1CA3D4] shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base text-[#1F2937] leading-normal">
                      {rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kanan: Pertanyaan Umum Accordion (8 Kolom) */}
            <div id="faq" className="lg:col-span-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1CA3D4] mb-2 block">
                BANTUAN & INFO
              </span>
              <h2 className="text-[28px] sm:text-[32px] font-semibold text-[#1F2937] leading-tight mb-6">
                Pertanyaan Umum
              </h2>
              <FaqAccordion items={faqList} />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. LOKASI (Background Putih)
          ========================================================================= */}
      <section id="lokasi" className="w-full bg-white py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Kiri: Info Lokasi */}
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1CA3D4] mb-2 block">
                LOKASI KOS
              </span>
              <h2 className="text-[28px] sm:text-[32px] font-semibold text-[#1F2937] leading-tight mb-3">
                {property.name}
              </h2>
              <p className="text-base text-[#6B7280] leading-[1.7] mb-2 flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-[#1CA3D4] shrink-0 mt-1 stroke-[1.5]" />
                <span>{property.address}, {property.city}</span>
              </p>
              <p className="text-[14px] text-[#6B7280] mb-6">
                Jam survei: Setiap hari pukul 08.00 - 20.00 WIB.
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${property.name} ${property.address} ${property.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-medium px-6 py-3 rounded-full inline-flex items-center gap-2 transition"
              >
                <span>Buka Google Maps</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Kanan: Embed Google Maps Iframe */}
            <div className="lg:col-span-7">
              <div className="w-full h-[360px] rounded-[12px] border border-[#E5E7EB] overflow-hidden bg-[#E5E7EB]">
                {/* TODO: Ganti koordinat atau link embed Google Maps spesifik jika sudah tersedia */}
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    `${property.name} ${property.address} ${property.city}`
                  )}&output=embed`}
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-[360px]"
                  title={`Peta Lokasi ${property.name}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
