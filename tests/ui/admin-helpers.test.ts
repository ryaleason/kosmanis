import { describe, it, expect } from 'vitest';
import { generateWhatsAppReminderUrl } from '@/components/admin/WhatsAppReminderButton';

describe('Admin Helper Utilities', () => {
  it('should format valid wa.me url with invoice and tenant details', () => {
    const url = generateWhatsAppReminderUrl({
      phoneNumber: '08123456789',
      tenantName: 'Dika',
      roomNumber: '101',
      amount: 1500000,
      dueDate: '5 November 2026',
      invoiceUrl: 'https://kosmanis.com/i/token-123',
    });
    expect(url).toContain('https://wa.me/628123456789');
    expect(url).toContain('Dika');
    expect(url).toContain('101');
    expect(url).toContain('token-123');
  });
});
