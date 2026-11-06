'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react';
import { loginWithPasswordAction } from '@/server/actions/auth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await loginWithPasswordAction({
        email,
        password,
        redirectTo,
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Gagal login. Periksa email dan kata sandi Anda.');
        return;
      }

      const destination = res.redirectTo || '/admin/dashboard';
      router.push(destination);
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Terjadi kendala jaringan saat menghubungi server.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-[440px] bg-white border border-[#E5E7EB] rounded-[12px] p-6 sm:p-8 space-y-6">
      {/* Brand & Heading */}
      <div className="flex flex-col items-center text-center">
        <div className="w-11 h-11 rounded-[12px] bg-[#1CA3D4] flex items-center justify-center text-white mb-3">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">Masuk ke Kosmanis</h1>
        <p className="text-[14px] text-[#6B7280] mt-1">
          Akses akun pemilik, admin pengelola, atau portal penghuni.
        </p>
      </div>

      {/* Alert Error */}
      {errorMsg && (
        <div className="p-3.5 bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-[13px] rounded-[12px] leading-relaxed">
          {errorMsg}
        </div>
      )}

      {/* Form Login Email & Kata Sandi */}
      <form onSubmit={handlePasswordLogin} className="space-y-4">
        <div>
          <label className="block text-[14px] font-semibold text-[#1F2937] mb-1.5">
            Alamat Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="w-full h-11 px-4 border border-[#E5E7EB] rounded-[12px] bg-white text-[14px] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1CA3D4] transition"
            required
          />
        </div>

        <div>
          <label className="block text-[14px] font-semibold text-[#1F2937] mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 pl-4 pr-11 border border-[#E5E7EB] rounded-[12px] bg-white text-[14px] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1CA3D4] transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0F172A] p-1 transition"
              title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-full bg-[#1CA3D4] hover:bg-[#1693C9] text-white font-semibold text-[14px] transition disabled:opacity-50 inline-flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? 'Memverifikasi...' : 'Masuk ke Akun'}
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* Info Kredensial Akun (Email & Password) */}
      <div className="bg-[#F3F9FD] border border-[#E5E7EB] rounded-[12px] p-4 text-[13px] text-[#4B5563] space-y-3">
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
          <KeyRound className="w-4 h-4 text-[#1CA3D4] shrink-0" />
          <span className="font-semibold text-[#0F172A]">Informasi Akun Demo</span>
        </div>

        {/* Akun Admin */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-[#0F172A]">Admin Pengelola</p>
            <p className="text-[12px] text-[#6B7280]">
              admin@kosmanis.com · <span className="font-mono text-[#0F172A]">admin123</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleFillDemo('admin@kosmanis.com', 'admin123')}
            className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white border border-[#1CA3D4] text-[#1CA3D4] hover:bg-[#1CA3D4] hover:text-white transition"
          >
            Isi
          </button>
        </div>

        {/* Akun Pemilik */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-[#0F172A]">Pemilik Kos</p>
            <p className="text-[12px] text-[#6B7280]">
              pemilik@kosmanis.com · <span className="font-mono text-[#0F172A]">pemilik123</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleFillDemo('pemilik@kosmanis.com', 'pemilik123')}
            className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white border border-[#1CA3D4] text-[#1CA3D4] hover:bg-[#1CA3D4] hover:text-white transition"
          >
            Isi
          </button>
        </div>

        {/* Akun Penghuni */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-[#0F172A]">Penghuni Kos</p>
            <p className="text-[12px] text-[#6B7280]">
              penghuni@kosmanis.com · <span className="font-mono text-[#0F172A]">penghuni123</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleFillDemo('penghuni@kosmanis.com', 'penghuni123')}
            className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white border border-[#1CA3D4] text-[#1CA3D4] hover:bg-[#1CA3D4] hover:text-white transition"
          >
            Isi
          </button>
        </div>
      </div>

      {/* Link Balik ke Beranda */}
      <div className="text-center pt-2 border-t border-[#E5E7EB]">
        <Link
          href="/"
          className="text-[14px] text-[#6B7280] hover:text-[#0F172A] font-medium transition inline-flex items-center gap-1"
        >
          ← Kembali ke Beranda Kos
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-[family-name:var(--font-montserrat)]">
      <Suspense
        fallback={
          <div className="w-full max-w-[440px] bg-white border border-[#E5E7EB] rounded-[12px] p-8 text-center text-[14px] text-[#6B7280]">
            Memuat formulir login...
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
