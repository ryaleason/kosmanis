import Link from 'next/link';
import { Building2, LogOut, ArrowUpRight } from 'lucide-react';
import { logoutAction } from '@/server/actions/auth';

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] font-[family-name:var(--font-montserrat)] flex flex-col">
      <header className="bg-white border-b border-[#E5E7EB] px-4 sm:px-8 h-16 flex justify-between items-center shrink-0">
        <Link href="/portal" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1CA3D4] flex items-center justify-center text-white shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[16px] text-[#0F172A] tracking-tight">
              Portal Penghuni
            </span>
            <span className="text-[12px] text-[#6B7280] ml-2 hidden sm:inline">
              Kos Manis
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[13px] font-medium text-[#6B7280] hover:text-[#0F172A] transition inline-flex items-center gap-1"
          >
            <span>Etalase Kos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="h-8 px-3.5 rounded-full border border-[#E5E7EB] text-[12px] font-semibold text-[#DC2626] hover:bg-[#FEE2E2] transition inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] mx-auto w-full p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
