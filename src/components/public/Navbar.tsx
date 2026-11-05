'use client';

import Link from 'next/link';
import { Home, DoorOpen, ShieldCheck, HelpCircle, LogIn } from 'lucide-react';

interface NavbarProps {
  propertyName: string;
  category: 'putra' | 'putri' | 'campur';
}

export function Navbar({ propertyName, category }: NavbarProps) {
  const categoryLabel =
    category === 'campur' ? 'Campur' : category === 'putra' ? 'Khusus Putra' : 'Khusus Putri';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-extrabold text-xl tracking-tight text-blue-900">{propertyName}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            {categoryLabel}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition flex items-center gap-1.5">
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
          <Link href="/kamar" className="hover:text-blue-600 transition flex items-center gap-1.5">
            <DoorOpen className="w-4 h-4" />
            <span>Pilihan Kamar</span>
          </Link>
          <Link href="/#aturan" className="hover:text-blue-600 transition flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Aturan & Fasilitas</span>
          </Link>
          <Link href="/#faq" className="hover:text-blue-600 transition flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Panel Pengelola</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
