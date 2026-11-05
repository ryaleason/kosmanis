'use client';

import { useState } from 'react';
import { uploadPaymentProofAction } from '@/server/actions/upload-payment';

interface UploadProofFormProps {
  invoiceToken: string;
}

export function UploadProofForm({ invoiceToken }: UploadProofFormProps) {
  const [method, setMethod] = useState<'transfer_manual' | 'qris_statis'>('transfer_manual');
  const [proofUrl, setProofUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl) {
      setErrorMsg('Harap masukkan tautan bukti transfer');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await uploadPaymentProofAction({
        invoiceToken,
        paymentMethod: method,
        proofImageUrl: proofUrl,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal mengunggah bukti bayar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-2">
        <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
          ✓
        </div>
        <h4 className="font-bold text-emerald-900 text-base">Bukti Berhasil Diunggah!</h4>
        <p className="text-xs text-emerald-700">
          Status tagihan kini berubah menjadi <strong>Menunggu Verifikasi</strong>. Pengelola kos akan segera memeriksa dan memperbarui kuitansi pembayaran Anda.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Metode Pembayaran</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod('transfer_manual')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${
              method === 'transfer_manual'
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Transfer Bank
          </button>
          <button
            type="button"
            onClick={() => setMethod('qris_statis')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${
              method === 'qris_statis'
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Scan QRIS
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Tautan Bukti Transfer / Resi
        </label>
        <input
          type="text"
          value={proofUrl}
          onChange={(e) => setProofUrl(e.target.value)}
          placeholder="https://... atau /uploads/bukti.jpg"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Unggah foto struk ATM / tangkapan layar m-Banking (maksimal 5MB, format JPG/PNG/PDF).
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition disabled:opacity-50"
      >
        {isSubmitting ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
      </button>
    </form>
  );
}
