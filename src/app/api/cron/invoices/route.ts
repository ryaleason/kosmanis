import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { leases, invoices } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyCronAuth } from '@/lib/cron';
import { generateSecureToken } from '@/lib/token';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!verifyCronAuth(authHeader)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid CRON_SECRET' }, { status: 401 });
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  try {
    // 1. Ambil semua kontrak yang aktif
    const activeLeases = await db
      .select()
      .from(leases)
      .where(eq(leases.status, 'aktif'));

    let generatedCount = 0;

    for (const lease of activeLeases) {
      const invoiceNumber = `INV-${currentYear}${String(currentMonth).padStart(2, '0')}-${lease.id.slice(0, 4).toUpperCase()}`;
      const dueDate = new Date(Date.UTC(currentYear, currentMonth - 1, lease.dueDay, 17, 0, 0)); // Akhir hari jatuh tempo WIB

      // Idempotent insertion: jika (leaseId, periodMonth, periodYear) sudah ada, abaikan
      const result = await db
        .insert(invoices)
        .values({
          propertyId: lease.propertyId,
          leaseId: lease.id,
          invoiceNumber,
          periodMonth: currentMonth,
          periodYear: currentYear,
          amount: lease.rentAmount, // Snapshot harga kontrak
          status: 'belum_bayar',
          dueDate,
          token: generateSecureToken(),
        })
        .onConflictDoNothing({
          target: [invoices.leaseId, invoices.periodMonth, invoices.periodYear],
        })
        .returning();

      if (result.length > 0) {
        generatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil memproses cron invoice bulanan`,
      month: currentMonth,
      year: currentYear,
      activeLeasesChecked: activeLeases.length,
      newInvoicesGenerated: generatedCount,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memproses cron invoice' },
      { status: 500 }
    );
  }
}
