import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] font-[family-name:var(--font-montserrat)] flex flex-col">
      <Sidebar />
      <div className="lg:pl-[240px] flex-1 flex flex-col min-w-0">
        <main className="flex-1 w-full max-w-[1280px] mx-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
