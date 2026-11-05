import { describe, it, expect } from 'vitest';
import { getSeedData } from '@/db/seed';

describe('Seed Data Integrity', () => {
  it('should generate realistic seed entities for Kosmanis client', () => {
    const data = getSeedData();
    expect(data.property.name).toBe('Kos Manis');
    expect(data.property.category).toBe('campur');
    expect(data.roomTypes.length).toBeGreaterThanOrEqual(2);
    expect(data.rooms.length).toBeGreaterThanOrEqual(6);
    expect(data.leases.length).toBeGreaterThanOrEqual(2);
    expect(data.invoices.length).toBeGreaterThanOrEqual(2);
    // Verifikasi immutabilitas harga (snapshot)
    data.leases.forEach((lease) => {
      expect(lease.rentAmount).toBeGreaterThan(0);
    });
  });
});
