'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function MaskedNik({ nik }: { nik?: string | null }) {
  const [show, setShow] = useState(false);

  if (!nik || nik.trim() === '') {
    return <span className="text-[#6B7280] text-[14px]">-</span>;
  }

  const masked =
    nik.length > 8
      ? `${nik.slice(0, 6)}••••••${nik.slice(-4)}`
      : '••••••••';

  return (
    <div className="inline-flex items-center gap-2">
      <span className="font-[family-name:inherit] tabular-nums text-[14px] text-[#1F2937]">
        {show ? nik : masked}
      </span>
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="p-1 text-[#6B7280] hover:text-[#0F172A] rounded transition focus:outline-none focus-visible:outline-2 focus-visible:outline-[#1CA3D4]"
        title={show ? 'Sembunyikan NIK' : 'Tampilkan NIK Lengkap'}
        aria-label={show ? 'Sembunyikan NIK' : 'Tampilkan NIK Lengkap'}
      >
        {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
