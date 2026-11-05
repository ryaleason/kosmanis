import { describe, it, expect } from 'vitest';
import {
  validateTenantLeaseInput,
  validatePropertyInput,
  validateRoomInput,
} from '@/lib/validators';

describe('Server Actions Validation & Snapshotting', () => {
  it('should validate and snapshot rent and deposit amounts on lease creation', () => {
    const input = {
      propertyId: 'e2a6e088-3e4b-4b2a-8888-000000000001',
      tenantName: 'Budi Santoso',
      idCardNumber: '3201234567890001',
      phoneNumber: '081234567890',
      roomId: 'e2a6e088-3e4b-4b2a-8888-000000000101',
      rentAmount: 1500000,
      depositAmount: 500000,
      dueDay: 5,
      startDate: new Date('2026-11-01').toISOString(),
      endDate: new Date('2027-11-01').toISOString(),
    };
    const validated = validateTenantLeaseInput(input);
    expect(validated.rentAmount).toBe(1500000);
    expect(validated.depositAmount).toBe(500000);
    expect(validated.tenantName).toBe('Budi Santoso');
  });

  it('should validate property settings input', () => {
    const propertyInput = {
      id: 'e2a6e088-3e4b-4b2a-8888-000000000001',
      name: 'Kos Manis Sukajadi',
      category: 'campur' as const,
      address: 'Jl. Kenanga No. 12',
      city: 'Bandung',
      whatsappNumber: '081234567890',
      rules: ['Dilarang merokok'],
      facilities: ['WiFi'],
    };
    const validated = validatePropertyInput(propertyInput);
    expect(validated.name).toBe('Kos Manis Sukajadi');
    expect(validated.category).toBe('campur');
  });

  it('should validate room creation and update input', () => {
    const roomInput = {
      propertyId: 'e2a6e088-3e4b-4b2a-8888-000000000001',
      roomTypeId: 'e2a6e088-3e4b-4b2a-8888-000000000002',
      roomNumber: '105',
      floor: 1,
      status: 'kosong' as const,
    };
    const validated = validateRoomInput(roomInput);
    expect(validated.roomNumber).toBe('105');
  });
});
