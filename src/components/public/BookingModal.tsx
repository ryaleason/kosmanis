'use client';

import { useState } from 'react';
import { submitBookingAction } from '@/server/actions/public';

interface BookingModalProps {
  propertyId: string;
  roomId?: string;
  roomNumber?: string;
  roomTypeName?: string;
}

export function BookingModal({
  propertyId,
  roomId,
  roomNumber,
  roomTypeName,
}: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const plannedStartDate = formData.get('plannedStartDate') as string;
    const durationMonths = Number(formData.get('durationMonths') || 1);
    const notes = formData.get('notes') as string;

    try {
      await submitBookingAction({
        propertyId,
        roomId,
        name,
        phoneNumber,
        plannedStartDate,
        durationMonths,
        notes,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal mengirim permohonan booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition"
      >
        Ajukan Booking Kamar Ini
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSuccess(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              ✕
            </button>

            {isSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-slate-900">Permohonan Booking Terkirim!</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Admin Kos Manis akan segera menghubungi nomor WhatsApp Anda untuk konfirmasi jadwal dan pembayaran DP hold kamar.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsSuccess(false);
                  }}
                  className="mt-6 px-6 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-slate-900">Form Pengajuan Booking</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {roomNumber ? `Kamar ${roomNumber} (${roomTypeName})` : 'Pilih Kamar'}
                </p>

                {errorMsg && (
                  <div className="mt-3 p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap Calon Penghuni
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Contoh: Dika Pratama"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      placeholder="081234567890"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Rencana Masuk
                      </label>
                      <input
                        type="date"
                        name="plannedStartDate"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Durasi Sewa
                      </label>
                      <select
                        name="durationMonths"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="1">1 Bulan</option>
                        <option value="3">3 Bulan</option>
                        <option value="6">6 Bulan</option>
                        <option value="12">1 Tahun</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catatan Tambahan (Opsional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      placeholder="Bawa motor, rencana bawa kulkas mini, dll."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan Booking'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
