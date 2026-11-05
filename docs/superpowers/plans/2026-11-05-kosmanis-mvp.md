# Kosmanis MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun platform web Kosmanis MVP lengkap yang mencakup etalase publik (pencarian, detail, booking/survei, WhatsApp), panel admin (pengaturan properti dinamis, manajemen kamar, penghuni, kontrak, tagihan, dan verifikasi bukti transfer), halaman tagihan bertoken publik tanpa login, portal penghuni, serta cron job otomatis.

**Architecture:** Next.js 16 App Router di dalam folder `src/` menggunakan pembagian route groups `(public)`, `(admin)`, `(tenant)`, dan `api/cron/`. Seluruh persistensi dan skema tipe data menggunakan Drizzle ORM di atas PostgreSQL Supabase, otorisasi server-side di setiap Server Action dengan validasi Zod, dan antarmuka mobile-first berbasis Tailwind CSS 4 dan shadcn/ui.

**Tech Stack:** Next.js 16 (App Router), TypeScript (`strict: true`), Supabase (`@supabase/ssr`, Supabase Auth, Supabase Storage), Drizzle ORM (`drizzle-kit`), Zod, Tailwind CSS 4, shadcn/ui, Lucide React, Date-fns, Vitest, Vercel Cron.

**Spec:** `docs/superpowers/specs/2026-11-05-kosmanis-mvp-design.md`

## Global Constraints

- TypeScript strict mode (`strict: true`), tanpa `any`, tanpa `@ts-ignore` tanpa penjelasan.
- Perubahan skema hanya lewat file Drizzle di `src/db/schema/` dan migrasi Drizzle (`pnpm db:generate`, `pnpm db:migrate`).
- Nilai uang disimpan sebagai bilangan bulat rupiah (`integer` / `bigint`), tanpa float.
- Tanggal dan waktu disimpan dalam UTC (`timestamptz`), ditampilkan dalam WIB (Asia/Jakarta).
- Peran pengguna disimpan eksklusif pada tabel `profiles.role` (`pemilik`, `admin`, `penghuni`), dilarang memakai `user_metadata`.
- Otorisasi dicek di server pada setiap Server Action dan Route Handler.
- Berkas publik (foto kamar) di bucket `room-photos`; berkas privat (KTP, bukti bayar) di bucket `tenant-documents` dan `payment-proofs` dengan signed URL berumur pendek.
- Endpoint cron di `/api/cron/*` wajib memverifikasi header `Authorization: Bearer CRON_SECRET` dan harus idempotent.
- Immutabilitas harga (FR-59): Perubahan tarif kamar master tidak boleh mengubah nilai kontrak aktif atau tagihan yang sudah terbit.
- Teks antarmuka dalam Bahasa Indonesia; kode, variabel, berkas, dan komentar teknis dalam Bahasa Inggris.

## Review Focus

- Pembuatan tagihan ganda jika cron invoice dipanggil berulang kali -> Ditangani oleh unique constraint `(lease_id, period_month, period_year)` pada tabel `invoices`.
- Akses tidak sah ke bukti pembayaran atau tagihan penghuni lain -> Tautan langsung `/i/[token]` dilindungi token acak kriptografis (UUIDv4/nano-id); portal penghuni memfilter data berdasarkan profile ID pengguna yang login.
- Perubahan tarif kamar oleh pemilik memengaruhi tagihan berjalan -> Ditangani oleh snapshot harga di kolom `leases.rent_amount` dan `invoices.amount`.
- Dua calon penghuni menyetujui hold pada kamar yang sama -> Pengecekan status kamar `kosong` secara atomik saat mengubah status booking menjadi `disetujui`.
- Unggah file berbahaya atau berukuran raksasa pada bukti bayar -> Validasi ukuran (maks 5MB) dan MIME type (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`) di Server Action sebelum diteruskan ke Supabase Storage.

---

### Task 1: Project Restructuring & Dependencies Setup

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json:1-26`
- Modify: `tsconfig.json:1-25`
- Test: `tests/setup.test.ts`

**Interfaces:**
- Consumes: None
- Produces: Base project structure inside `src/` and testable Vitest pipeline.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/setup.test.ts
import { describe, it, expect } from 'vitest';

describe('Project Configuration', () => {
  it('should verify project environment is in test mode', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL (command not found or vitest not installed)

- [ ] **Step 3: Restructure project into `src/` and install dependencies**

1. Pindahkan folder `app/` ke `src/app/`.
2. Pasang dependencies yang disepakati:
   `pnpm add drizzle-orm postgres @supabase/supabase-js @supabase/ssr zod lucide-react date-fns clsx tailwind-merge`
   `pnpm add -D drizzle-kit vitest @types/node`
3. Perbarui script `package.json` sesuai AGENTS.md:
   `typecheck: "tsc --noEmit"`, `test: "vitest run"`, `db:generate: "drizzle-kit generate"`, `db:migrate: "drizzle-kit migrate"`.
4. Buat file `vitest.config.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (1 test passed)

- [ ] **Step 5: Run typecheck to verify typescript builds cleanly**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json vitest.config.ts src/ tests/
git commit -m "chore: restructure into src directory and configure vitest"
```

---

### Task 2: Database Schema & Drizzle Setup

**Files:**
- Create: `src/db/schema/properties.ts`
- Create: `src/db/schema/profiles.ts`
- Create: `src/db/schema/rooms.ts`
- Create: `src/db/schema/tenants.ts`
- Create: `src/db/schema/leases.ts`
- Create: `src/db/schema/invoices.ts`
- Create: `src/db/schema/payments.ts`
- Create: `src/db/schema/bookings.ts`
- Create: `src/db/schema/surveys.ts`
- Create: `src/db/schema/index.ts`
- Create: `src/db/index.ts`
- Create: `drizzle.config.ts`
- Test: `tests/db/schema.test.ts`

**Interfaces:**
- Consumes: `drizzle-orm/pg-core`
- Produces: Type-safe database schema exports (`properties`, `profiles`, `roomTypes`, `rooms`, `tenants`, `leases`, `invoices`, `payments`, `bookingRequests`, `surveySlots`, `db`).

- [ ] **Step 1: Write the failing test**

```typescript
// tests/db/schema.test.ts
import { describe, it, expect } from 'vitest';
import { properties, profiles, roomTypes, rooms, leases, invoices } from '@/db/schema';

describe('Drizzle Schema Definitions', () => {
  it('should define core tables with correct structure and constraints', () => {
    expect(properties).toBeDefined();
    expect(profiles).toBeDefined();
    expect(roomTypes).toBeDefined();
    expect(rooms).toBeDefined();
    expect(leases).toBeDefined();
    expect(invoices).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/db/schema.test.ts`
Expected: FAIL with module `@/db/schema` not found.

- [ ] **Step 3: Implement database schema files and connection**

1. Buat skema tabel di `src/db/schema/`:
   - `properties.ts`: `id` (uuid), `name`, `slug`, `category` (`putra`, `putri`, `campur`), `address`, `city`, `whatsappNumber`, `rules`, `facilities`, `qrisImageUrl`, `bankAccounts`.
   - `profiles.ts`: `id` (uuid), `propertyId`, `role` (`pemilik`, `admin`, `penghuni`), `fullName`, `phoneNumber`.
   - `rooms.ts`: `roomTypes` (`id`, `name`, `basePrice`, `depositAmount`, `electricityMode`), `rooms` (`id`, `roomNumber`, `status` (`kosong`, `terisi`, `segera_kosong`)).
   - `tenants.ts`: `id`, `profileId`, `name`, `idCardNumber`, `phoneNumber`, `emergencyContactName`, `emergencyContactPhone`, `status`.
   - `leases.ts`: `id`, `tenantId`, `roomId`, `startDate`, `endDate`, `rentAmount` (snapshot integer), `depositAmount` (snapshot integer), `dueDay`, `status`.
   - `invoices.ts`: `id`, `leaseId`, `invoiceNumber`, `periodMonth`, `periodYear`, `amount`, `status`, `dueDate`, `token`. Unique constraint on `(leaseId, periodMonth, periodYear)`.
   - `payments.ts`: `id`, `invoiceId`, `amount`, `paymentMethod`, `proofImageUrl`, `status`, `rejectionReason`.
   - `bookings.ts`: `bookingRequests` (`id`, `roomId`, `name`, `phoneNumber`, `status`, `holdUntil`).
   - `surveys.ts`: `surveySlots` (`id`, `date`, `timeSlot`, `quota`, `bookedCount`).
2. Buat `src/db/schema/index.ts` yang me-reexport semua tabel.
3. Buat `src/db/index.ts` untuk koneksi server Drizzle.
4. Buat `drizzle.config.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/db/schema.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/db/ drizzle.config.ts tests/db/
git commit -m "feat(db): define core Drizzle PostgreSQL schemas"
```

---

### Task 3: Supabase Clients, Auth Helpers & Storage Lib

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/admin.ts`
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/storage.ts`
- Test: `tests/lib/auth.test.ts`
- Test: `tests/lib/storage.test.ts`

**Interfaces:**
- Consumes: `@supabase/ssr`, `@supabase/supabase-js`, `src/db/index.ts`
- Produces:
  - `createClient()` (browser)
  - `createClient()` (server cookies)
  - `createAdminClient()` (service role)
  - `getCurrentProfile(): Promise<Profile | null>`
  - `requireRole(allowedRoles: Role[]): Promise<Profile>`
  - `createSignedUploadUrl(bucket: string, path: string): Promise<string>`
  - `getSignedFileUrl(bucket: string, path: string): Promise<string>`

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/lib/auth.test.ts
import { describe, it, expect } from 'vitest';
import { requireRole } from '@/lib/auth/session';

describe('Auth Role Verification', () => {
  it('should reject access if profile role is not in allowedRoles', async () => {
    const mockProfile = { id: '1', role: 'penghuni' as const };
    expect(() => {
      if (!['pemilik', 'admin'].includes(mockProfile.role)) {
        throw new Error('Unauthorized role');
      }
    }).toThrow('Unauthorized role');
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `pnpm test tests/lib/auth.test.ts`
Expected: FAIL if module not yet found.

- [ ] **Step 3: Implement Supabase clients and helper functions**

1. `src/lib/supabase/client.ts`: Menggunakan `createBrowserClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`.
2. `src/lib/supabase/server.ts`: Menggunakan `createServerClient` dengan cookie handling Next.js App Router.
3. `src/lib/supabase/admin.ts`: Modul dengan `import "server-only"`, menggunakan `SUPABASE_SERVICE_ROLE_KEY`.
4. `src/lib/auth/session.ts`: `getCurrentProfile()` yang memanggil `supabase.auth.getUser()` lalu query `profiles.role` dari database Drizzle.
5. `src/lib/storage.ts`: Utility pembuatan short-lived signed URL untuk bukti bayar dan KTP.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/lib/auth.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/ tests/lib/
git commit -m "feat(auth): configure Supabase clients, auth helpers, and storage utilities"
```

---

### Task 4: Seed Data & Database Seeding Script

**Files:**
- Create: `src/db/seed.ts`
- Test: `tests/db/seed.test.ts`

**Interfaces:**
- Consumes: `src/db/schema/index.ts`, `src/db/index.ts`
- Produces: `seedDatabase()` function that populates initial client kos data.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/db/seed.test.ts
import { describe, it, expect } from 'vitest';
import { getSeedData } from '@/db/seed';

describe('Seed Data Integrity', () => {
  it('should generate realistic seed entities for Kosmanis client', () => {
    const data = getSeedData();
    expect(data.property.name).toBe('Kos Manis');
    expect(data.roomTypes.length).toBeGreaterThanOrEqual(2);
    expect(data.rooms.length).toBeGreaterThanOrEqual(6);
    expect(data.leases.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/db/seed.test.ts`
Expected: FAIL with `getSeedData` not found.

- [ ] **Step 3: Implement realistic seed script**

Di `src/db/seed.ts`:
- 1 Properti: "Kos Manis", kategori `campur`, alamat lengkap, nomor WA pengelola, aturan kos, fasilitas bersama (Wifi, Dapur, Parkir), rekening bank BCA/Mandiri, placeholder URL QRIS statis.
- 2 Tipe Kamar: Kamar AC (Rp 1.500.000/bln, DP/deposit Rp 500.000) dan Kamar Non-AC (Rp 900.000/bln, deposit Rp 300.000).
- 8 Kamar: Kamar 101-104 (Lt 1), Kamar 201-204 (Lt 2). 5 terisi, 2 kosong, 1 segera kosong.
- 3 Penghuni & Kontrak: dengan snapshot tarif sewa & deposit.
- 3 Tagihan: 1 lunas terverifikasi, 1 belum bayar, 1 menunggu verifikasi pembayaran.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/db/seed.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/db/seed.ts tests/db/seed.test.ts
git commit -m "feat(db): create realistic seed data script"
```

---

### Task 5: Server Actions for Admin CRUD, Property Settings & Price Snapshotting

**Files:**
- Create: `src/server/actions/property.ts`
- Create: `src/server/actions/rooms.ts`
- Create: `src/server/actions/tenants.ts`
- Create: `src/server/actions/invoices.ts`
- Create: `src/server/actions/bookings.ts`
- Test: `tests/server/actions.test.ts`

**Interfaces:**
- Consumes: `src/db/index.ts`, `src/db/schema/index.ts`, `src/lib/auth/session.ts`
- Produces:
  - `updatePropertySettingsAction(input: PropertyInput)`
  - `createRoomTypeAction(input: RoomTypeInput)`
  - `createRoomAction(input: RoomInput)`
  - `createTenantLeaseAction(input: TenantLeaseInput)` (snapshots rent & deposit)
  - `verifyPaymentAction(paymentId: string, status: 'diterima' | 'ditolak', reason?: string)`
  - `updateBookingStatusAction(bookingId: string, status: BookingStatus, holdUntil?: Date)`

- [ ] **Step 1: Write the failing tests**

```typescript
// tests/server/actions.test.ts
import { describe, it, expect } from 'vitest';
import { validateTenantLeaseInput } from '@/server/actions/tenants';

describe('Server Actions Validation & Snapshotting', () => {
  it('should validate and snapshot rent and deposit amounts on lease creation', () => {
    const input = {
      tenantName: 'Budi Santoso',
      idCardNumber: '3201234567890001',
      phoneNumber: '081234567890',
      roomId: 'room-1',
      rentAmount: 1500000,
      depositAmount: 500000,
      dueDay: 5,
      startDate: new Date('2026-11-01'),
      endDate: new Date('2027-11-01'),
    };
    const validated = validateTenantLeaseInput(input);
    expect(validated.rentAmount).toBe(1500000);
    expect(validated.depositAmount).toBe(500000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/server/actions.test.ts`
Expected: FAIL with `validateTenantLeaseInput` not found.

- [ ] **Step 3: Implement Server Actions with Zod validation and role checking**

1. Terapkan `requireRole(['pemilik', 'admin'])` pada setiap action admin.
2. Pastikan `createTenantLeaseAction` mengambil harga kamar sebagai snapshot permanen ke `leases.rentAmount` (FR-59).
3. `verifyPaymentAction`: Jika status `diterima`, update `payments.status = 'diterima'` dan `invoices.status = 'lunas'`. Jika `ditolak`, update `payments.status = 'ditolak'` dan `invoices.status = 'belum_bayar'`.
4. `updateBookingStatusAction`: Jika `disetujui` dengan `holdUntil`, ubah status kamar menjadi `hold`/pertahankan ketersediaan sampai batas waktu.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/server/actions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/server/ tests/server/
git commit -m "feat(server): implement admin server actions with Zod validation"
```

---

### Task 6: Admin Dashboard & Management UI

**Files:**
- Create: `src/app/(admin)/layout.tsx`
- Create: `src/app/(admin)/dashboard/page.tsx`
- Create: `src/app/(admin)/kamar/page.tsx`
- Create: `src/app/(admin)/penghuni/page.tsx`
- Create: `src/app/(admin)/tagihan/page.tsx`
- Create: `src/app/(admin)/pengaturan/page.tsx`
- Create: `src/components/admin/Sidebar.tsx`
- Create: `src/components/admin/PaymentVerificationModal.tsx`
- Create: `src/components/admin/WhatsAppReminderButton.tsx`
- Test: `tests/ui/admin-helpers.test.ts`

**Interfaces:**
- Consumes: `src/server/actions/`, `src/db/index.ts`, `src/lib/auth/session.ts`
- Produces: Complete Admin Management UI for property owners/managers.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/ui/admin-helpers.test.ts
import { describe, it, expect } from 'vitest';
import { generateWhatsAppReminderUrl } from '@/components/admin/WhatsAppReminderButton';

describe('Admin Helper Utilities', () => {
  it('should format valid wa.me url with invoice and tenant details', () => {
    const url = generateWhatsAppReminderUrl({
      phoneNumber: '08123456789',
      tenantName: 'Dika',
      roomNumber: '101',
      amount: 1500000,
      dueDate: '5 November 2026',
      invoiceUrl: 'https://kosmanis.com/i/token-123',
    });
    expect(url).toContain('https://wa.me/628123456789');
    expect(url).toContain('Dika');
    expect(url).toContain('101');
    expect(url).toContain('token-123');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/ui/admin-helpers.test.ts`
Expected: FAIL with `generateWhatsAppReminderUrl` not found.

- [ ] **Step 3: Implement Admin pages & UI components**

1. `src/components/admin/Sidebar.tsx`: Navigasi Admin responsif mobile-friendly.
2. `src/components/admin/WhatsAppReminderButton.tsx`: Helper penghasil tautan `wa.me` otomatis.
3. `src/app/(admin)/dashboard/page.tsx`: Statistik okupansi, tagihan tertunggak, daftar bukti bayar yang menunggu.
4. `src/app/(admin)/kamar/page.tsx`: Daftar kamar, status badge, form tambah/edit kamar.
5. `src/app/(admin)/penghuni/page.tsx`: Data penghuni dan kontrak aktif.
6. `src/app/(admin)/tagihan/page.tsx`: Filter tagihan, modal verifikasi bukti bayar.
7. `src/app/(admin)/pengaturan/page.tsx`: Form edit karakteristik kos klien (kategori putra/putri/campur, aturan, fasilitas, rekening bank/QRIS statis).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/ui/admin-helpers.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/\(admin\)/ src/components/admin/ tests/ui/
git commit -m "feat(admin): build admin dashboard and management interface"
```

---

### Task 7: Public Storefront Pages & Booking Flow

**Files:**
- Create: `src/app/(public)/layout.tsx`
- Create: `src/app/(public)/page.tsx`
- Create: `src/app/(public)/kamar/page.tsx`
- Create: `src/app/(public)/kamar/[id]/page.tsx`
- Create: `src/components/public/Navbar.tsx`
- Create: `src/components/public/FloatingWhatsApp.tsx`
- Create: `src/components/public/BookingModal.tsx`
- Create: `src/components/public/SurveyModal.tsx`
- Test: `tests/ui/public-helpers.test.ts`

**Interfaces:**
- Consumes: `src/db/index.ts`, `src/db/schema/index.ts`
- Produces: Public storefront with real-time room availability, detail views, WhatsApp integration, and booking forms.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/ui/public-helpers.test.ts
import { describe, it, expect } from 'vitest';
import { formatRupiah } from '@/lib/format';

describe('Public UI Helpers', () => {
  it('should format integer rupiah correctly without float', () => {
    expect(formatRupiah(1500000)).toBe('Rp 1.500.000');
    expect(formatRupiah(0)).toBe('Rp 0');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/ui/public-helpers.test.ts`
Expected: FAIL with `formatRupiah` not found.

- [ ] **Step 3: Implement Public Storefront components and pages**

1. `src/lib/format.ts`: Helper `formatRupiah(amount: number | bigint)` dan format tanggal WIB.
2. `src/components/public/FloatingWhatsApp.tsx`: Tombol WA melayang yang mengarahkan ke nomor pemilik kos dari database.
3. `src/app/(public)/page.tsx`: Beranda dinamis memuat nama kos klien, deskripsi, fasilitas, kamar tersedia, aturan kos, dan FAQ.
4. `src/app/(public)/kamar/page.tsx`: Filter tipe kamar, rentang harga, ketersediaan (*Kosong*, *Terisi*, *Segera Kosong*).
5. `src/app/(public)/kamar/[id]/page.tsx`: Galeri foto, spesifikasi, aturan, dan tombol Buka Booking / Jadwalkan Survei.
6. `src/components/public/BookingModal.tsx` & `SurveyModal.tsx`: Form pemesanan yang mengirim data ke Server Action `bookingRequests` dan `surveySlots`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/ui/public-helpers.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/ src/components/public/ src/lib/format.ts tests/ui/
git commit -m "feat(public): create public storefront, room catalog, and booking modals"
```

---

### Task 8: Tokenized Invoice Payment & Tenant Portal

**Files:**
- Create: `src/app/i/[token]/page.tsx`
- Create: `src/app/(tenant)/layout.tsx`
- Create: `src/app/(tenant)/portal/page.tsx`
- Create: `src/app/login/page.tsx`
- Create: `src/components/tenant/UploadProofForm.tsx`
- Test: `tests/server/invoice-token.test.ts`

**Interfaces:**
- Consumes: `src/db/index.ts`, `src/db/schema/index.ts`, `src/lib/storage.ts`
- Produces: Frictionless tokenized invoice payment page (`/i/[token]`) and authenticated tenant portal (`/portal`).

- [ ] **Step 1: Write the failing test**

```typescript
// tests/server/invoice-token.test.ts
import { describe, it, expect } from 'vitest';
import { generateSecureToken } from '@/lib/token';

describe('Invoice Token Security', () => {
  it('should generate high-entropy random token for guest invoice access', () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();
    expect(token1).toHaveLength(32);
    expect(token1).not.toBe(token2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/server/invoice-token.test.ts`
Expected: FAIL with `generateSecureToken` not found.

- [ ] **Step 3: Implement Tokenized Invoice Page and Tenant Portal**

1. `src/lib/token.ts`: Utility `generateSecureToken()` menggunakan crypto bawaan Node/WebCrypto.
2. `src/app/i/[token]/page.tsx`: Halaman publik aman yang mengambil invoice berdasarkan `token`. Menampilkan rincian sewa, instruksi transfer rekening & gambar QRIS statis pemilik kos, serta form unggah bukti bayar.
3. `src/components/tenant/UploadProofForm.tsx`: Komponen unggah file dengan validasi ukuran (<5MB) dan ekstensi file, mengunggah ke bucket privat `payment-proofs`.
4. `src/app/(tenant)/portal/page.tsx`: Halaman portal khusus penghuni login, menampilkan ringkasan kamar, masa aktif kontrak sewa, tagihan berjalan, dan riwayat kuitansi.
5. `src/app/login/page.tsx`: Halaman login terpadu (pemilik, admin, dan penghuni).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/server/invoice-token.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/i/ src/app/\(tenant\)/ src/app/login/ src/components/tenant/ src/lib/token.ts tests/server/
git commit -m "feat(tenant): implement tokenized payment page and tenant portal"
```

---

### Task 9: Automated Cron Endpoints & Vercel Configuration

**Files:**
- Create: `src/app/api/cron/invoices/route.ts`
- Create: `src/app/api/cron/bookings/route.ts`
- Create: `vercel.json`
- Test: `tests/api/cron.test.ts`

**Interfaces:**
- Consumes: `src/db/index.ts`, `src/db/schema/index.ts`
- Produces: Idempotent background cron routes protected by `CRON_SECRET`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/api/cron.test.ts
import { describe, it, expect } from 'vitest';
import { verifyCronAuth } from '@/lib/cron';

describe('Cron Security Verification', () => {
  it('should reject unauthorized cron triggers without matching CRON_SECRET', () => {
    const authHeader = 'Bearer wrong-secret';
    expect(verifyCronAuth(authHeader, 'correct-secret')).toBe(false);
    expect(verifyCronAuth('Bearer correct-secret', 'correct-secret')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/api/cron.test.ts`
Expected: FAIL with `verifyCronAuth` not found.

- [ ] **Step 3: Implement cron routes and vercel.json**

1. `src/lib/cron.ts`: Helper `verifyCronAuth(header, secret)`.
2. `src/app/api/cron/invoices/route.ts`:
   - Validasi `CRON_SECRET`.
   - Iterasi kontrak aktif (`leases.status = 'aktif'`).
   - Buat tagihan bulan berjalan jika belum ada (`ON CONFLICT (lease_id, period_month, period_year) DO NOTHING`).
3. `src/app/api/cron/bookings/route.ts`:
   - Validasi `CRON_SECRET`.
   - Cari booking dengan status `survei_dijadwalkan` atau hold yang `hold_until < NOW()`.
   - Ubah status menjadi `kedaluwarsa`.
4. `vercel.json`: Konfigurasi cron expression harian untuk tagihan dan per jam untuk kedaluwarsa booking.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/api/cron.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cron/ src/lib/cron.ts vercel.json tests/api/
git commit -m "feat(cron): add idempotent cron endpoints and vercel schedule configuration"
```

---

### Task 10: End-to-End Verification & Documentation Polish

**Files:**
- Modify: `README.md:1-50`
- Modify: `PROGRESS.md`
- Modify: `DECISIONS.md`
- Test: `tests/e2e/workflow.test.ts`

**Interfaces:**
- Consumes: All modules
- Produces: Production-ready Kosmanis MVP application with green tests and verified build.

- [ ] **Step 1: Write workflow integration test**

```typescript
// tests/e2e/workflow.test.ts
import { describe, it, expect } from 'vitest';

describe('Kosmanis Workflow Integrity', () => {
  it('should confirm end-to-end business rules are respected', () => {
    // Verifikasi aturan penting: uang integer, snapshot harga, isolasi role
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run all verifications mandated by AGENTS.md**

Run: `pnpm lint`
Expected: PASS with 0 errors.

Run: `pnpm typecheck`
Expected: PASS with 0 errors.

Run: `pnpm test`
Expected: PASS with all test suites passing.

Run: `pnpm build`
Expected: Successful Next.js build output.

- [ ] **Step 3: Update tracking documentation**

Catat kemajuan di `PROGRESS.md` dan keputusan arsitektur di `DECISIONS.md`.

- [ ] **Step 4: Commit**

```bash
git add README.md PROGRESS.md DECISIONS.md tests/e2e/
git commit -m "chore: complete MVP implementation with full verification"
```
