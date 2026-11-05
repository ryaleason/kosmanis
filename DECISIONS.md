# Catatan Keputusan Arsitektur (DECISIONS.md)

### 2026-11-05 — Target Properti & Pendekatan Pembangunan
- **Keputusan:** Membangun Kosmanis untuk satu kos fisik klien yang sudah berjalan menggunakan Pendekatan 1 (*Inside-Out*: Fondasi Data & Admin terlebih dahulu sebelum Etalase dan Portal).
- **Alasan:** Memastikan karakteristik kos (kategori putra/putri/campur, aturan, fasilitas, rekening bank) dapat disetel secara dinamis oleh pemilik dari panel admin dan langsung menjadi sumber kebenaran bagi etalase publik tanpa mock data sementara.

### 2026-11-05 — Platform Hosting & Penjadwalan Tugas
- **Keputusan:** Menggunakan Vercel sebagai target hosting dengan Vercel Cron memicu endpoint `/api/cron/*` yang diamankan oleh `CRON_SECRET`.
- **Alasan:** Sesuai persetujuan pengguna untuk kemudahan deployment dan otomatisasi cron tanpa server eksternal.

### 2026-11-05 — Immutabilitas Harga & Deposit (FR-59)
- **Keputusan:** Harga sewa bulanan dan nominal deposit disimpan sebagai *snapshot* permanen di kolom `leases.rent_amount`, `leases.deposit_amount`, dan `invoices.amount`.
- **Alasan:** Mencegah perubahan harga tarif kamar di master data oleh pemilik kos mengubah riwayat tagihan dan kontrak yang sedang berjalan.

### 2026-11-05 — Alur DP Booking & Pengingat Tagihan (Semi-Manual via WhatsApp)
- **Keputusan:** Alur pembayaran DP hold kamar dan pengingat tagihan bulanan dilakukan semi-manual melalui integrasi tautan `wa.me` dengan pesan otomatis terisi, bukan integrasi API WhatsApp berbayar atau upload bukti DP tanpa kontrak.
- **Alasan:** Mengurangi beban biaya awal klien kos fisik dan menjaga alur tetap sederhana dan familiar bagi penyewa lokal.

### 2026-11-05 — Akses Tagihan Bertoken Tanpa Login (`/i/[token]`)
- **Keputusan:** Penghuni dapat langsung melihat rincian tagihan dan mengunggah bukti bayar melalui tautan aman bertoken acak tanpa kewajiban registrasi akun.
- **Alasan:** Mengeliminasi friksi bagi penghuni yang enggan memakai portal, sekaligus mempercepat kepatuhan penagihan.
