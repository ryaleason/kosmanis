'use client';

import Link from 'next/link';
import { Building2, Home, DoorOpen, ShieldCheck, HelpCircle, User } from 'lucide-react';

interface NavbarProps {
  propertyName: string;
  category: 'putra' | 'putri' | 'campur';
}

export function Navbar({ propertyName, category }: NavbarProps) {
  const categoryLabel =
    category === 'campur' ? 'Campur' : category === 'putra' ? 'Khusus Putra' : 'Khusus Putri';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100/80">
      <div className="max-w-[110rem] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-sky-600 transition">
                {propertyName}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-700 border border-sky-200">
                {categoryLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Hunian Nyaman & Terawat</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-sky-600 transition flex items-center gap-1.5">
            <Home className="w-4 h-4 text-sky-500" />
            <span>Beranda</span>
          </Link>
          <Link href="/kamar" className="hover:text-sky-600 transition flex items-center gap-1.5">
            <DoorOpen className="w-4 h-4 text-sky-500" />
            <span>Pilihan Kamar</span>
          </Link>
          <Link href="/#fasilitas" className="hover:text-sky-600 transition flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            <span>Fasilitas & Layanan</span>
          </Link>
          <Link href="/#faq" className="hover:text-sky-600 transition flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-500" />
            <span>FAQ</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="text-xs font-semibold px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 shadow-sm"
          >
            <User className="w-3.5 h-3.5" />
            <span>Panel Pengelola</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
