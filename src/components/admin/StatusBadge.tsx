import React from 'react';

type StatusType =
  | 'lunas'
  | 'menunggu_verifikasi'
  | 'belum_bayar'
  | 'terlambat'
  | 'dibatalkan'
  | 'aktif'
  | 'nonaktif'
  | 'kosong'
  | 'terisi'
  | 'segera_kosong'
  | 'baru'
  | 'dihubungi'
  | 'survei_dijadwalkan'
  | 'disetujui'
  | 'ditolak'
  | 'kedaluwarsa'
  | string;

interface StatusConfig {
  label: string;
  className: string;
}

const statusMap: Record<string, StatusConfig> = {
  // Tagihan & Pembayaran
  lunas: {
    label: 'Lunas',
    className: 'bg-[#DCFCE7] text-[#166534]',
  },
  menunggu_verifikasi: {
    label: 'Menunggu Verifikasi',
    className: 'bg-[#FEF3C7] text-[#92400E]',
  },
  belum_bayar: {
    label: 'Belum Bayar',
    className: 'bg-[#FEE2E2] text-[#991B1B]',
  },
  terlambat: {
    label: 'Terlambat',
    className: 'bg-[#FEE2E2] text-[#991B1B]',
  },
  dibatalkan: {
    label: 'Dibatalkan',
    className: 'bg-[#F3F4F6] text-[#4B5563]',
  },

  // Kamar
  kosong: {
    label: 'Kosong',
    className: 'bg-[#E0F2FE] text-[#0369A1]',
  },
  terisi: {
    label: 'Terisi',
    className: 'bg-[#F3F4F6] text-[#4B5563]',
  },
  segera_kosong: {
    label: 'Segera Kosong',
    className: 'bg-[#FEF3C7] text-[#92400E]',
  },

  // Penghuni & Kontrak
  aktif: {
    label: 'Aktif',
    className: 'bg-[#DCFCE7] text-[#166534]',
  },
  nonaktif: {
    label: 'Nonaktif',
    className: 'bg-[#F3F4F6] text-[#4B5563]',
  },

  // Booking
  baru: {
    label: 'Baru',
    className: 'bg-[#E0F2FE] text-[#0369A1]',
  },
  dihubungi: {
    label: 'Dihubungi',
    className: 'bg-[#FEF3C7] text-[#92400E]',
  },
  survei_dijadwalkan: {
    label: 'Survei Dijadwalkan',
    className: 'bg-[#FEF3C7] text-[#92400E]',
  },
  disetujui: {
    label: 'Disetujui',
    className: 'bg-[#DCFCE7] text-[#166534]',
  },
  ditolak: {
    label: 'Ditolak',
    className: 'bg-[#FEE2E2] text-[#991B1B]',
  },
  kedaluwarsa: {
    label: 'Kedaluwarsa',
    className: 'bg-[#F3F4F6] text-[#4B5563]',
  },
};

export function StatusBadge({
  status,
  className = '',
}: {
  status?: StatusType | null;
  className?: string;
}) {
  const normalized = status ? status.toLowerCase().trim() : '';
  const config = statusMap[normalized] || {
    label: (status || '-').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    className: 'bg-[#F3F4F6] text-[#4B5563]',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
