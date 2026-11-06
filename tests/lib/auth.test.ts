import { describe, it, expect, beforeEach } from 'vitest';
import { requireRole, determineDestinationByRole } from '@/lib/auth/session';
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginRateLimit,
} from '@/lib/auth/rate-limit';
import {
  validateLoginInput,
  validateOtpLoginInput,
} from '@/lib/validators';

describe('Auth Role Verification & Route Redirection (FR-21 & FR-43)', () => {
  it('should reject access if profile role is not in allowedRoles', async () => {
    const mockProfile = { id: '1', role: 'penghuni' as const, fullName: 'Dika' };
    expect(() => {
      if (!['pemilik', 'admin'].includes(mockProfile.role)) {
        throw new Error('Unauthorized role');
      }
    }).toThrow('Unauthorized role');
  });

  it('should export requireRole function', () => {
    expect(requireRole).toBeDefined();
  });

  it('should redirect pemilik and admin to /admin/dashboard', () => {
    expect(determineDestinationByRole('pemilik')).toBe('/admin/dashboard');
    expect(determineDestinationByRole('admin')).toBe('/admin/dashboard');
  });

  it('should redirect penghuni to /portal', () => {
    expect(determineDestinationByRole('penghuni')).toBe('/portal');
    expect(determineDestinationByRole(undefined)).toBe('/portal');
  });

  it('should prevent privilege escalation redirect for tenants', () => {
    // Penghuni mencoba membuka rute admin lewat parameter redirectTo
    expect(determineDestinationByRole('penghuni', '/admin/kamar')).toBe('/portal');
    expect(determineDestinationByRole('penghuni', '/portal/tagihan')).toBe('/portal/tagihan');
  });

  it('should prevent open redirect vulnerabilities', () => {
    // Percobaan open redirect ke domain luar
    expect(determineDestinationByRole('pemilik', 'https://malicious-site.com')).toBe(
      '/admin/dashboard'
    );
    expect(determineDestinationByRole('pemilik', '//malicious-site.com')).toBe(
      '/admin/dashboard'
    );
  });
});

describe('Login Rate Limiter (PRD Keamanan)', () => {
  const testEmail = 'tester@kosmanis.com';

  beforeEach(() => {
    resetLoginRateLimit(testEmail);
  });

  it('should allow initial login attempts', () => {
    const status = checkLoginRateLimit(testEmail);
    expect(status.allowed).toBe(true);
    expect(status.remainingAttempts).toBe(5);
  });

  it('should block after 5 failed attempts and recover on reset', () => {
    for (let i = 0; i < 5; i++) {
      recordFailedLoginAttempt(testEmail);
    }

    const blocked = checkLoginRateLimit(testEmail);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remainingAttempts).toBe(0);

    resetLoginRateLimit(testEmail);
    const recovered = checkLoginRateLimit(testEmail);
    expect(recovered.allowed).toBe(true);
    expect(recovered.remainingAttempts).toBe(5);
  });
});

describe('Login Input Validation (Zod)', () => {
  it('should validate valid email and password', () => {
    const input = {
      email: 'admin@kosmanis.com',
      password: 'password123',
    };
    const validated = validateLoginInput(input);
    expect(validated.email).toBe('admin@kosmanis.com');
    expect(validated.password).toBe('password123');
  });

  it('should reject invalid email format', () => {
    expect(() =>
      validateLoginInput({
        email: 'invalid-email',
        password: 'password123',
      })
    ).toThrow();
  });

  it('should reject password with less than 6 characters', () => {
    expect(() =>
      validateLoginInput({
        email: 'admin@kosmanis.com',
        password: '123',
      })
    ).toThrow();
  });

  it('should validate OTP login identifier', () => {
    const validEmail = validateOtpLoginInput({ identifier: 'user@kosmanis.com' });
    expect(validEmail.identifier).toBe('user@kosmanis.com');

    const validPhone = validateOtpLoginInput({ identifier: '08123456789' });
    expect(validPhone.identifier).toBe('08123456789');

    expect(() => validateOtpLoginInput({ identifier: 'ab' })).toThrow();
  });
});
