'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  Receipt,
  Settings,
  ArrowUpRight,
  Menu,
  X,
  Building2,
  LogOut,
} from 'lucide-react';
import { logoutAction } from '@/server/actions/auth';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Kamar & Tipe', href: '/admin/kamar', icon: DoorOpen },
  { label: 'Penghuni & Kontrak', href: '/admin/penghuni', icon: Users },
  { label: 'Tagihan & Bayar', href: '/admin/tagihan', icon: Receipt },
  { label: 'Pengaturan Kos', href: '/admin/pengaturan', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-[#0F172A] text-white">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center gap-3 border-b border-white/10 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-[#1CA3D4] flex items-center justify-center text-white shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-white tracking-tight leading-tight truncate">
            Kosmanis
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">Panel Pengelola</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (pathname?.startsWith(`${item.href}/`) ?? false);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition focus:outline-none focus-visible:outline-2 focus-visible:outline-[#1CA3D4] focus-visible:outline-offset-2 ${
                isActive
                  ? 'bg-[#1CA3D4] text-white font-semibold'
                  : 'text-[#CBD5E1] hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Nav */}
      <div className="p-4 pb-6 border-t border-white/10 shrink-0 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-[13px] text-[#CBD5E1] hover:bg-white/[0.06] hover:text-white transition focus:outline-none focus-visible:outline-2 focus-visible:outline-[#1CA3D4] focus-visible:outline-offset-2"
        >
          <span className="truncate">Lihat Etalase Publik</span>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-[#9CA3AF]" />
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[#FDA4AF] hover:bg-rose-500/10 hover:text-rose-300 transition text-left focus:outline-none focus-visible:outline-2 focus-visible:outline-[#FDA4AF]"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar (Logout)</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header (h-14 / 56px, background navy #0F172A) */}
      <header className="lg:hidden sticky top-0 z-40 h-14 bg-[#0F172A] px-4 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1CA3D4] flex items-center justify-center text-white shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight">Kosmanis</span>
            <span className="text-[11px] text-[#9CA3AF] ml-2 font-medium">Panel Pengelola</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 text-white/80 hover:text-white hover:bg-white/[0.08] rounded-lg transition focus:outline-none focus-visible:outline-2 focus-visible:outline-[#1CA3D4]"
          aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#0F172A]/50 transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-[240px] max-w-[80vw] bg-[#0F172A] z-50 flex flex-col shadow-none">
            {renderNavContent()}
          </aside>
        </div>
      )}

      {/* Desktop Fixed Sidebar (w-[240px], fixed, navy #0F172A) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[240px] z-30 flex-col border-r border-[#0F172A]">
        {renderNavContent()}
      </aside>
    </>
  );
}
