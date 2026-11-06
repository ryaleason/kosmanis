import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { profiles, type Profile } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSeedData } from '@/db/seed';

export type UserRole = 'pemilik' | 'admin' | 'penghuni';

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    try {
      const [userProfile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, user.id))
        .limit(1);

      if (userProfile) return userProfile;
    } catch {
      // Fallback ke seed data jika koneksi db lokal sedang fallback
      const seedProfile = getSeedData().profiles.find((p) => p.id === user.id);
      if (seedProfile) return seedProfile as Profile;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Menentukan rute tujuan setelah login sesuai peran pengguna (FR-21 & FR-43).
 * Pemilik / Admin -> /admin/dashboard
 * Penghuni -> /portal
 * Mencegah open redirect vulnerability.
 */
export function determineDestinationByRole(
  role: string | null | undefined,
  requestedRedirect?: string | null
): string {
  if (
    requestedRedirect &&
    requestedRedirect.startsWith('/') &&
    !requestedRedirect.startsWith('//') &&
    !requestedRedirect.includes('\\')
  ) {
    // Cegah penghuni mengakses panel admin via redirect
    if (role === 'penghuni' && requestedRedirect.startsWith('/admin')) {
      return '/portal';
    }
    // Jika admin mengakses rute admin, izinkan
    if ((role === 'pemilik' || role === 'admin') && requestedRedirect.startsWith('/admin')) {
      return requestedRedirect;
    }
    // Jika penghuni mengakses rute portal, izinkan
    if (role === 'penghuni' && requestedRedirect.startsWith('/portal')) {
      return requestedRedirect;
    }
  }

  if (role === 'pemilik' || role === 'admin') {
    return '/admin/dashboard';
  }
  return '/portal';
}

export async function requireRole(allowedRoles: UserRole[]): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile) {
    throw new Error('Unauthenticated: Silakan login terlebih dahulu');
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    throw new Error('Unauthorized: Anda tidak memiliki hak akses untuk tindakan ini');
  }

  return profile;
}
