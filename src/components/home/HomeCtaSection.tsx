'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Phone,
  Mail,
  Handshake,
  PencilRuler,
  HardHat,
} from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { initialSettings } from '@/lib/data/initial-data';

const easeOut = [0.22, 1, 0.36, 1] as const;

const features = [
  { title: 'Expert Guidance', icon: Handshake },
  { title: 'Custom Design', icon: PencilRuler },
  { title: 'Professional Installation', icon: HardHat },
];

const phoneHref = `tel:${initialSettings.phone.replace(/[^\d+]/g, '')}`;
const emailHref = `mailto:${initialSettings.email}`;

export function HomeCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const show = inView || Boolean(reduceMotion);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="home-cta-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-[#F0F1F3] bg-white shadow-[0_18px_50px_rgba(17,25,39,0.08)]"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.65, ease: easeOut }}
        >
          {/* Top-right decorative curves */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg
              className="absolute -top-6 -right-10 h-[220px] w-[280px] opacity-90 sm:h-[260px] sm:w-[340px] lg:-right-6"
              viewBox="0 0 340 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M80 0C140 20 210 10 340 40V0H80Z"
                fill="#FFF0F1"
              />
              <path
                d="M160 0C220 35 280 25 340 70V0H160Z"
                fill="#DC1421"
                fillOpacity="0.9"
              />
              <path
                d="M240 0C280 20 310 18 340 45V0H240Z"
                fill="#B80F1D"
                fillOpacity="0.55"
              />
            </svg>
          </div>

          {/* Bottom wave */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[72px] overflow-hidden sm:h-[88px] lg:h-[100px]"
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            animate={show ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.28, ease: easeOut }}
          >
            <svg
              className="absolute bottom-0 left-0 h-full w-[120%] min-w-[720px]"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 78C180 118 320 28 520 58C720 88 860 128 1080 72C1240 32 1360 48 1440 68V120H0V78Z"
                fill="#B80F1D"
                fillOpacity="0.35"
              />
              <path
                d="M0 88C200 120 360 40 560 66C760 92 900 118 1100 78C1260 48 1360 58 1440 74V120H0V88Z"
                fill="#DC1421"
              />
            </svg>
          </motion.div>

          <div className="relative z-10 grid grid-cols-1 gap-10 px-6 pt-8 pb-16 sm:gap-12 sm:px-10 sm:pt-10 sm:pb-20 lg:grid-cols-12 lg:gap-8 lg:px-14 lg:pt-12 lg:pb-24 xl:px-16">
            {/* Left column */}
            <div className="lg:col-span-7 xl:col-span-8">
              <motion.div
                className="mb-4 flex items-center gap-3"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={show ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.08, ease: easeOut }}
              >
                <span aria-hidden className="h-px w-7 bg-[#DC1421]" />
                <p className="text-[11px] font-bold tracking-[0.18em] text-[#DC1421] uppercase">
                  Start Your Signage Project
                </p>
              </motion.div>

              <h2
                id="home-cta-heading"
                className="max-w-[18ch] text-[clamp(1.85rem,3.6vw,3.4rem)] font-bold leading-[1.12] tracking-tight text-[#17191D]"
              >
                <motion.span
                  className="inline"
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={show ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.12, ease: easeOut }}
                >
                  Let&apos;s build a sign that{' '}
                </motion.span>
                <motion.span
                  className="text-[#DC1421]"
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={show ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.24, ease: easeOut }}
                >
                  makes your business stand out.
                </motion.span>
              </h2>

              <motion.p
                className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#596579] sm:text-base"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={show ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.3, ease: easeOut }}
              >
                Tell us about your signage project. Our team can help with the design, planning, and
                installation.
              </motion.p>

              <motion.div
                className="mt-7 flex flex-col gap-5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={show ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.36, ease: easeOut }}
              >
                <Link
                  href="/quote"
                  className="group inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#DC1421] px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(220,20,33,0.28)] transition-[background-color,transform,box-shadow] duration-250 hover:-translate-y-0.5 hover:bg-[#B80F1D] hover:shadow-[0_14px_28px_rgba(184,15,29,0.32)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1421]"
                >
                  Get a Free Quote
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 sm:divide-x sm:divide-[#E5E7EB]">
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-2 px-0 text-sm font-semibold text-[#17191D] transition-colors hover:text-[#DC1421] hover:underline sm:px-4 first:sm:pl-0"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-[#DC1421]" aria-hidden />
                    {initialSettings.phone}
                  </a>
                  <a
                    href={emailHref}
                    className="inline-flex items-center gap-2 px-0 text-sm font-semibold text-[#17191D] transition-colors hover:text-[#DC1421] hover:underline sm:px-4"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-[#DC1421]" aria-hidden />
                    {initialSettings.email}
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right column — features */}
            <div className="flex items-center lg:col-span-5 xl:col-span-4">
              <ul className="w-full overflow-hidden rounded-2xl border border-[#F0F1F3] bg-[#FCFCFD]">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.li
                      key={feature.title}
                      className={`group flex items-center gap-4 px-5 py-5 ${
                        index < features.length - 1 ? 'border-b border-[#EEEFF2]' : ''
                      }`}
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      animate={show ? { opacity: 1, y: 0 } : undefined}
                      transition={{
                        duration: 0.45,
                        delay: reduceMotion ? 0 : 0.38 + index * 0.1,
                        ease: easeOut,
                      }}
                    >
                      <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0F1] text-[#DC1421] transition-[background-color,transform] duration-250 group-hover:scale-105 group-hover:bg-[#FFE2E4]">
                        <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden />
                      </span>
                      <p className="text-[15px] font-bold tracking-tight text-[#17191D] transition-colors duration-250 group-hover:text-[#DC1421]">
                        {feature.title}
                      </p>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
