export function verifyCronAuth(authHeader?: string | null, expectedSecret?: string): boolean {
  const secret = expectedSecret || process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }

  if (!authHeader) {
    return false;
  }

  const expectedBearer = `Bearer ${secret}`;
  return authHeader === expectedBearer;
}
