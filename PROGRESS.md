# Status Pengerjaan (PROGRESS.md)

### Selesai (MVP / Fase 1)
- [x] Restrukturisasi folder ke standar `src/` Next.js 16 App Router.
- [x] Konfigurasi dependensi Drizzle ORM, Supabase Auth/Storage, Zod, Vitest, dan Tailwind CSS 4.
- [x] Skema Drizzle PostgreSQL lengkap: `properties`, `profiles`, `roomTypes`, `rooms`, `tenants`, `leases`, `invoices`, `payments`, `bookingRequests`, `surveySlots`.
- [x] Helper Supabase Client, Server, Admin Service Role (`server-only`), dan otorisasi peran pengguna di tabel `profiles.role`.
- [x] Naskah seed data realistis untuk klien Kos Manis (`src/db/seed.ts`).
- [x] Server Actions dengan validasi Zod untuk pengaturan properti, CRUD kamar, kontrak snapshot harga, dan verifikasi pembayaran.
- [x] Panel Pengelola/Admin (`/admin/dashboard`, `/admin/kamar`, `/admin/penghuni`, `/admin/tagihan`, `/admin/pengaturan`) dengan generator tautan pengingat WhatsApp.
- [x] Etalase Publik dinamis (`/`, `/kamar`) dengan filter ketersediaan real-time, badge status, modal booking, dan floating WhatsApp.
- [x] Halaman tagihan bertoken publik (`/i/[token]`) dengan formulir unggah bukti bayar tanpa wajib login.
- [x] Portal penghuni (`/portal`) dan halaman login terpadu (`/login`).
- [x] Endpoint cron otomatis dan idempotent (`/api/cron/invoices` dan `/api/cron/bookings`) dilindungi `CRON_SECRET` beserta `vercel.json`.
- [x] Seluruh verifikasi lolos 100%: Lint (0 errors, 0 warnings), Typecheck (0 errors), Vitest (11 test suites, 18 tests passed), Build Next.js sukses.

### Sedang Berjalan
- Tahap persiapan peluncuran & migrasi database Supabase produksi klien.

### Rencana Berikutnya (Fase 2)
- [ ] FR-57: Penagihan listrik berbasis meteran per kWh bulanan.
- [ ] FR-27 & FR-46: Sistem tiket komplain/keluhan terpusat dengan foto dan status.
- [ ] FR-28 & FR-47: Pengumuman kos terjadwal per lantai/semua kamar.
- [ ] FR-48 & FR-49: Alur pengajuan perpanjangan atau keluar kos mandiri dan serah terima deposit.
- [ ] FR-29 & FR-30: Pencatatan pengeluaran operasional dan laporan keuangan laba/rugi bulanan.
