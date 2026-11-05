# Kosmanis — Website & Sistem Manajemen Kos

Platform web terintegrasi untuk kos-kosan dengan tiga antarmuka utama:
1. **Etalase Publik:** Katalog kamar real-time, status ketersediaan, booking kamar, dan chat WhatsApp otomatis.
2. **Panel Admin:** Pengaturan karakteristik kos (kategori putra/putri/campur, aturan, fasilitas), manajemen kamar, data penghuni, kontrak sewa (snapshot tarif sewa), dan verifikasi pembayaran.
3. **Portal Penghuni & Tagihan:** Halaman tagihan bertoken langsung (`/i/[token]`) tanpa wajib login dan portal penghuni aktif (`/portal`).

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (`strict: true`)
- **Database & ORM:** PostgreSQL di Supabase + Drizzle ORM
- **Auth & Storage:** Supabase Auth & Supabase Storage (private buckets untuk bukti bayar & dokumen)
- **Styling:** Tailwind CSS 4 + Lucide React
- **Validasi:** Zod
- **Testing:** Vitest
- **Hosting & Cron:** Vercel + Vercel Cron

---

## 🚀 Perintah Utama

```bash
pnpm install       # Pasang dependensi
pnpm dev           # Menjalankan server pengembangan lokal
pnpm lint          # Menjalankan ESLint
pnpm typecheck     # Menjalankan TypeScript typecheck (tsc --noEmit)
pnpm test          # Menjalankan unit & integration test Vitest
pnpm build         # Menjalankan optimized production build Next.js
pnpm db:generate   # Generate migrasi Drizzle dari skema
pnpm db:migrate    # Menjalankan migrasi database
pnpm db:seed       # Memasukkan seed data awal kos
```

---

## 📁 Struktur Repositori

```
src/
  app/
    (public)/        # Etalase publik (/, /kamar)
    (admin)/         # Panel pengelola (/admin/dashboard, /admin/kamar, dsb.)
    (tenant)/        # Portal penghuni (/portal)
    api/             # Cron endpoints (/api/cron/invoices, /api/cron/bookings)
    i/[token]/       # Tautan tagihan publik aman
    login/           # Halaman login terpadu
  components/        # Komponen UI (admin, public, tenant)
  db/
    schema/          # Skema Drizzle PostgreSQL (sumber kebenaran data)
    seed.ts          # Naskah seed data kos klien
  lib/
    auth/            # Helper sesi dan otorisasi peran
    supabase/        # Klien Supabase (browser, server, admin)
    validators/      # Skema Zod terpusat
  server/
    actions/         # Server Actions Next.js (mutasi data aman)
docs/
  superpowers/       # Dokumen desain dan rencana implementasi
DECISIONS.md         # Catatan keputusan arsitektur
PROGRESS.md          # Status pengerjaan proyek
AGENTS.md            # Aturan kerja teknis
```
