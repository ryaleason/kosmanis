import { z } from 'zod';

// Property Validators
export const propertySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nama kos wajib diisi'),
  category: z.enum(['putra', 'putri', 'campur']),
  description: z.string().optional(),
  address: z.string().min(1, 'Alamat wajib diisi'),
  city: z.string().min(1, 'Kota wajib diisi'),
  whatsappNumber: z.string().min(1, 'Nomor WhatsApp wajib diisi'),
  rules: z.array(z.string()).default([]),
  facilities: z.array(z.string()).default([]),
  qrisImageUrl: z.string().optional(),
  bankAccounts: z
    .array(
      z.object({
        bankName: z.string(),
        accountNumber: z.string(),
        accountHolder: z.string(),
      })
    )
    .default([]),
});

export type PropertyInput = z.infer<typeof propertySchema>;

export function validatePropertyInput(input: unknown): PropertyInput {
  return propertySchema.parse(input);
}

// Room Validators
export const roomTypeSchema = z.object({
  propertyId: z.string().uuid(),
  name: z.string().min(1, 'Nama tipe kamar wajib diisi'),
  description: z.string().optional(),
  facilities: z.array(z.string()).default([]),
  basePrice: z.number().int().positive('Harga sewa harus lebih dari 0'),
  depositAmount: z.number().int().nonnegative().default(0),
  electricityMode: z.enum(['termasuk_sewa', 'bayar_sendiri']).default('termasuk_sewa'),
});

export const roomSchema = z.object({
  propertyId: z.string().uuid(),
  roomTypeId: z.string().uuid(),
  roomNumber: z.string().min(1, 'Nomor kamar wajib diisi'),
  floor: z.number().int().positive().default(1),
  status: z.enum(['kosong', 'terisi', 'segera_kosong']).default('kosong'),
  images: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type RoomTypeInput = z.infer<typeof roomTypeSchema>;
export type RoomInput = z.infer<typeof roomSchema>;

export function validateRoomTypeInput(input: unknown): RoomTypeInput {
  return roomTypeSchema.parse(input);
}

export function validateRoomInput(input: unknown): RoomInput {
  return roomSchema.parse(input);
}

// Tenant & Lease Validators
export const tenantLeaseSchema = z.object({
  propertyId: z.string().uuid(),
  tenantName: z.string().min(1, 'Nama penghuni wajib diisi'),
  idCardNumber: z.string().optional(),
  phoneNumber: z.string().min(1, 'Nomor HP wajib diisi'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  roomId: z.string().uuid(),
  rentAmount: z.number().int().positive('Nomor sewa snapshot wajib berupa bilangan bulat positif'),
  depositAmount: z.number().int().nonnegative().default(0),
  dueDay: z.number().int().min(1).max(31).default(1),
  startDate: z.string(),
  endDate: z.string(),
});

export type TenantLeaseInput = z.infer<typeof tenantLeaseSchema>;

export function validateTenantLeaseInput(input: unknown): TenantLeaseInput {
  return tenantLeaseSchema.parse(input);
}

// Payment & Invoice Validators
export const verifyPaymentSchema = z.object({
  paymentId: z.string().uuid(),
  status: z.enum(['diterima', 'ditolak']),
  rejectionReason: z.string().optional(),
});

export const uploadPaymentProofSchema = z.object({
  invoiceToken: z.string().min(1, 'Token tagihan tidak valid'),
  paymentMethod: z.enum(['transfer_manual', 'qris_statis']).default('transfer_manual'),
  proofImageUrl: z.string().min(1, 'Bukti pembayaran wajib dilampirkan'),
});

// Booking & Survey Validators
export const bookingStatusSchema = z.object({
  bookingId: z.string().uuid(),
  status: z.enum([
    'baru',
    'dihubungi',
    'survei_dijadwalkan',
    'disetujui',
    'ditolak',
    'kedaluwarsa',
  ]),
  holdUntil: z.string().optional(),
});

export const publicBookingSchema = z.object({
  propertyId: z.string().uuid(),
  roomId: z.string().uuid().optional(),
  name: z.string().min(1, 'Nama wajib diisi'),
  phoneNumber: z.string().min(8, 'Nomor WhatsApp tidak valid'),
  plannedStartDate: z.string(),
  durationMonths: z.number().int().min(1).default(1),
  notes: z.string().optional(),
});

export const publicSurveySchema = z.object({
  propertyId: z.string().uuid(),
  slotId: z.string().uuid(),
  name: z.string().min(1, 'Nama wajib diisi'),
  phoneNumber: z.string().min(8, 'Nomor WhatsApp tidak valid'),
});

// Auth Validators (FR-21 & FR-43)
export const loginSchema = z.object({
  email: z.string().trim().email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  redirectTo: z.string().optional(),
});

export const otpLoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, 'Masukkan alamat email atau nomor HP yang valid'),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email('Format email tidak valid').optional(),
  phone: z.string().trim().optional(),
  token: z.string().trim().min(6, 'Kode OTP minimal 6 digit'),
  redirectTo: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type OtpLoginInput = z.infer<typeof otpLoginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export function validateLoginInput(input: unknown): LoginInput {
  return loginSchema.parse(input);
}

export function validateOtpLoginInput(input: unknown): OtpLoginInput {
  return otpLoginSchema.parse(input);
}

export function validateVerifyOtpInput(input: unknown): VerifyOtpInput {
  return verifyOtpSchema.parse(input);
}

