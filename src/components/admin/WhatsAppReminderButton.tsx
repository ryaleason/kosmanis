export interface ReminderData {
  phoneNumber: string;
  tenantName: string;
  roomNumber: string;
  amount: number;
  dueDate: string;
  invoiceUrl: string;
}

export function generateWhatsAppReminderUrl({
  phoneNumber,
  tenantName,
  roomNumber,
  amount,
  dueDate,
  invoiceUrl,
}: ReminderData): string {
  // Format nomor WhatsApp: jika mulai dari 08, ganti jadi 628
  let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.slice(1);
  }

  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);

  const message = `Halo Kak ${tenantName},\n\nMengingatkan tagihan sewa kamar ${roomNumber} sebesar ${formattedAmount} untuk periode ini jatuh tempo pada tanggal ${dueDate}.\n\nRincian dan unggah bukti transfer dapat diakses melalui tautan berikut:\n${invoiceUrl}\n\nTerima kasih! 🙏`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppReminderButton({ data }: { data: ReminderData }) {
  const url = generateWhatsAppReminderUrl(data);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition"
    >
      <span>Kirim Pengingat WA</span>
    </a>
  );
}
