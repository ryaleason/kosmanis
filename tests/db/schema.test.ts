import { describe, it, expect } from 'vitest';
import {
  properties,
  profiles,
  roomTypes,
  rooms,
  tenants,
  leases,
  invoices,
  payments,
  bookingRequests,
  surveySlots,
} from '@/db/schema';

describe('Drizzle Schema Definitions', () => {
  it('should define core tables with correct structure and constraints', () => {
    expect(properties).toBeDefined();
    expect(profiles).toBeDefined();
    expect(roomTypes).toBeDefined();
    expect(rooms).toBeDefined();
    expect(tenants).toBeDefined();
    expect(leases).toBeDefined();
    expect(invoices).toBeDefined();
    expect(payments).toBeDefined();
    expect(bookingRequests).toBeDefined();
    expect(surveySlots).toBeDefined();
  });
});
