'use client';

import React, { useId, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from 'lucide-react';
import { AdaptiveLogo } from '@/components/brand/AdaptiveLogo';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-admin-login',
});

function CornerWaves() {
  return (
    <>
      {/* Top-left soft ivory waves + gold accent */}
      <svg
        className="pointer-events-none absolute top-0 left-0 z-0 h-[min(52vw,420px)] w-[min(68vw,560px)] -translate-x-[8%] -translate-y-[12%] opacity-90 sm:opacity-100"
        viewBox="0 0 560 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M-40 260C40 210 110 120 170 70C240 10 310 -20 420 -40L460 80C360 95 290 130 230 190C170 250 100 320 -20 360L-40 260Z"
          fill="#F3F1EC"
        />
        <path
          d="M-50 200C30 155 95 85 150 45C220 -5 285 -30 390 -45L420 55C330 70 270 100 220 150C165 205 95 265 -30 295L-50 200Z"
          fill="#F7F5F1"
        />
        <path
          d="M-40 150C25 110 80 55 125 25C185 -15 245 -35 340 -48L365 30C285 45 235 70 190 110C145 150 85 200 -20 225L-40 150Z"
          fill="#FFFFFF"
        />
        <path
          d="M-20 175C45 130 100 75 145 40C200 0 255 -20 345 -32"
          stroke="#C5A46A"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>

      {/* Bottom-right matching waves + gold accent */}
      <svg
        className="pointer-events-none absolute right-0 bottom-0 z-0 h-[min(52vw,420px)] w-[min(68vw,560px)] translate-x-[10%] translate-y-[14%] opacity-90 sm:opacity-100"
        viewBox="0 0 560 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M600 160C520 210 450 300 390 350C320 410 250 440 140 460L100 340C200 325 270 290 330 230C390 170 460 100 580 60L600 160Z"
          fill="#F3F1EC"
        />
        <path
          d="M610 220C530 265 465 335 410 375C340 425 275 450 170 465L140 365C230 350 290 320 340 270C395 215 465 155 590 125L610 220Z"
          fill="#F7F5F1"
        />
        <path
          d="M600 270C535 310 480 365 435 395C375 435 315 455 220 468L195 390C275 375 325 350 370 310C415 270 475 220 580 195L600 270Z"
          fill="#FFFFFF"
        />
        <path
          d="M580 245C515 290 460 345 415 380C360 420 305 440 215 452"
          stroke="#C5A46A"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data: { success?: boolean; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError(
          res.status === 500
            ? 'Admin API is offline. In a separate terminal run: npm run dev:backend'
            : 'Unable to read the server response. Please try again.',
        );
        return;
      }

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(
          data.message ||
            (res.status >= 500
              ? 'Admin API is offline. In a separate terminal run: npm run dev:backend'
              : 'Sign in failed. Check your email and password.'),
        );
      }
    } catch {
      setError('Unable to connect. Make sure the backend is running (npm run dev:backend).');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'h-[54px] w-full rounded-[13px] border border-[#D5DBE5] bg-white py-3 pr-3.5 pl-11 text-[15px] text-[#4B5563] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#98A2B3] focus:border-[#D5001C] focus:ring-[3px] focus:ring-[#D5001C]/15';

  return (
    <div
      className={`${inter.variable} relative flex min-h-[100dvh] items-center justify-center overflow-x-hidden overflow-y-auto bg-[#FAFAFC] px-4 py-8 sm:px-6 sm:py-10`}
      style={{ fontFamily: 'var(--font-admin-login), Inter, system-ui, sans-serif' }}
    >
      <CornerWaves />

      <main className="relative z-10 w-full max-w-[650px]">
        <div
          className="w-full rounded-[32px] border border-[#E8EAF0] bg-white px-6 py-8 sm:px-10 sm:py-12 md:px-[62px] md:py-[60px]"
          style={{ boxShadow: '0 18px 55px rgba(16, 24, 40, 0.10)' }}
        >
          <div className="mb-8 flex justify-center sm:mb-10">
            <AdaptiveLogo
              background="light"
              size="xl"
              href={false}
              priority
              interactive={false}
              className="inline-block"
              imgClassName="!max-w-[220px] sm:!max-w-[260px] md:!max-w-[300px] object-center"
            />
          </div>

          <div className="mb-8 text-center sm:mb-10">
            <h1 className="text-[clamp(1.75rem,4vw,2.625rem)] font-bold tracking-[-0.02em] text-[#111827]">
              Admin Sign In
            </h1>
            <p className="mt-2.5 text-[15px] leading-relaxed text-[#758095] sm:mt-[10px] sm:text-[17px]">
              Enter your staff credentials to continue.
            </p>
          </div>

          {error && (
            <div
              id={errorId}
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-[13px] border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
            aria-describedby={error ? errorId : undefined}
          >
            <div>
              <label
                htmlFor={emailId}
                className="mb-2 block text-[14px] font-semibold text-[#111827]"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-[#98A2B3]"
                  aria-hidden="true"
                />
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="admin@desisigns.ca"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={passwordId}
                className="mb-2 block text-[14px] font-semibold text-[#111827]"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-[#98A2B3]"
                  aria-hidden="true"
                />
                <input
                  id={passwordId}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-[#667085] transition-colors hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5001C]/35"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="mt-1 flex h-[58px] w-full cursor-pointer items-center justify-center gap-2 rounded-[13px] bg-[#D5001C] text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#B90018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5001C]/40 focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#D5001C]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center">
            <Link
              href="/"
              className="text-[14px] font-medium text-[#4B5563] transition-colors duration-200 hover:text-[#D5001C]"
            >
              ← Back to website
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
