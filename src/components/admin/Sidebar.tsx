'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  Receipt,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Kamar & Tipe', href: '/kamar', icon: DoorOpen },
  { label: 'Penghuni & Kontrak', href: '/penghuni', icon: Users },
  { label: 'Tagihan & Bayar', href: '/tagihan', icon: Receipt },
  { label: 'Pengaturan Kos', href: '/pengaturan', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col min-h-screen shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-white">Kosmanis</h1>
        <p className="text-xs text-slate-400 mt-0.5">Panel Pengelola</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition px-2 py-1"
        >
          <LogOut className="w-4 h-4" />
          <span>Lihat Etalase Publik</span>
        </Link>
      </div>
    </aside>
  );
}
