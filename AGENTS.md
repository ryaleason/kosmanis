# AGENTS.md

Aturan kerja untuk AI agent di proyek **Website & Sistem Manajemen Kos**.
Baca seluruh file ini di awal setiap sesi. Jika ada konflik dengan prompt, tanyakan dulu.

## 1. Tentang Proyek

Platform web untuk kos-kosan dengan tiga sisi:

- **Etalase publik**: daftar kamar, detail, status ketersediaan, booking, jadwal survei, FAQ.
- **Panel admin**: kamar, booking, penghuni, kontrak, tagihan, pembayaran, komplain, pengumuman, laporan.
- **Portal penghuni**: tagihan, unggah bukti bayar, lapor kerusakan, pengumuman, perpanjangan/keluar.

Sumber kebenaran produk: `docs/PRD.md` (kode kebutuhan `FR-xx`, masalah `C1..K3`).
Sumber kebenaran desain: `design.md`.
Sumber kebenaran data: skema Drizzle di `src/db/schema/` dan migration di `drizzle/`.

## 2. Stack

| Bagian | Pilihan |
|---|---|
| Framework | Next.js 16.x, App Router |
| Bahasa | TypeScript (`strict: true`) |
| Database | PostgreSQL di Supabase |
| ORM + migration | Drizzle ORM + drizzle-kit |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Penyimpanan berkas | Supabase Storage |
| Validasi | Zod |
| UI | Tailwind CSS 4 + shadcn/ui |
| Test | Vitest (unit), Playwright (alur utama, bila ditambahkan) |
| Package manager | pnpm |
| Hosting | Vercel |

Versi persis ada di `package.json` dan `pnpm-lock.yaml`. Itu satu-satunya sumber versi. Jangan menebak versi dari ingatan.
Jika ada kolom bertanda `<isi>`, **berhenti dan tanyakan** sebelum mengerjakan hal yang bergantung padanya.

## 3. Struktur dan Sumber Kebenaran

Ikuti struktur yang sudah ada. Jika proyek baru, gunakan:

```
src/
  app/
    (public)/        etalase publik
    (admin)/         panel admin
    (tenant)/        portal penghuni
    api/             route handler (webhook, cron)
  components/        komponen UI bersama
  db/
    schema/          skema Drizzle (sumber kebenaran data)
    index.ts         koneksi database (server-only)
  lib/
    supabase/        client server dan browser
    auth/            helper sesi dan peran
    validators/      skema Zod
  server/            logika bisnis dan server action
drizzle/             migration hasil drizzle-kit
docs/PRD.md
```

Aturan:
- Semua tabel dan kolom mengikuti `src/db/schema/`. Jangan membuat nama tabel, kolom, atau endpoint yang tidak ada di skema.
- Perubahan skema **hanya** lewat file skema + migration (`pnpm db:generate`, `pnpm db:migrate`) dengan persetujuan eksplisit. Jangan mengubah struktur lewat dashboard Supabase.
- Lihat file yang sudah ada sebelum membuat file baru.

## 4. Perintah

Agent wajib menjalankan ini sebelum menyatakan tugas selesai. Jika sebuah script belum ada di `package.json`, buatkan sesuai tabel ini dan laporkan, jangan mengarang perintah lain.

```
install   : pnpm install
dev       : pnpm dev
lint      : pnpm lint            (menjalankan eslint)
typecheck : pnpm typecheck       (tsc --noEmit)
test      : pnpm test            (vitest run)
build     : pnpm build
db:generate : pnpm db:generate   (drizzle-kit generate)
db:migrate  : pnpm db:migrate    (drizzle-kit migrate)
db:seed     : pnpm db:seed
```

## 5. Environment

Variabel dicatat di `.env.example` (tanpa nilai rahasia). Jangan pernah membaca, mencetak, atau meng-commit nilai asli.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     (kunci publik/anon)
SUPABASE_SERVICE_ROLE_KEY         (HANYA server, tidak boleh sampai ke browser)
DATABASE_URL                      (koneksi Postgres untuk Drizzle)
CRON_SECRET                       (melindungi endpoint cron)
```

- Variabel berawalan `NEXT_PUBLIC_` terlihat publik. Jangan menaruh rahasia di sana.
- `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di modul server yang diawali `import "server-only"`.

## 6. Aturan Kerja

### Scope
- Kerjakan **hanya** yang diminta di tugas. Tidak menambah fitur, refactor, atau perbaikan di luar itu.
- Hanya ubah file yang disebut atau jelas relevan. Jika perlu menyentuh file lain, sebutkan alasannya dulu.
- Ide tambahan ditulis sebagai saran di akhir laporan, tidak dikerjakan.

### Anti-halusinasi
- **Baca file sebelum mengeditnya.** Jangan menebak isi atau struktur file.
- Jangan mengarang package, fungsi, props, endpoint, atau opsi konfigurasi. Jika ragu, cek `node_modules`, tipe TypeScript, atau dokumentasi resmi sesuai versi yang terpasang.
- Next.js 16, Drizzle, shadcn/ui, dan Supabase SDK punya API yang berubah antar versi. Jangan memakai contoh dari ingatan tanpa memeriksanya terhadap versi di `package.json`.
- Jika informasi kurang atau ambigu, **tanya dulu**. Jangan berasumsi diam-diam.
- Setiap asumsi yang tetap diambil harus ditulis di akhir laporan.
- Jangan mengklaim sesuatu berhasil tanpa menjalankannya. Laporkan output perintah yang sebenarnya.

### Larangan (tanpa izin eksplisit)
- Menambah atau mengganti dependency.
- Mengubah skema database, RLS policy, atau bucket storage; menjalankan migration destruktif.
- Menghapus file atau data.
- Menyentuh `.env*`, rahasia, atau kredensial.
- Mengubah konfigurasi build, lint, atau CI.
- Memakai data karangan di luar seed/fixture yang ditentukan.

## 7. Aturan Next.js dan Supabase

- Default ke **Server Component**. Pakai `"use client"` hanya jika butuh interaktivitas.
- Mutasi data lewat Server Action atau Route Handler. Validasi input dengan Zod di server.
- **Otorisasi dicek di server** pada setiap Server Action dan Route Handler. Koneksi Drizzle langsung ke Postgres tidak melewati RLS, jadi RLS bukan satu-satunya pengaman.
- **RLS aktif di semua tabel** sebagai lapisan kedua. Tabel baru tanpa policy dianggap belum selesai.
- Peran pengguna disimpan di tabel `profiles` (kolom `role`) yang tidak bisa diubah pengguna sendiri. **Jangan** memakai `user_metadata` untuk menyimpan peran, karena bisa diedit pengguna.
- Gunakan `supabase.auth.getUser()` di server untuk memastikan sesi. Jangan mempercayai data sesi dari cookie mentah.
- Berkas:
  - `room-photos`: bucket publik, hanya foto kamar.
  - `tenant-documents` (KTP, kontrak) dan `payment-proofs`: bucket **private**, akses lewat signed URL berumur pendek.
  - Batasi tipe dan ukuran berkas di server, kompres gambar sebelum diunggah.
- Cron (pembuatan tagihan, pengingat, kedaluwarsa booking): endpoint di `src/app/api/cron/*` yang wajib memeriksa `CRON_SECRET`, dan harus idempotent (aman dijalankan dua kali).
- Jangan memanggil database dari komponen client.

## 8. Aturan Domain (wajib dipatuhi)

Logika bisnis penting. Salah di sini berarti uang atau data penghuni bermasalah.

- **Status kamar**: `kosong`, `terisi`, `segera_kosong`. Status `terisi` mengikuti kontrak aktif, bukan diubah manual tanpa jejak.
- **Booking**: status `baru`, `dihubungi`, `survei_dijadwalkan`, `disetujui`, `ditolak`, `kedaluwarsa`. Hold kamar punya batas waktu dan kedaluwarsa otomatis.
- **Tagihan**: dibuat dari kontrak aktif per periode. Wajib ada unique constraint pada `(kontrak_id, periode)` agar tidak duplikat. Status: `belum_bayar`, `menunggu_verifikasi`, `lunas`, `terlambat`, `dibatalkan`.
- **Pembayaran**: hanya admin/pemilik yang boleh memverifikasi. Tagihan jadi `lunas` hanya setelah verifikasi, bukan saat bukti diunggah.
- **Uang**: simpan sebagai bilangan bulat rupiah (`integer`/`bigint`), tanpa float. Format tampilan dipisah dari penyimpanan.
- **Tanggal dan zona waktu**: kolom `timestamptz` (UTC), tampilkan dalam WIB (Asia/Jakarta) kecuali diminta lain.
- **Peran**: `pemilik` (akses penuh), `admin` (operasional, tanpa laporan keuangan sensitif), `penghuni` (hanya data miliknya).
- **Properti**: setiap entitas membawa `property_id` agar siap multi-kos.
- **Periode sewa**: bulanan. Satu tagihan sewa per kontrak per bulan.
- **Harga sewa dan DP**: nominal diatur pemilik lewat data (per tipe atau per kamar), **bukan konstanta di kode**. DP opsional dan boleh 0. Perubahan harga atau DP hanya berlaku untuk kontrak dan tagihan baru, tagihan yang sudah terbit tidak berubah.
- **Listrik**: mode diatur pemilik per kos atau per kamar: `termasuk_sewa`, `bayar_sendiri` (token), atau `ditagih` (tarif tetap atau meteran dengan tarif per kWh). Tagihan listrik hanya dibuat untuk mode `ditagih`.
- **Air dan wifi**: gratis, termasuk sewa. Tampil sebagai fasilitas, tidak pernah ditagih.
- **Cara bayar**: QRIS. Versi 1 memakai gambar QRIS statis yang diunggah pemilik; penghuni membayar, mengunggah bukti, lalu admin memverifikasi manual. QRIS hanya tampil kepada penghuni yang punya tagihan aktif. Jangan membuat integrasi payment gateway atau QRIS dinamis tanpa izin eksplisit (Fase 3).
- Jangan menebak aturan biaya lain (denda, biaya tambahan, prorata). Jika belum ada di PRD, tanya dulu.

## 9. Keamanan dan Privasi

- Data KTP dan kontak penghuni: bucket private, akses hanya peran berwenang. Jangan tampil di URL publik.
- Tautan tagihan memakai token acak yang tidak bisa ditebak.
- Validasi semua input di server. Lindungi dari XSS, CSRF, dan injeksi. Jangan merakit SQL dari string input.
- Batasi percobaan login dan permintaan OTP.
- Jangan masukkan data pribadi ke log atau pesan error yang tampil ke pengguna.

## 10. Standar Kode

- Ikuti gaya dan pola yang sudah ada di repo. Konsistensi lebih penting daripada selera.
- Nama berkas, fungsi, dan variabel dalam bahasa Inggris. Teks yang tampil ke pengguna dalam Bahasa Indonesia.
- TypeScript strict: tanpa `any`, tanpa `@ts-ignore` kecuali dijelaskan alasannya.
- Fungsi kecil dan satu tujuan. Logika bisnis ditaruh di satu tempat (`src/server/`), bukan tersebar di komponen.
- Tangani error dengan pesan jelas bagi pengguna dan log berguna bagi developer.
- Jangan tinggalkan `console.log`, kode mati, atau TODO tanpa konteks.
- Komentar hanya untuk "mengapa", bukan "apa".

## 11. UI dan Desain

- Ikuti `design.md` untuk warna, font, spacing, dan gaya komponen. Jangan membuat gaya baru sendiri.
- Mobile-first. Semua alur utama harus nyaman di lebar 375px.
- Gunakan komponen shadcn/ui yang sudah ada di repo sebelum membuat yang baru.
- Hindari tampilan generik ala template AI: gradient ungu acak, emoji sebagai ikon, bayangan berlapis, teks pemasaran kosong.
- Status harus berteks, bukan hanya warna.
- Aksesibilitas dasar: kontras cukup, label form, teks alternatif gambar, fokus keyboard terlihat.
- Tampilkan keadaan kosong, loading, dan error di setiap daftar dan form.
- Gambar memakai `next/image` dengan ukuran yang ditentukan. Etalase harus cepat di jaringan seluler.

## 12. Alur per Tugas

1. **Pahami**: baca tugas, bagian PRD terkait, skema, dan file yang relevan.
2. **Rencana**: tulis ringkas file apa yang diubah dan langkahnya. Tunggu persetujuan jika tugas besar atau menyentuh skema/RLS.
3. **Implementasi**: sesuai rencana, dalam scope.
4. **Verifikasi**: jalankan lint, typecheck, test, dan build. Perbaiki sampai lulus.
5. **Laporan**: gunakan format di bawah.
6. **Commit kecil** per tugas dengan pesan jelas, jika diminta.

## 13. Format Laporan Akhir

```
Selesai: <ringkasan 1-2 kalimat>
File diubah: <daftar>
Verifikasi: <perintah yang dijalankan dan hasil sebenarnya>
Asumsi: <daftar, atau "tidak ada">
Belum dikerjakan / saran: <daftar, atau "tidak ada">
Pertanyaan terbuka: <daftar, atau "tidak ada">
```

## 14. Urutan Pengerjaan yang Disarankan

1. Setup proyek, koneksi Supabase, skema Drizzle, migration awal, seed data realistis
2. Auth, tabel `profiles`, peran, dan RLS dasar
3. Admin: CRUD kamar dan status
4. Etalase: daftar dan detail kamar, FAQ, aturan kos (FR-01 sampai FR-11)
5. Booking dan survei (FR-16 sampai FR-20)
6. Penghuni dan kontrak (FR-23, FR-24)
7. Tagihan, bukti bayar, verifikasi, pengingat (FR-33 sampai FR-38)
8. Dashboard admin (FR-25, FR-26)
9. Portal penghuni (FR-43 sampai FR-45)
10. Fase 2: komplain, pengumuman, perpanjangan/keluar, laporan, ulasan

Kerjakan satu butir per sesi kecuali diminta lain.

## 15. Catatan Berkelanjutan

- Keputusan penting dicatat di `DECISIONS.md` (apa, kenapa, tanggal).
- Status pengerjaan dicatat di `PROGRESS.md` (selesai, sedang, berikutnya).
- Jika menemukan konflik antara PRD, skema, dan kode, hentikan dan laporkan, jangan memilih sendiri.
