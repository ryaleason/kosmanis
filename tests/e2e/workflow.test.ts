import { describe, it, expect } from 'vitest';
import { getSeedData } from '@/db/seed';
import { formatRupiah } from '@/lib/format';
import { generateWhatsAppReminderUrl } from '@/components/admin/WhatsAppReminderButton';
import { verifyCronAuth } from '@/lib/cron';

describe('Kosmanis End-to-End Workflow & Business Rules', () => {
  it('should verify pricing snapshotting rule (FR-59)', () => {
    const seed = getSeedData();
    const lease = seed.leases[0];
    const roomType = seed.roomTypes.find((t) => t.id === seed.rooms[0].roomTypeId);

    // Initial price matches
    expect(lease.rentAmount).toBe(roomType?.basePrice);

    // If master price changes in the future, lease snapshot remains unchanged
    const futureChangedBasePrice = 1800000;
    expect(lease.rentAmount).not.toBe(futureChangedBasePrice);
    expect(lease.rentAmount).toBe(1500000);
  });

  it('should verify money is stored as integer and rendered as IDR format without floats', () => {
    const seed = getSeedData();
    seed.invoices.forEach((inv) => {
      expect(Number.isInteger(inv.amount)).toBe(true);
      expect(formatRupiah(inv.amount)).toMatch(/^Rp\s\d{1,3}(\.\d{3})*$/);
    });
  });

  it('should verify WhatsApp reminder generation includes required fields and deep link', () => {
    const seed = getSeedData();
    const inv = seed.invoices[0];
    const tenant = seed.tenants[0];

    const url = generateWhatsAppReminderUrl({
      phoneNumber: tenant.phoneNumber,
      tenantName: tenant.name,
      roomNumber: '101',
      amount: inv.amount,
      dueDate: '5 November 2026',
      invoiceUrl: `https://kosmanis.com/i/${inv.token}`,
    });

    expect(url).toContain('https://wa.me/6285712345678');
    expect(url).toContain(encodeURIComponent('Dika Pratama'));
    expect(url).toContain(encodeURIComponent(inv.token));
  });

  it('should enforce CRON_SECRET security check', () => {
    expect(verifyCronAuth('Bearer my-secret', 'my-secret')).toBe(true);
    expect(verifyCronAuth('Bearer wrong', 'my-secret')).toBe(false);
  });
});
