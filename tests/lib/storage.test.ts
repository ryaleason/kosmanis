import { describe, it, expect } from 'vitest';
import { getPublicRoomPhotoUrl, isAllowedMimeType } from '@/lib/storage';

describe('Storage Helpers', () => {
  it('should validate allowed MIME types correctly', () => {
    expect(isAllowedMimeType('image/jpeg')).toBe(true);
    expect(isAllowedMimeType('image/png')).toBe(true);
    expect(isAllowedMimeType('image/webp')).toBe(true);
    expect(isAllowedMimeType('application/pdf')).toBe(true);
    expect(isAllowedMimeType('application/x-sh')).toBe(false);
    expect(isAllowedMimeType('text/html')).toBe(false);
  });

  it('should generate valid public room photo url format', () => {
    const url = getPublicRoomPhotoUrl('rooms/kamar-101.jpg');
    expect(url).toContain('room-photos');
    expect(url).toContain('rooms/kamar-101.jpg');
  });
});
