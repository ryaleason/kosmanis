import { describe, it, expect } from 'vitest';
import { formatRupiah } from '@/lib/format';

describe('Public UI Helpers', () => {
  it('should format integer rupiah correctly without float', () => {
    expect(formatRupiah(1500000)).toBe('Rp 1.500.000');
    expect(formatRupiah(0)).toBe('Rp 0');
    expect(formatRupiah(2100000)).toBe('Rp 2.100.000');
  });
});
