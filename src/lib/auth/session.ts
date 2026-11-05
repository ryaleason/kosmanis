import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { profiles, type Profile } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    const [userProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    return userProfile || null;
  } catch {
    return null;
  }
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
