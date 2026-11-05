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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar propertyName={property.name} category={property.category || 'campur'} />
      <main className="flex-1">{children}</main>
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-white text-base">{property.name}</p>
            <p className="text-xs text-slate-500 mt-1">{property.address}, {property.city}</p>
          </div>
          <p className="text-xs">
            © 2026 {property.name}. Sistem Manajemen Kos Terpadu.
          </p>
        </div>
      </footer>
      <FloatingWhatsApp phoneNumber={property.whatsappNumber} />
    </div>
  );
}
