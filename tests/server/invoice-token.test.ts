import { describe, it, expect } from 'vitest';
import { generateSecureToken } from '@/lib/token';

describe('Invoice Token Security', () => {
  it('should generate high-entropy random token for guest invoice access', () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();
    expect(token1).toBeDefined();
    expect(token1.length).toBeGreaterThanOrEqual(24);
    expect(token1).not.toBe(token2);
  });
});
