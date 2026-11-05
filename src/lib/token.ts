import { randomBytes } from 'crypto';

export function generateSecureToken(): string {
  // Menghasilkan 32-byte hex string (64 karakter acak tahan tebakan)
  return randomBytes(32).toString('hex');
}
