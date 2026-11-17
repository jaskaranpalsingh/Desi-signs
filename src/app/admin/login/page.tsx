'use client';

import React, { useId, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Syne, DM_Sans } from 'next/font/google';
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AdaptiveLogo } from '@/components/brand/AdaptiveLogo';

const display = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-admin-display',
});

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-admin-body',
});

export default function AdminLoginPage() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
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
      const data = await res.json();

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Sign in failed. Check your email and password.');
      }
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-x-hidden bg-[#F8F9FC]`}
      style={{ fontFamily: 'var(--font-admin-body), system-ui, sans-serif' }}
    >
      <div className="relative grid min-h-screen lg:grid-cols-[42%_58%]">
        {/* ── Left branding panel (no clip-path — keeps logo visible) ── */}
        <aside className="relative z-10 hidden flex-col justify-between overflow-hidden bg-[#0B0B0D] px-12 py-12 text-white xl:px-16 xl:py-14 lg:flex">
          {/* Red corner glows */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 70% 55% at 8% 12%, rgba(220,20,33,0.34), transparent 58%), radial-gradient(ellipse 65% 50% at 10% 92%, rgba(220,20,33,0.16), transparent 55%)',
            }}
            aria-hidden="true"
          />

          {/* Architectural grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.95) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.95) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
            aria-hidden="true"
          />

          {/* Diagonal black extension into the right panel */}
          <div
            className="pointer-events-none absolute top-0 -right-16 bottom-0 z-0 w-32 bg-[#0B0B0D]"
            style={{ transform: 'skewX(-8deg)' }}
            aria-hidden="true"
          />

          {/* Slim red accent along the diagonal */}
          <div
            className="pointer-events-none absolute top-0 -right-1 bottom-0 z-20 w-[3px] bg-[#DC1421]"
            style={{ transform: 'skewX(-8deg)' }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            <AdaptiveLogo
              background="dark"
              size="xl"
              priority
              className="inline-block"
              imgClassName="!max-w-[240px]"
            />
          </div>

          <div className="relative z-10 max-w-[420px] space-y-7 pr-8">
            <div className="flex items-center gap-2.5">
              <span className="h-3.5 w-[3px] shrink-0 rounded-[1px] bg-[#DC1421]" aria-hidden="true" />
              <p className="text-[11px] font-semibold tracking-[0.22em] text-white/90 uppercase">
                Edmonton · Admin Portal
              </p>
            </div>

            <h1
              className="text-[clamp(2.6rem,3.8vw,3.75rem)] leading-[1.04] font-extrabold tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-admin-display), sans-serif' }}
            >
              <span className="block text-white">Desi Naam,</span>
              <span className="block text-[#DC1421]">Professional Kaam.</span>
            </h1>

            <p className="max-w-[340px] text-[15px] leading-relaxed text-white/60">
              Manage quotes, projects, blogs, and website content in one place.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2.5 text-[13px] text-white/50">
            <ShieldCheck className="h-4 w-4 text-[#DC1421]" aria-hidden="true" />
            <span>Secure Admin Access · Authorized Staff Only</span>
          </div>
        </aside>

        {/* ── Right login panel ─────────────────────────────────────────── */}
        <main className="relative z-0 flex min-h-screen flex-col justify-center px-5 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-[440px]">
            {/* Mobile branding header */}
            <div className="mb-10 space-y-4 lg:hidden">
              <div className="inline-flex items-center rounded-2xl bg-[#0B0B0D] px-4 py-3">
                <AdaptiveLogo background="dark" size="md" />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-3.5 w-[3px] shrink-0 bg-[#DC1421]" aria-hidden="true" />
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#111827] uppercase">
                  Edmonton · Admin Portal
                </p>
              </div>
            </div>

            <div className="mb-8 space-y-2">
              <h2
                className="text-[2rem] font-bold tracking-tight text-[#111827] sm:text-[2.15rem]"
                style={{ fontFamily: 'var(--font-admin-display), sans-serif' }}
              >
                Sign in
              </h2>
              <p className="text-[15px] leading-relaxed text-[#667085]">
                Access your DESI SIGNS admin dashboard.
              </p>
            </div>

            <div
              className="rounded-[22px] border border-[#E8EAF0] bg-white p-6 sm:p-8"
              style={{ boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)' }}
            >
              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-[#FFF5F5] px-3.5 py-3 text-[13px] text-red-700"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor={emailId}
                    className="mb-1.5 block text-[13px] font-semibold text-[#111827]"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#98A2B3]"
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
                      className="w-full rounded-xl border border-[#D0D5DD] bg-[#F8F9FC] py-3 pr-3.5 pl-10 text-[14px] text-[#111827] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#98A2B3] focus:border-[#DC1421] focus:bg-white focus:ring-[3px] focus:ring-[#DC1421]/18"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={passwordId}
                    className="mb-1.5 block text-[13px] font-semibold text-[#111827]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#98A2B3]"
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
                      className="w-full rounded-xl border border-[#D0D5DD] bg-[#F8F9FC] py-3 pr-11 pl-10 text-[14px] text-[#111827] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#98A2B3] focus:border-[#DC1421] focus:bg-white focus:ring-[3px] focus:ring-[#DC1421]/18"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-md p-1 text-[#667085] transition-colors hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC1421]/40"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim() || !password}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#DC1421] px-4 py-3.5 text-[14px] font-bold text-white transition-colors duration-200 hover:bg-[#B9101A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC1421]/45 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#DC1421]/75"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-[13px] font-medium text-[#667085] transition-colors duration-200 hover:text-[#DC1421]"
              >
                ← Back to Website
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
