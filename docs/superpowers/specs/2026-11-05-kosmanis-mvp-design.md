# Design Doc: Kosmanis MVP (Website & Sistem Manajemen Kos)

- **Tanggal:** 5 November 2026
- **Status:** Menunggu Persetujuan (Pending Approval)
- **Target Proyek:** MVP Kosmanis untuk Klien Kos Fisik yang Sudah Berjalan
- **Ukuran Pekerjaan:** Project

---

## 1. Intent dan Latar Belakang (The Why)

Kosmanis dibangun untuk mendigitalisasi operasional kos fisik milik klien yang saat ini masih berjalan semi-manual. Masalah utama yang diselesaikan:
- **Kamar kosong:** Membantu calon penghuni menemukan kamar dengan informasi akurat, foto asli, ketersediaan terkini, dan alur booking/survei yang pasti.
- **Penagihan manual dan canggung:** Mengotomatiskan penerbitan tagihan bulanan teratur, menyediakan saluran unggah bukti transfer/QRIS, serta verifikasi pembayaran oleh pengelola.
- **Komunikasi tercecer:** Memusatkan informasi kos, aturan, dan tagihan ke dalam platform web agar tidak hilang di riwayat obrolan WhatsApp.

---

## 2. Goals, Non-Goals, dan Anti-Goals

### Goals (MVP / Fase 1)
1. **Fondasi Arsitektur & Database:**
   - Menata ulang repositori ke struktur `src/` sesuai [AGENTS.md](file:///home/ryaleason/Projects/My Project/sistem-manajemen-kos/AGENTS.md).
   - Menghubungkan Next.js 16 ke PostgreSQL di Supabase menggunakan Drizzle ORM (`src/db/schema/`).
   - Menerapkan Supabase Auth dengan tabel `profiles` (`pemilik`, `admin`, `penghuni`) dan RLS sebagai lapisan kedua.
   - Konfigurasi Supabase Storage: bucket publik `room-photos`, bucket private `tenant-documents` dan `payment-proofs`.
2. **Panel Admin & Pemilik:**
   - Pengaturan karakteristik kos dinamis oleh pemilik (nama kos, kategori putra/putri/campur, alamat, aturan kos, fasilitas bersama, rekening bank/QRIS statis).
   - CRUD tipe kamar dan nomor kamar beserta foto, tarif sewa bulanan, dan deposit.
   - Manajemen booking & survei (menyetujui/menolak, hold kamar berbatas waktu).
   - Manajemen data penghuni dan kontrak sewa aktif (snapshot tarif sewa & deposit sesuai FR-59).
   - Siklus tagihan: generate tagihan bulanan otomatis, melihat daftar tagihan, tombol kirim pengingat `wa.me`, verifikasi bukti bayar (terima/tolak dengan alasan).
   - Dashboard ringkasan: jumlah kamar kosong/terisi, persentase okupansi, tagihan jatuh tempo/tertunggak, dan bukti bayar yang menunggu verifikasi.
3. **Etalase Publik (Root URL):**
   - Beranda kos (`/`) dengan informasi dinamis dari pengaturan pemilik, kamar tersedia, fasilitas unggulan, lokasi, dan FAQ.
   - Daftar kamar (`/kamar`) dengan filter (tipe, harga, fasilitas, ketersediaan, kategori).
   - Detail kamar (`/kamar/[id]`): galeri foto, spesifikasi, aturan, badge status (*Kosong*, *Terisi*, *Segera Kosong*).
   - Tombol WhatsApp melayang dengan pesan otomatis terisi info kamar.
   - Form booking dan form penjadwalan survei.
4. **Pembayaran & Portal Penghuni:**
   - Tautan publik tagihan bertoken (`/i/[token]`): penghuni dapat melihat rincian tagihan dan mengunggah bukti bayar secara instan tanpa hambatan login.
   - Portal penghuni terautentikasi (`/penghuni`): login via email/password, melihat kamar aktif, masa sewa, dan riwayat seluruh tagihan.
5. **Otomatisasi Cron:**
   - Endpoint `/api/cron/invoices` untuk membuat tagihan bulanan otomatis bagi kontrak aktif.
   - Endpoint `/api/cron/bookings` untuk mengubah booking hold yang lewat batas waktu menjadi kedaluwarsa.
   - Verifikasi header `Authorization: Bearer CRON_SECRET` dan bersifat idempotent.

### Non-Goals (Di Luar Cakupan MVP)
- **Payment Gateway Otomatis:** Tidak ada integrasi Midtrans/Xendit/QRIS dinamis pada MVP (dijadwalkan di Fase 3). Pembayaran menggunakan transfer manual / QRIS statis + unggah bukti.
- **Pencatatan Meteran Listrik Bulanan (FR-57):** Masuk ke prioritas *Should* (Fase 2). Pada MVP, mode listrik dibatasi pada *termasuk sewa* atau *bayar sendiri (token)*.
- **Unggah Bukti DP Booking di Web:** Pembayaran DP booking diselesaikan langsung via WhatsApp dengan admin; admin membuat kontrak resmi di sistem setelah DP diterima.
- **Tiket Komplain & Pengumuman Kompleks:** Masuk ke Fase 2.
- **Alur Perpanjangan/Keluar Mandiri:** Masuk ke Fase 2.
- **Laporan Laba Rugi Komprehensif:** Masuk ke Fase 2.
- **Aplikasi Mobile Native:** Cukup web responsif mobile-first.

### Anti-Goals
- **Tagihan Berubah Diam-diam (Pelanggaran FR-59):** Jangan pernah menghitung ulang tagihan yang sudah terbit berdasarkan tarif kamar saat ini. Harga dan deposit wajib di-snapshot pada saat pembuatan kontrak dan invoice.
- **Eksploitasi Peran Pengguna:** Jangan pernah menyimpan peran di `user_metadata` Supabase Auth. Wajib di kolom `role` pada tabel `profiles` dan diverifikasi di server pada setiap Server Action.
- **Kebocoran Dokumen Privat:** Foto KTP penghuni dan bukti transfer tidak boleh ditaruh di bucket publik atau diakses via URL permanen tanpa signed URL berumur pendek.
- **Data Kos Hardcoded:** Jangan menuliskan nama kos, aturan, fasilitas, atau kategori di kode komponen. Semuanya harus diambil dari data database yang diatur pemilik.

---

## 3. Batasan Teknis dan Lingkungan (Constraints)

- **Framework & Bahasa:** Next.js 16 (App Router), TypeScript (`strict: true`).
- **Database & ORM:** PostgreSQL di Supabase, Drizzle ORM + drizzle-kit.
- **Autentikasi & Storage:** Supabase Auth (`@supabase/ssr`), Supabase Storage.
- **Validasi:** Zod di server (Server Actions & Route Handlers).
- **Styling:** Tailwind CSS 4 + komponen shadcn/ui.
- **Hosting:** Vercel. Cron job dijadwalkan menggunakan Vercel Cron (`vercel.json`) yang memicu endpoint `/api/cron/*` dengan `CRON_SECRET`.
- **Format Keuangan & Tanggal:** Uang disimpan sebagai `bigint` / `integer` rupiah tanpa float. Tanggal disimpan dalam `timestamptz` (UTC) dan dirender ke WIB (Asia/Jakarta).
- **Aturan Repositori:** Mengikuti seluruh pedoman di [AGENTS.md](file:///home/ryaleason/Projects/My Project/sistem-manajemen-kos/AGENTS.md).

---

## 4. Pendekatan yang Dipertimbangkan (Approaches)

### Pendekatan 1: Fondasi Data & Admin Terlebih Dahulu (*Inside-Out*) — **Dipilih**
- **Penjelasan:** Membangun fondasi database (Drizzle + Supabase), sistem otentikasi peran, dan panel admin terlebih dahulu. Pemilik kos dapat langsung menginput data properti, aturan, tipe kamar, nomor kamar, dan harga riil. Setelah itu, etalase publik dan portal penghuni dibangun di atas data nyata tersebut.
- **Pertimbangan:**
  - *Kelebihan:* Menghindari kerja dua kali membuat data mock/sementara; fitur pengaturan karakteristik kos oleh pemilik langsung berfungsi sebagai sumber kebenaran untuk etalase publik.
  - *Trade-off:* Tampilan visual publik baru dapat dilihat setelah fondasi skema dan admin kamar siap.

### Pendekatan 2: Etalase Publik Cepat Tayang (*Outside-In*) — **Ditolak**
- **Penjelasan:** Membangun seluruh halaman etalase publik terlebih dahulu dengan data seed/mock agar website segera bisa dipamerkan ke calon penyewa, baru kemudian menyusul panel admin dan sistem tagihan.
- **Pertimbangan:**
  - *Alasan Ditolak:* Karena karakteristik kos klien harus bisa disetel dinamis oleh pemilik, membuat etalase lebih dulu akan menuntut refactoring besar ketika menyambungkannya ke panel admin dinamis.

---

## 5. Keputusan yang Telah Ditetapkan (Decisions Made)

1. **Target Operasional:** Kos fisik klien yang sudah berjalan (bukan sistem generic multitenant publik).
2. **Hosting:** Vercel dengan integrasi Vercel Cron untuk tugas berkala.
3. **Karakteristik Kos Dinamis:** Disimpan pada tabel `properties` (nama, kategori putra/putri/campur, alamat, kontak, aturan kos, fasilitas bersama) dan dikelola via menu pengaturan admin.
4. **Listrik (FR-57):** Untuk MVP hanya mendukung mode `termasuk_sewa` dan `bayar_sendiri` (token). Mode meteran bulanan masuk Fase 2.
5. **Immutability Harga (FR-59):** Snapshot harga sewa dan deposit tersimpan pada entitas `leases` dan `invoices`.
6. **Alur DP Booking:** Diselesaikan lewat komunikasi WhatsApp antara calon penghuni dan admin. Admin memverifikasi penerimaan dana secara manual, lalu mendaftarkan kontrak (`lease`) baru di panel admin.
7. **Pilihan Teknis Pelaksana (Builder Calls):**
   - *Akses Tagihan Tanpa Login:* Tautan `/i/[token]` bersifat publik-aman dengan token acak. Penghuni dapat langsung mengunggah bukti transfer tanpa perlu registrasi/login terlebih dahulu.
   - *Autentikasi Penghuni:* Menggunakan Email + Password / Magic Link standar Supabase Auth yang dibuatkan oleh admin saat pendaftaran kontrak sewa (tanpa SMS OTP berbayar).
   - *Pengingat Tagihan:* Menggunakan tombol `wa.me` di tabel tagihan/tunggakan admin dengan pesan terformat otomatis, tanpa biaya WhatsApp API pihak ketiga.
   - *Struktur URL Etalase:* Berada langsung di root domain (`/`, `/kamar`, `/kamar/[id]`) yang mengambil data dari properti utama.

---

## 6. Model Data Inti (Drizzle Schema di `src/db/schema/`)

1. **`properties`:** `id`, `name`, `slug`, `category` (putra/putri/campur), `description`, `address`, `city`, `whatsapp_number`, `rules` (json/text), `facilities` (json), `qris_image_url`, `bank_accounts` (json), `created_at`, `updated_at`.
2. **`profiles`:** `id` (references auth.users), `property_id`, `role` (`pemilik`, `admin`, `penghuni`), `full_name`, `phone_number`, `created_at`, `updated_at`.
3. **`room_types`:** `id`, `property_id`, `name`, `description`, `facilities` (json), `base_price` (integer rupiah), `deposit_amount` (integer rupiah), `electricity_mode` (`termasuk_sewa`, `bayar_sendiri`), `created_at`.
4. **`rooms`:** `id`, `property_id`, `room_type_id`, `room_number`, `floor`, `status` (`kosong`, `terisi`, `segera_kosong`), `images` (json array URL), `notes`, `created_at`, `updated_at`.
5. **`tenants`:** `id`, `property_id`, `profile_id` (nullable), `name`, `id_card_number` (NIK), `id_card_image_url`, `phone_number`, `emergency_contact_name`, `emergency_contact_phone`, `status` (`aktif`, `keluar`), `created_at`.
6. **`leases`:** `id`, `property_id`, `tenant_id`, `room_id`, `start_date`, `end_date`, `rent_amount` (snapshot integer), `deposit_amount` (snapshot integer), `due_day` (1-31), `status` (`aktif`, `selesai`, `dibatalkan`), `created_at`.
7. **`invoices`:** `id`, `property_id`, `lease_id`, `invoice_number`, `period_month` (1-12), `period_year`, `amount` (integer), `status` (`belum_bayar`, `menunggu_verifikasi`, `lunas`, `terlambat`, `dibatalkan`), `due_date`, `token` (random string aman untuk akses langsung), `created_at`.
   - *Constraint:* Unique `(lease_id, period_month, period_year)` untuk mencegah tagihan ganda.
8. **`payments`:** `id`, `property_id`, `invoice_id`, `amount`, `payment_method` (`transfer_manual`, `qris_statis`), `proof_image_url`, `status` (`menunggu_verifikasi`, `diterima`, `ditolak`), `rejection_reason`, `verified_by`, `verified_at`, `created_at`.
9. **`booking_requests`:** `id`, `property_id`, `room_id`, `name`, `phone_number`, `planned_start_date`, `duration_months`, `status` (`baru`, `dihubungi`, `survei_dijadwalkan`, `disetujui`, `ditolak`, `kedaluwarsa`), `hold_until`, `notes`, `created_at`.
10. **`survey_slots`:** `id`, `property_id`, `date`, `time_slot`, `quota`, `booked_count`, `created_at`.

---

## 7. Yang Diserahkan kepada Pelaksana (Left to Builder)

- Pemilihan library UI helper pendukung (Lucide React untuk ikon, Date-fns untuk manipulasi tanggal).
- Penentuan exact styling visual komponen shadcn/ui dan layout mobile-first agar bersih dan bebas AI-slop sesuai panduan UI.
- Pembuatan naskah seed data awal yang realistis untuk kos klien (contoh 10 kamar, 2 tipe kamar, 3 penghuni aktif).
- Implementasi middleware auth Next.js untuk proteksi rute `/(admin)` dan `/(tenant)` berdasarkan tabel `profiles`.
- Pengaturan skrip `vercel.json` dan idempotensi logika cron invoice.
