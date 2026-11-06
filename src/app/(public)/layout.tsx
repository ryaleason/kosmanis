import Link from 'next/link';
import { Navbar } from '@/components/public/Navbar';
import { FloatingWhatsApp } from '@/components/public/FloatingWhatsApp';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { getSeedData } from '@/db/seed';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen flex flex-col bg-white text-[#1F2937] selection:bg-[#1CA3D4]/20">
      <Navbar propertyName={property.name} category={property.category || 'campur'} />
      <main className="flex-1">{children}</main>
      <footer className="bg-[#0F172A] text-[#9CA3AF] pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 mb-12">
            {/* Kolom 1: Logo, Nama Kos, Alamat */}
            <div>
              <p className="text-xl font-bold text-white tracking-tight">{property.name}</p>
              <p className="text-[14px] text-[#9CA3AF] mt-3 leading-relaxed">
                {property.address}, {property.city}
              </p>
              <p className="text-[14px] text-[#9CA3AF] mt-2 leading-relaxed">
                Hunian nyaman, tenang, dan terawat dengan sistem pengelolaan sewa yang praktis dan transparan.
              </p>
            </div>

            {/* Kolom 2: Navigasi */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Navigasi
              </h4>
              <ul className="space-y-2.5 text-[14px]">
                <li>
                  <Link href="/" className="hover:text-[#1CA3D4] transition">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/kamar" className="hover:text-[#1CA3D4] transition">
                    Pilihan Kamar
                  </Link>
                </li>
                <li>
                  <Link href="/#fasilitas" className="hover:text-[#1CA3D4] transition">
                    Fasilitas & Layanan
                  </Link>
                </li>
                <li>
                  <Link href="/#aturan" className="hover:text-[#1CA3D4] transition">
                    Aturan & Tata Tertib
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-[#1CA3D4] transition">
                    Pertanyaan Umum (FAQ)
                  </Link>
                </li>
                <li>
                  <Link href="/#lokasi" className="hover:text-[#1CA3D4] transition">
                    Peta & Lokasi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Kontak WhatsApp */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Kontak & Operasional
              </h4>
              <div className="space-y-3 text-[14px]">
                <p>
                  <span className="text-white block font-medium">WhatsApp Pengelola:</span>
                  <a
                    href={`https://wa.me/${property.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1CA3D4] hover:underline"
                  >
                    +{property.whatsappNumber}
                  </a>
                </p>
                <p>
                  <span className="text-white block font-medium">Jam Pelayanan & Survei:</span>
                  <span>Setiap Hari, 08.00 - 20.00 WIB</span>
                </p>
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-[13px] text-[#9CA3AF] hover:text-white transition"
                  >
                    <span>Masuk ke Portal Pengelola →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Garis 1px di atas baris copyright */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px]">
            <p>© 2026 {property.name}. Seluruh hak cipta dilindungi.</p>
            <p>Sistem Manajemen Kos Terpadu</p>
          </div>
        </div>
      </footer>
      <FloatingWhatsApp phoneNumber={property.whatsappNumber} />
    </div>
  );
}
