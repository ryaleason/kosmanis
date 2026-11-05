import { describe, it, expect } from 'vitest';
import { verifyCronAuth } from '@/lib/cron';

describe('Cron Security Verification', () => {
  it('should reject unauthorized cron triggers without matching CRON_SECRET', () => {
    const secret = 'super-secret-cron-token';
    expect(verifyCronAuth('Bearer wrong-secret', secret)).toBe(false);
    expect(verifyCronAuth(undefined, secret)).toBe(false);
    expect(verifyCronAuth('wrong-format', secret)).toBe(false);
    expect(verifyCronAuth(`Bearer ${secret}`, secret)).toBe(true);
  });
});
