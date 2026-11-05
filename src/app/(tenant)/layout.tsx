import Link from 'next/link';

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <Link href="/portal" className="font-bold text-lg text-blue-900">
          Portal Penghuni Kos Manis
        </Link>
        <Link href="/" className="text-xs text-slate-500 hover:text-slate-800">
          Kembali ke Etalase
        </Link>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full p-6">{children}</main>
    </div>
  );
}
