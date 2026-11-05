'use client';

import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber: string;
  defaultMessage?: string;
}

export function FloatingWhatsApp({
  phoneNumber,
  defaultMessage = 'Halo, saya tertarik dengan informasi kamar kos di Kos Manis.',
}: FloatingWhatsAppProps) {
  let cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside aria-label="Kontak WhatsApp" className="fixed bottom-6 right-6 z-50">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Pengelola Kos"
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Tanya via WhatsApp</span>
      </a>
    </aside>
  );
}
