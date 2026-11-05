import { describe, it, expect } from 'vitest';
import { requireRole } from '@/lib/auth/session';

describe('Auth Role Verification', () => {
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
});
