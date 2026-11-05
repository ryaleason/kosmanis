# PRD Kosmanis: Website & Sistem Manajemen Kos

Versi 1.0 · 5 November 2026 · Status: Draft

## 1. Ringkasan

Kosmanis adalah satu platform web untuk kos-kosan dengan tiga sisi pengguna:

1. **Etalase publik** untuk calon penghuni: cari kamar, lihat info lengkap, cek ketersediaan, booking atau jadwalkan survei.
2. **Panel pengelola** untuk pemilik atau admin: kelola kamar, penghuni, tagihan, pembayaran, komplain, dan laporan keuangan.
3. **Portal penghuni** untuk yang sudah tinggal: lihat tagihan, unggah bukti bayar, lapor kerusakan, baca pengumuman, ajukan perpanjangan atau keluar.

Tujuan utamanya: kamar cepat terisi, penagihan tidak lagi manual, dan komunikasi tidak tercecer di chat.

## 2. Latar Belakang dan Masalah

Masalah nyata yang ingin diselesaikan, masing-masing diberi kode agar bisa ditelusuri ke fitur.

### Calon penghuni

- **C1** Info kamar tidak lengkap (harga, ukuran, fasilitas).
- **C2** Foto tidak meyakinkan atau tidak sesuai kenyataan.
- **C3** Tidak tahu kamar masih kosong atau tidak.
- **C4** Sulit menilai lokasi dan akses sekitar.
- **C5** Aturan kos baru diketahui setelah deal.
- **C6** Sulit membandingkan tipe kamar dan skema harga (bulanan, tahunan, deposit).
- **C7** Booking dan survei hanya lewat chat, tidak ada alur pasti.

### Pemilik / pengelola

- **P1** Penagihan manual dan canggung.
- **P2** Pencatatan pembayaran tidak rapi.
- **P3** Data penghuni tersebar (KTP, kontak darurat, masa sewa).
- **P4** Kamar kosong lama karena promosi tidak konsisten.
- **P5** Pertanyaan yang sama dijawab berulang.
- **P6** Komplain tidak terlacak.
- **P7** Pemasukan dan pengeluaran tidak terekap.

### Penghuni

- **H1** Status laporan kerusakan tidak jelas.
- **H2** Tagihan dan riwayat bayar tidak transparan.
- **H3** Pengumuman terlewat di grup chat.
- **H4** Alur perpanjangan, keluar, dan pengembalian deposit tidak jelas.

### Kepercayaan

- **K1** Takut penipuan atau kos fiktif.
- **K2** Tidak ada ulasan yang bisa dipercaya.
- **K3** Tidak ada bukti kos aktif dan terurus.

## 3. Tujuan dan Metrik Sukses

| Tujuan | Metrik | Target 3 bulan setelah rilis |
| --- | --- | --- |
| Kamar cepat terisi | Rata-rata hari kamar kosong sebelum terisi | Turun minimal 30% |
| Kurangi chat berulang | Jumlah chat tanya info dasar per minggu | Turun minimal 50% |
| Penagihan tertib | Persentase tagihan dibayar sebelum jatuh tempo | Naik ke 85% atau lebih |
| Admin hemat waktu | Waktu rekap bulanan | Dari jam ke menit |
| Komplain tertangani | Persentase tiket selesai dalam target waktu | 90% atau lebih |
| Konversi etalase | Pengunjung yang klik WA, booking, atau survei | 8% atau lebih |

Catatan: angka target adalah asumsi awal dan perlu disesuaikan dengan kondisi kos sebenarnya.

## 4. Non-Goals (Di Luar Cakupan Versi 1)

- Pembayaran online langsung antar-bank di dalam aplikasi (versi 1 pakai QRIS statis milik pemilik + unggah bukti, payment gateway masuk Fase 3).
- Aplikasi mobile native (cukup web responsif / PWA).
- Marketplace banyak kos milik banyak pemilik (versi 1 untuk satu pengelola, dengan desain data siap multi-kos).
- Smart lock, IoT, atau meteran listrik otomatis.

## 5. Persona

**Rani, calon penghuni (mahasiswa/karyawan baru).** Mencari lewat HP, ingin cepat tahu harga, foto asli, jarak, dan apakah masih kosong. Tidak sabar menunggu balasan chat.

**Pak Budi, pemilik kos.** Kurang nyaman dengan sistem rumit, ingin tahu siapa belum bayar dan berapa pemasukan bulan ini tanpa buka banyak buku.

**Mbak Sari, admin / penjaga kos.** Menjalankan operasional harian: terima pembayaran, catat komplain, update status kamar.

**Dika, penghuni.** Ingin cek tagihan, lapor lampu mati, dan tahu kapan air diperbaiki tanpa tanya ke grup.

## 6. Pemetaan Masalah ke Solusi

| Masalah | Solusi | Modul | Fase |
| --- | --- | --- | --- |
| C1, C2, C5, C6 | Halaman detail kamar lengkap: foto asli, fasilitas, aturan, harga semua skema | Etalase | MVP |
| C3, P4 | Status kamar real-time (kosong, terisi, segera kosong + tanggal) | Etalase + Admin | MVP |
| C4 | Peta lokasi, jarak ke tempat penting, tur foto/video | Etalase | MVP |
| C7, P5 | Form booking / jadwal survei + tombol WhatsApp dengan pesan otomatis + FAQ | Etalase | MVP |
| P1, P2, H2 | Tagihan otomatis, pengingat WA, unggah dan verifikasi bukti bayar, riwayat | Admin + Portal | MVP |
| P3 | Database penghuni terpusat dan kontrak/masa sewa | Admin | MVP |
| P6, H1 | Tiket komplain dengan status dan riwayat | Admin + Portal | Fase 2 |
| H3 | Pengumuman di portal + notifikasi WA | Admin + Portal | Fase 2 |
| H4 | Alur perpanjangan, keluar, dan deposit | Portal + Admin | Fase 2 |
| P7 | Pencatatan pengeluaran dan laporan keuangan bulanan | Admin | Fase 2 |
| K1, K2, K3 | Ulasan terverifikasi, galeri aktivitas, info legalitas pengelola | Etalase | Fase 2 |
| P4 | Promo, kode diskon, SEO lokal | Etalase | Fase 3 |

## 7. Cakupan Fase

**MVP (Fase 1):** etalase kamar, status kamar, booking/survei, WhatsApp, data penghuni, tagihan dan bukti bayar, dashboard admin dasar.

**Fase 2:** tiket komplain, pengumuman, perpanjangan dan keluar, laporan keuangan, ulasan terverifikasi.

**Fase 3:** payment gateway, promo, multi-kos, laporan lanjutan, notifikasi otomatis lebih kaya.

## 8. Kebutuhan Fungsional

Prioritas: **M** = Must (MVP), **S** = Should (Fase 2), **C** = Could (Fase 3).

### 8.1 Etalase Publik

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-01 | Beranda berisi ringkasan kos, kamar tersedia, harga mulai dari, lokasi, dan ajakan bertindak (WA / survei). | M |
| FR-02 | Daftar kamar dengan filter: tipe, rentang harga, fasilitas (AC, kamar mandi dalam, dll), dan ketersediaan. | M |
| FR-03 | Halaman detail kamar: galeri foto asli, ukuran, fasilitas, harga bulanan, DP (bila ada), info listrik, serta air dan wifi gratis, aturan kamar, status. | M |
| FR-04 | Badge status kamar: Kosong, Terisi, Segera Kosong (dengan tanggal perkiraan). | M |
| FR-05 | Perbandingan hingga 3 kamar atau tipe secara berdampingan. | S |
| FR-06 | Halaman aturan kos yang jelas (jam malam, tamu, hewan, kendaraan, kebersihan) dan ringkasannya tampil di detail kamar. | M |
| FR-07 | Peta lokasi, tautan navigasi, dan daftar tempat terdekat beserta estimasi jarak. | M |
| FR-08 | Tombol WhatsApp melayang. Pesan otomatis terisi nama kamar dan tanggal rencana masuk. | M |
| FR-09 | Form booking: nama, kontak, kamar, tanggal masuk, durasi sewa, catatan. | M |
| FR-10 | Penjadwalan survei: pilih tanggal dan jam dari slot yang disediakan admin. | M |
| FR-11 | FAQ yang bisa diatur admin (harga, deposit, listrik, air, tamu, cara bayar). | M |
| FR-12 | Bagian ulasan penghuni yang terverifikasi (hanya penghuni atau mantan penghuni). | S |
| FR-13 | Galeri kegiatan dan kondisi terbaru kos (foto bertanggal) sebagai bukti kos aktif. | S |
| FR-14 | Halaman profil pengelola: nama, kontak, alamat lengkap, dan bukti legalitas bila ada. | S |
| FR-15 | Kode promo dan harga khusus periode tertentu. | C |

### 8.2 Booking dan Reservasi

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-16 | Permintaan booking masuk ke antrean admin dengan status: Baru, Dihubungi, Survei Dijadwalkan, Disetujui, Ditolak, Kedaluwarsa. | M |
| FR-17 | Admin dapat menahan kamar sementara (hold) selama N hari setelah booking disetujui, dengan batas waktu pembayaran DP/deposit. | M |
| FR-18 | Notifikasi ke admin saat ada booking atau survei baru (WA atau email). | M |
| FR-19 | Pelamar menerima konfirmasi dan status melalui halaman pelacakan menggunakan kode booking. | S |
| FR-20 | Booking yang tidak dibayar sampai batas waktu otomatis kedaluwarsa dan kamar kembali berstatus kosong. | S |

### 8.3 Panel Admin dan Pemilik

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-21 | Login admin dengan peran: Pemilik (akses penuh) dan Admin/Penjaga (operasional, tanpa laporan keuangan sensitif). | M |
| FR-22 | CRUD kamar: tipe, nomor, harga, fasilitas, foto, status, catatan internal. | M |
| FR-23 | CRUD penghuni: identitas, kontak, kontak darurat, tanggal masuk, tanggal habis sewa, kamar, dokumen (foto KTP). | M |
| FR-24 | Kontrak sewa per penghuni: periode, harga, deposit, aturan tambahan, dan dokumen unggahan. | M |
| FR-25 | Dashboard: jumlah kamar kosong/terisi, okupansi, tagihan jatuh tempo, belum bayar, bukti bayar menunggu verifikasi, kontrak segera habis. | M |
| FR-26 | Daftar tunggakan dengan lama keterlambatan dan tombol kirim pengingat. | M |
| FR-27 | Tiket komplain terpusat dengan prioritas, petugas penanggung jawab, dan riwayat tindakan. | S |
| FR-28 | Pengumuman: buat, jadwalkan, dan kirim ke semua atau penghuni tertentu (per lantai/kamar). | S |
| FR-29 | Catat pengeluaran (listrik, air, perawatan, gaji, lainnya) dengan kategori dan bukti. | S |
| FR-30 | Laporan bulanan: pemasukan, pengeluaran, laba bersih, okupansi; ekspor PDF dan Excel/CSV. | S |
| FR-31 | Log aktivitas admin (siapa mengubah apa dan kapan). | S |
| FR-32 | Dukungan beberapa properti kos dalam satu akun. | C |

### 8.4 Tagihan dan Pembayaran

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-33 | Tagihan sewa dibuat otomatis tiap periode berdasarkan kontrak (tanggal jatuh tempo per penghuni). | M |
| FR-34 | Tagihan tambahan: listrik (bila ditagih), denda, biaya lain, dengan keterangan jelas. | M |
| FR-35 | Nomor tagihan unik dan halaman tagihan yang bisa dibuka lewat tautan aman. | M |
| FR-36 | Penghuni membayar lewat QRIS lalu mengunggah bukti pembayaran; admin memverifikasi (Terima / Tolak dengan alasan). | M |
| FR-37 | Status tagihan: Belum Bayar, Menunggu Verifikasi, Lunas, Terlambat, Dibatalkan. | M |
| FR-38 | Pengingat otomatis via WhatsApp/email: H-3, hari H, dan H+1 setelah jatuh tempo, dengan templat yang bisa diedit. | M |
| FR-39 | Pembayaran sebagian (cicilan) dan pencatatan sisa tagihan. | S |
| FR-40 | Kuitansi PDF otomatis setelah lunas. | S |
| FR-41 | Aturan denda keterlambatan yang bisa diatur (nominal atau persen per hari). | C |
| FR-42 | Integrasi payment gateway untuk QRIS dinamis per tagihan dengan rekonsiliasi otomatis. | C |

### 8.5 Portal Penghuni

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-43 | Login penghuni (nomor HP/email + OTP atau kata sandi). | M |
| FR-44 | Beranda penghuni: info kamar, masa sewa, tagihan aktif, pengumuman terbaru. | M |
| FR-45 | Riwayat tagihan dan pembayaran lengkap, dapat diunduh. | M |
| FR-46 | Lapor kerusakan/keluhan: kategori, deskripsi, foto; melihat status (Diterima, Diproses, Selesai) dan balasan. | S |
| FR-47 | Baca pengumuman dengan penanda sudah dibaca. | S |
| FR-48 | Ajukan perpanjangan sewa dengan pilihan durasi dan konfirmasi harga. | S |
| FR-49 | Ajukan keluar kos: tanggal rencana keluar, checklist serah terima kamar, status pengembalian deposit. | S |
| FR-50 | Beri ulasan setelah periode tertentu atau saat keluar, lalu muncul di etalase setelah dimoderasi. | S |

### 8.6 Notifikasi

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-51 | Pusat notifikasi: booking baru, bukti bayar masuk, komplain baru, kontrak akan habis. | M |
| FR-52 | Pengiriman pesan via WhatsApp (API resmi atau tautan wa.me pada MVP) dan email sebagai cadangan. | M |
| FR-53 | Templat pesan terkelola admin untuk setiap jenis notifikasi. | S |

### 8.7 Pengaturan Harga dan Biaya

Ketentuan sewa dari klien: bayar sebulan sekali, nominal sewa dan DP diatur pemilik, air dan wifi gratis, listrik sesuai pilihan pemilik.

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-54 | Pemilik mengatur harga sewa bulanan per tipe atau per kamar; nominal tidak ditulis di kode. | M |
| FR-55 | Pemilik mengatur DP: nominal bebas atau kosong (tanpa DP), beserta catatan aturan pengembaliannya. | M |
| FR-56 | Pemilik memilih mode listrik per kos atau per kamar: termasuk sewa, dibayar penghuni sendiri (token), atau ditagih lewat sistem. | M |
| FR-57 | Jika listrik ditagih: pemilik memilih tarif tetap per bulan atau meteran dengan tarif per kWh. Untuk meteran, admin menginput angka meteran bulanan per kamar dan tagihan dihitung otomatis (pemakaian dikali tarif). | S |
| FR-58 | Air dan wifi ditandai sebagai fasilitas gratis (termasuk sewa): tampil di etalase dan tidak masuk tagihan. | M |
| FR-59 | Perubahan harga sewa, DP, atau mode listrik hanya berlaku untuk kontrak dan tagihan baru; tagihan yang sudah terbit tidak berubah. | M |
| FR-60 | Pembayaran memakai QRIS: pemilik mengunggah gambar QRIS di pengaturan, lalu kode tampil di halaman tagihan penghuni bersama nominal dan nomor tagihan. Versi 1 dicocokkan manual lewat bukti yang diunggah penghuni. | M |

## 9. Alur Utama

**A. Calon penghuni mencari dan booking**

1. Buka web, lihat daftar kamar, filter sesuai kebutuhan.
2. Buka detail kamar, cek foto, harga, aturan, dan status.
3. Pilih: chat WhatsApp, booking, atau jadwalkan survei.
4. Admin menerima notifikasi, menghubungi, dan menyetujui.
5. Kamar di-hold, pelamar membayar DP/deposit dan mengunggah bukti.
6. Admin verifikasi, kontrak dibuat, kamar berstatus Terisi, akun penghuni dibuat.

**B. Siklus tagihan bulanan**

1. Sistem membuat tagihan sesuai kontrak.
2. Penghuni menerima notifikasi dan tautan tagihan.
3. Penghuni membayar lewat QRIS lalu unggah bukti.
4. Admin verifikasi; status menjadi Lunas dan kuitansi terkirim.
5. Jika terlambat, pengingat otomatis berjalan dan penghuni masuk daftar tunggakan.

**C. Komplain**

1. Penghuni membuat laporan dengan foto.
2. Admin menugaskan petugas dan mengubah status.
3. Penghuni dapat memantau status dan memberi konfirmasi saat selesai.

**D. Perpanjangan atau keluar**

1. Sistem mengingatkan penghuni 30 hari sebelum kontrak habis.
2. Penghuni memilih perpanjang atau keluar.
3. Perpanjang: kontrak baru dan tagihan dibuat. Keluar: checklist serah terima, deposit diproses, kamar menjadi Segera Kosong lalu Kosong.

## 10. Peta Halaman

**Publik:** Beranda · Daftar Kamar · Detail Kamar · Bandingkan · Lokasi · Aturan Kos · FAQ · Ulasan · Booking · Jadwal Survei · Lacak Booking · Kontak

**Penghuni:** Beranda · Tagihan · Riwayat Bayar · Komplain · Pengumuman · Kontrak · Perpanjang/Keluar · Profil

**Admin:** Dashboard · Kamar · Booking · Penghuni · Kontrak · Tagihan · Pembayaran · Komplain · Pengumuman · Pengeluaran · Laporan · Pengaturan (templat pesan, FAQ, aturan, pengguna)

## 11. Model Data Inti

| Entitas | Atribut utama |
| --- | --- |
| Property | nama, alamat, koordinat, kontak, aturan umum |
| RoomType | nama, deskripsi, fasilitas, harga bulanan, DP opsional, mode listrik |
| Room | nomor, tipe, lantai, status, foto, catatan |
| BookingRequest | kontak, kamar, tanggal masuk, durasi, status, hold sampai |
| SurveySlot | tanggal, jam, kuota, terisi |
| Tenant | identitas, kontak, kontak darurat, dokumen, status |
| Lease | penghuni, kamar, periode, harga, deposit, status |
| Invoice | lease, periode, item, total, jatuh tempo, status |
| Payment | invoice, jumlah, tanggal, bukti, status verifikasi, verifikator |
| Expense | kategori, jumlah, tanggal, bukti, catatan |
| Ticket | penghuni, kategori, deskripsi, foto, status, penanggung jawab |
| Announcement | judul, isi, target, waktu kirim |
| Review | penghuni, rating, isi, status moderasi |
| User | peran, kredensial, status |
| ActivityLog | pengguna, aksi, objek, waktu |

Semua entitas membawa referensi properti agar mendukung multi-kos di Fase 3 tanpa migrasi besar.

## 12. Kebutuhan Non-Fungsional

- **Performa:** halaman etalase memuat di bawah 3 detik pada koneksi seluler 4G; gambar dikompres dan dimuat bertahap (lazy loading).
- **Responsif dan mobile-first:** mayoritas calon penghuni mengakses lewat HP; semua alur utama harus nyaman di layar kecil.
- **SEO lokal:** tag meta, data terstruktur (LocalBusiness), URL ramah, dan sitemap agar muncul pada pencarian seperti kos dekat kampus atau daerah tertentu.
- **Ketersediaan:** target uptime 99% atau lebih; cadangan database otomatis harian.
- **Keamanan:** HTTPS, hash kata sandi, perlindungan CSRF/XSS, pembatasan percobaan login, kontrol akses berbasis peran, tautan tagihan bertoken.
- **Privasi data:** data KTP dan kontak penghuni disimpan terenkripsi atau di penyimpanan privat, hanya dapat diakses peran berwenang, dan penghuni diberi informasi tujuan penggunaan datanya (mengacu pada UU Pelindungan Data Pribadi).
- **Aksesibilitas:** kontras warna memadai, ukuran teks terbaca, navigasi keyboard, teks alternatif pada gambar.
- **Bahasa:** Bahasa Indonesia sebagai utama; struktur teks siap untuk bahasa lain bila diperlukan.
- **Pemeliharaan:** log kesalahan, pemantauan sederhana, dan dokumentasi untuk pengelola non-teknis.

## 13. Prinsip Desain dan UX

- Informasi terpenting (harga, status, foto asli, tombol hubungi) tampil tanpa perlu menggulir jauh.
- Bahasa sederhana, tidak berbelit; label status berwarna dan berteks agar tidak bergantung pada warna saja.
- Admin dapat menyelesaikan tugas harian (verifikasi bayar, ubah status kamar, balas komplain) dalam sedikit klik.
- Foto asli dan terbaru lebih diutamakan daripada ilustrasi generik.
- Desain memberi kesan terpercaya dan rapi: tipografi jelas, jarak lega, tanpa elemen dekoratif berlebihan.

## 14. Integrasi

| Integrasi | Tujuan | Fase |
| --- | --- | --- |
| WhatsApp (wa.me, lalu API resmi/penyedia) | Chat awal dan pengingat | MVP / Fase 2 |
| Google Maps / OpenStreetMap | Peta lokasi dan jarak | MVP |
| Supabase Storage (bucket publik dan private) | Foto kamar, bukti bayar, dokumen | MVP |
| Email (SMTP/Resend dsb.) | Notifikasi cadangan | MVP |
| Payment gateway (Midtrans/Xendit dsb.) | Pembayaran QRIS dinamis | Fase 3 |
| Analitik (Plausible/GA) | Mengukur konversi etalase | MVP |

## 15. Teknologi

Kosmanis memakai Next.js 16 dan Supabase (PostgreSQL). Aturan teknis rinci untuk agent ada di `AGENTS.md`.

| Bagian | Pilihan |
| --- | --- |
| Framework | Next.js 16 (App Router), TypeScript |
| Database | PostgreSQL di Supabase |
| ORM dan migration | Drizzle ORM |
| Auth | Supabase Auth; peran disimpan di tabel profil |
| Penyimpanan berkas | Supabase Storage: bucket publik untuk foto kamar, bucket private untuk KTP dan bukti bayar |
| UI | Tailwind CSS 4 + shadcn/ui |
| Validasi dan test | Zod, Vitest |
| Package manager | pnpm |
| Tugas terjadwal | Cron untuk tagihan, pengingat, dan kedaluwarsa booking |
| Hosting | Belum ditentukan |

Paket gratis Supabase menghentikan (pause) proyek yang tidak aktif selama 7 hari ([sumber](https://www.cloudzero.com/blog/supabase-pricing/)). Pakai paket gratis untuk pengembangan, lalu pindah ke Pro saat sistem dipakai penghuni.

## 16. Roadmap

| Tahap | Cakupan | Perkiraan |
| --- | --- | --- |
| 0. Persiapan | Konfirmasi kebutuhan, kumpulkan foto asli, data kamar, aturan, harga | 1 minggu |
| 1. MVP etalase | FR-01 sampai FR-11, status kamar, booking, survei, SEO dasar | 2 sampai 3 minggu |
| 2. MVP operasional | Penghuni, kontrak, tagihan, bukti bayar, pengingat, dashboard | 3 sampai 4 minggu |
| 3. Fase 2 | Komplain, pengumuman, perpanjangan/keluar, laporan keuangan, ulasan | 3 sampai 4 minggu |
| 4. Fase 3 | Payment gateway, promo, multi-kos | Sesuai kebutuhan |

Perkiraan waktu bersifat kasar dan bergantung pada ukuran tim dan kelengkapan konten.

## 17. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Status kamar tidak diperbarui admin | Info menyesatkan, kepercayaan turun | Status ikut otomatis dari kontrak; pengingat ke admin; tanggal terakhir diperbarui ditampilkan |
| Penghuni enggan memakai portal | Manfaat sistem berkurang | Portal sangat sederhana; tagihan bisa dibuka lewat tautan tanpa login; tetap ada pengingat WA |
| Kebocoran data KTP | Risiko hukum dan reputasi | Penyimpanan privat, akses berperan, log aktivitas, kebijakan privasi |
| Pengelola kurang melek teknologi | Sistem tidak dipakai | UI admin ringkas, pelatihan singkat, panduan bergambar |
| Biaya WhatsApp API | Biaya berjalan membengkak | Mulai dari wa.me/pesan semi-manual; hitung biaya sebelum otomatisasi penuh |
| Konten foto kurang berkualitas | Konversi rendah | Panduan foto dan checklist konten sebelum rilis |

## 18. Pertanyaan Terbuka

1. Kos ini untuk satu pemilik atau akan dipakai banyak pemilik kos?
2. Berapa jumlah kamar dan berapa tipe kamarnya?
3. Selain sewa bulanan, apakah ada skema lain (tiga bulan, tahunan)? Bagaimana aturan pengembalian dan pemotongan DP?
4. Jika listrik ditagih, memakai meteran per kWh atau tarif tetap per kamar?
5. Apakah kos khusus putra, putri, atau campur? Ada aturan berbeda per lantai?
6. Siapa yang akan mengoperasikan panel admin sehari-hari?
7. Apakah QRIS cukup berupa kode statis milik pemilik dengan verifikasi manual (versi 1), atau perlu QRIS dinamis lewat payment gateway sejak awal?
8. Apakah sudah ada data penghuni dan riwayat pembayaran yang perlu diimpor?

## 19. Kriteria Penerimaan MVP

- Calon penghuni dapat menemukan kamar, melihat detail lengkap dan status, lalu menghubungi atau booking tanpa chat awal.
- Admin dapat menambah kamar, mengubah status, dan menerima serta memproses booking.
- Tagihan bulanan terbentuk otomatis, penghuni dapat mengunggah bukti, dan admin dapat memverifikasi.
- Dashboard menampilkan okupansi, tunggakan, dan bukti bayar yang menunggu.
- Pengingat tagihan terkirim sesuai jadwal.
- Semua halaman utama nyaman di HP dan lolos uji kecepatan dasar.
