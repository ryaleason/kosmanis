-- ==============================================================================
-- KOSMANIS - FULL SUPABASE SETUP SCRIPT (DDL, RLS POLICIES & STORAGE BUCKETS)
-- ==============================================================================
-- File ini dapat langsung dijalankan di Supabase Dashboard -> SQL Editor
-- atau via migration otomatis Drizzle (`pnpm db:migrate`).
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREATE TABLES
CREATE TABLE IF NOT EXISTS "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"category" text DEFAULT 'campur' NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"rules" jsonb DEFAULT '[]'::jsonb,
	"facilities" jsonb DEFAULT '[]'::jsonb,
	"qris_image_url" text,
	"bank_accounts" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
	"property_id" uuid REFERENCES "properties"("id"),
	"role" text DEFAULT 'penghuni' NOT NULL,
	"full_name" text NOT NULL,
	"phone_number" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "room_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL REFERENCES "properties"("id"),
	"name" text NOT NULL,
	"description" text,
	"facilities" jsonb DEFAULT '[]'::jsonb,
	"base_price" integer NOT NULL,
	"deposit_amount" integer DEFAULT 0 NOT NULL,
	"electricity_mode" text DEFAULT 'termasuk_sewa' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL REFERENCES "properties"("id"),
	"room_type_id" uuid NOT NULL REFERENCES "room_types"("id"),
	"room_number" text NOT NULL,
	"floor" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'kosong' NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL REFERENCES "properties"("id"),
	"profile_id" uuid REFERENCES "profiles"("id"),
	"name" text NOT NULL,
	"id_card_number" text,
	"id_card_image_url" text,
	"phone_number" text NOT NULL,
	"emergency_contact_name" text,
	"emergency_contact_phone" text,
	"status" text DEFAULT 'aktif' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "leases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL REFERENCES "properties"("id"),
	"tenant_id" uuid NOT NULL REFERENCES "tenants"("id"),
	"room_id" uuid NOT NULL REFERENCES "rooms"("id"),
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"rent_amount" integer NOT NULL,
	"deposit_amount" integer DEFAULT 0 NOT NULL,
	"due_day" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'aktif' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL REFERENCES "properties"("id"),
	"lease_id" uuid NOT NULL REFERENCES "leases"("id"),
	"invoice_number" text NOT NULL UNIQUE,
	"period_month" integer NOT NULL,
	"period_year" integer NOT NULL,
	"amount" integer NOT NULL,
	"status" text DEFAULT 'belum_bayar' NOT NULL,
	"due_date" timestamp with time zone NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_lease_period" UNIQUE("lease_id","period_month","period_year")
);

CREATE TABLE IF NOT EXISTS "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL REFERENCES "properties"("id"),
	"invoice_id" uuid NOT NULL REFERENCES "invoices"("id"),
	"amount" integer NOT NULL,
	"payment_method" text DEFAULT 'transfer_manual' NOT NULL,
	"proof_image_url" text NOT NULL,
	"status" text DEFAULT 'menunggu_verifikasi' NOT NULL,
	"rejection_reason" text,
	"verified_by" uuid REFERENCES "profiles"("id"),
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "booking_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL REFERENCES "properties"("id"),
	"room_id" uuid REFERENCES "rooms"("id"),
	"name" text NOT NULL,
	"phone_number" text NOT NULL,
	"planned_start_date" timestamp with time zone NOT NULL,
	"duration_months" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'baru' NOT NULL,
	"hold_until" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "survey_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL REFERENCES "properties"("id"),
	"date" text NOT NULL,
	"time_slot" text NOT NULL,
	"quota" integer DEFAULT 3 NOT NULL,
	"booked_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE "properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "room_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rooms" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "leases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "booking_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "survey_slots" ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check Admin / Pemilik Role
CREATE OR REPLACE FUNCTION public.is_admin_or_owner()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('pemilik', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Properties Policies (Public can read, Admin/Owner can manage)
DROP POLICY IF EXISTS "Public can view properties" ON "properties";
CREATE POLICY "Public can view properties" ON "properties" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage properties" ON "properties";
CREATE POLICY "Admin can manage properties" ON "properties" FOR ALL USING (public.is_admin_or_owner());

-- Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile" ON "profiles";
CREATE POLICY "Users can read own profile" ON "profiles" FOR SELECT USING (id = auth.uid() OR public.is_admin_or_owner());

DROP POLICY IF EXISTS "Users can update own profile" ON "profiles";
CREATE POLICY "Users can update own profile" ON "profiles" FOR UPDATE USING (id = auth.uid());

-- Room Types & Rooms Policies (Public can read, Admin can manage)
DROP POLICY IF EXISTS "Public can view room types" ON "room_types";
CREATE POLICY "Public can view room types" ON "room_types" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage room types" ON "room_types";
CREATE POLICY "Admin can manage room types" ON "room_types" FOR ALL USING (public.is_admin_or_owner());

DROP POLICY IF EXISTS "Public can view rooms" ON "rooms";
CREATE POLICY "Public can view rooms" ON "rooms" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage rooms" ON "rooms";
CREATE POLICY "Admin can manage rooms" ON "rooms" FOR ALL USING (public.is_admin_or_owner());

-- Booking & Survey Policies (Public can insert, Admin can manage)
DROP POLICY IF EXISTS "Public can create booking" ON "booking_requests";
CREATE POLICY "Public can create booking" ON "booking_requests" FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage bookings" ON "booking_requests";
CREATE POLICY "Admin can manage bookings" ON "booking_requests" FOR ALL USING (public.is_admin_or_owner());

DROP POLICY IF EXISTS "Public can view survey slots" ON "survey_slots";
CREATE POLICY "Public can view survey slots" ON "survey_slots" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage survey slots" ON "survey_slots";
CREATE POLICY "Admin can manage survey slots" ON "survey_slots" FOR ALL USING (public.is_admin_or_owner());

-- Tenants & Leases Policies
DROP POLICY IF EXISTS "Tenant can view own record" ON "tenants";
CREATE POLICY "Tenant can view own record" ON "tenants" FOR SELECT USING (profile_id = auth.uid() OR public.is_admin_or_owner());

DROP POLICY IF EXISTS "Admin can manage tenants" ON "tenants";
CREATE POLICY "Admin can manage tenants" ON "tenants" FOR ALL USING (public.is_admin_or_owner());

DROP POLICY IF EXISTS "Tenant can view own leases" ON "leases";
CREATE POLICY "Tenant can view own leases" ON "leases" FOR SELECT USING (
  tenant_id IN (SELECT id FROM "tenants" WHERE profile_id = auth.uid()) OR public.is_admin_or_owner()
);

DROP POLICY IF EXISTS "Admin can manage leases" ON "leases";
CREATE POLICY "Admin can manage leases" ON "leases" FOR ALL USING (public.is_admin_or_owner());

-- Invoices & Payments Policies
DROP POLICY IF EXISTS "Tenant can view own invoices" ON "invoices";
CREATE POLICY "Tenant can view own invoices" ON "invoices" FOR SELECT USING (
  lease_id IN (SELECT id FROM "leases" WHERE tenant_id IN (SELECT id FROM "tenants" WHERE profile_id = auth.uid())) 
  OR public.is_admin_or_owner()
);

DROP POLICY IF EXISTS "Admin can manage invoices" ON "invoices";
CREATE POLICY "Admin can manage invoices" ON "invoices" FOR ALL USING (public.is_admin_or_owner());

DROP POLICY IF EXISTS "Tenant can view and insert payments" ON "payments";
CREATE POLICY "Tenant can view and insert payments" ON "payments" FOR ALL USING (
  invoice_id IN (SELECT id FROM "invoices" WHERE lease_id IN (SELECT id FROM "leases" WHERE tenant_id IN (SELECT id FROM "tenants" WHERE profile_id = auth.uid())))
  OR public.is_admin_or_owner()
);

-- ==============================================================================
-- 4. SUPABASE STORAGE BUCKETS SETUP
-- ==============================================================================
-- Buckets:
-- 1. room-photos (public)
-- 2. tenant-documents (private)
-- 3. payment-proofs (private)

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('room-photos', 'room-photos', true),
  ('tenant-documents', 'tenant-documents', false),
  ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public can view room photos" ON storage.objects;
CREATE POLICY "Public can view room photos" ON storage.objects FOR SELECT
USING (bucket_id = 'room-photos');

DROP POLICY IF EXISTS "Admin can manage room photos" ON storage.objects;
CREATE POLICY "Admin can manage room photos" ON storage.objects FOR ALL
USING (bucket_id = 'room-photos' AND public.is_admin_or_owner());

DROP POLICY IF EXISTS "Authorized can view payment proofs" ON storage.objects;
CREATE POLICY "Authorized can view payment proofs" ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs' AND (auth.uid() IS NOT NULL OR public.is_admin_or_owner()));

DROP POLICY IF EXISTS "Authorized can upload payment proofs" ON storage.objects;
CREATE POLICY "Authorized can upload payment proofs" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Authorized can view tenant documents" ON storage.objects;
CREATE POLICY "Authorized can view tenant documents" ON storage.objects FOR SELECT
USING (bucket_id = 'tenant-documents' AND (auth.uid() IS NOT NULL OR public.is_admin_or_owner()));
