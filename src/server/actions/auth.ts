'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { profiles, type Profile } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSeedData } from '@/db/seed';
import { validateLoginInput } from '@/lib/validators';
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginRateLimit,
} from '@/lib/auth/rate-limit';
import { determineDestinationByRole } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export interface AuthActionResult {
  success: boolean;
  message?: string;
  redirectTo?: string;
  role?: string;
}

// Akun pengujian / seed standar kos
const DEMO_CREDENTIALS: Record<
  string,
  { role: 'pemilik' | 'admin' | 'penghuni'; pass: string; name: string }
> = {
  'admin@kosmanis.com': {
    role: 'admin',
    pass: 'admin123',
    name: 'Sari Handayani (Admin Kos)',
  },
  'pemilik@kosmanis.com': {
    role: 'pemilik',
    pass: 'pemilik123',
    name: 'Budi Hartono (Pemilik Kos)',
  },
  'penghuni@kosmanis.com': {
    role: 'penghuni',
    pass: 'penghuni123',
    name: 'Dika Pratama (Penghuni Kos)',
  },
};

/**
 * Server Action: Login dengan Email & Kata Sandi (FR-21 & FR-43).
 * Mencegah brute-force dengan pembatasan percobaan login,
 * memverifikasi sesi di server, dan merutekan otomatis berdasarkan peran di tabel profiles.
 */
export async function loginWithPasswordAction(
  input: unknown
): Promise<AuthActionResult> {
  const validated = validateLoginInput(input);
  const email = validated.email.toLowerCase();

  // 1. Cek proteksi rate limiting (pembatasan percobaan login)
  const rateLimit = checkLoginRateLimit(email);
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Terlalu banyak percobaan login gagal. Silakan coba lagi dalam ${Math.ceil(
        rateLimit.resetInSeconds / 60
      )} menit.`,
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error || !data.user) {
      // Fallback akun demo terverifikasi jika auth.users belum dibuat di Supabase lokal
      const demoAccount = DEMO_CREDENTIALS[email];
      if (demoAccount && validated.password === demoAccount.pass) {
        resetLoginRateLimit(email);
        const destination = determineDestinationByRole(
          demoAccount.role,
          validated.redirectTo
        );
        return {
          success: true,
          redirectTo: destination,
          role: demoAccount.role,
        };
      }

      recordFailedLoginAttempt(email);
      return {
        success: false,
        message:
          'Kombinasi email atau kata sandi tidak cocok. Silakan periksa kembali atau gunakan akun demo di bawah.',
      };
    }

    // Login berhasil -> reset rate limit
    resetLoginRateLimit(email);

    // 2. Ambil profil pengguna dari tabel profiles untuk menentukan peran (FR-21 / FR-43)
    let userProfile: Profile | null = null;
    try {
      const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, data.user.id))
        .limit(1);
      userProfile = profile || null;
    } catch {
      // Fallback ke seed data jika koneksi db lokal sedang fallback
      const seedProfile = getSeedData().profiles.find((p) => p.id === data.user.id);
      if (seedProfile) userProfile = seedProfile as Profile;
    }

    const destination = determineDestinationByRole(
      userProfile?.role,
      validated.redirectTo
    );

    return {
      success: true,
      redirectTo: destination,
      role: userProfile?.role,
    };
  } catch (err: unknown) {
    // Fallback akun demo jika koneksi Supabase offline/placeholder
    const demoAccount = DEMO_CREDENTIALS[email];
    if (demoAccount && validated.password === demoAccount.pass) {
      resetLoginRateLimit(email);
      const destination = determineDestinationByRole(
        demoAccount.role,
        validated.redirectTo
      );
      return {
        success: true,
        redirectTo: destination,
        role: demoAccount.role,
      };
    }

    recordFailedLoginAttempt(email);
    const message =
      err instanceof Error
        ? err.message
        : 'Terjadi kesalahan sistem saat memproses login.';
    return {
      success: false,
      message,
    };
  }
}

/**
 * Server Action: Logout aman untuk Admin dan Penghuni.
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
