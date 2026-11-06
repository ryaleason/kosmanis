/**
 * Rate Limiter sederhana di server untuk mencegah serangan brute-force login (PRD Keamanan)
 * Membatasi maksimal percobaaan login per identifier/IP dalam jendela waktu tertentu.
 */

interface RateLimitRecord {
  attempts: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit

export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  resetInSeconds: number;
} {
  const key = identifier.toLowerCase().trim();
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      resetInSeconds: Math.ceil(WINDOW_MS / 1000),
    };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetInSeconds: Math.max(0, Math.ceil((record.resetAt - now) / 1000)),
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - record.attempts,
    resetInSeconds: Math.max(0, Math.ceil((record.resetAt - now) / 1000)),
  };
}

export function recordFailedLoginAttempt(identifier: string): void {
  const key = identifier.toLowerCase().trim();
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, {
      attempts: 1,
      resetAt: now + WINDOW_MS,
    });
  } else {
    record.attempts += 1;
  }
}

export function resetLoginRateLimit(identifier: string): void {
  const key = identifier.toLowerCase().trim();
  rateLimitStore.delete(key);
}
