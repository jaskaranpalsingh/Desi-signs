'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Factory } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const BENEFITS = [
  {
    title: 'Permit Help',
    description: 'Help with Edmonton sign permit requirements.',
  },
  {
    title: 'Built for Alberta Weather',
    description: 'Signs designed for local weather conditions.',
  },
  {
    title: 'Professional Installation',
    description: 'Installation handled by an experienced team.',
  },
] as const;

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.28 });
  const reduceMotion = useReducedMotion();

  const show = inView || Boolean(reduceMotion);
  const easeOut = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-neutral-100 bg-white py-20 lg:py-28"
      aria-labelledby="about-desi-signs-heading"
    >
      {/* Subtle brand accents — kept light to match the reference without clutter */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 right-0 h-48 w-48 bg-[#DC1421]/[0.05] [clip-path:polygon(40%_0,100%_0,100%_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-0 h-40 w-40 bg-[#DC1421]/[0.04] [clip-path:polygon(0_30%,0_100%,70%_100%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — layered imagery */}
          <div className="relative mx-auto mb-6 w-full max-w-lg pb-8 sm:mb-4 sm:pb-6 lg:col-span-6 lg:mx-0 lg:mb-0 lg:max-w-none lg:pb-10">
            <div className="relative mx-auto aspect-[4/5] w-[88%] max-w-md sm:w-[78%] lg:ml-0 lg:max-w-none lg:w-[78%]">
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-[20px] bg-[#F8F9FA] shadow-[0_18px_40px_rgba(23,25,29,0.12)]"
                initial={reduceMotion ? false : { opacity: 0, x: -28 }}
                animate={show ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.7, ease: easeOut }}
              >
                <div className="group relative h-full w-full overflow-hidden rounded-[20px]">
                  <Image
                    src="/d98870d3-1cb1-4e0a-a9e5-8da48131250f.jpg"
                    alt="Desi Signs commercial storefront channel letter installation in Edmonton"
                    fill
                    sizes="(max-width: 1024px) 80vw, 38vw"
                    className="object-cover transition-[transform,box-shadow] duration-[350ms] ease-out group-hover:scale-[1.02]"
                    priority={false}
                  />
                </div>
              </motion.div>

              {/* Red feature card */}
              <motion.div
                className="absolute -right-2 top-6 z-20 flex max-w-[min(100%,11.5rem)] items-center gap-2.5 rounded-[14px] bg-[#DC1421] px-3.5 py-3 text-white shadow-[0_14px_30px_rgba(220,20,33,0.28)] sm:-right-3 sm:top-8 sm:max-w-[13rem] sm:gap-3 sm:px-4 sm:py-3.5"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={show ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.35, ease: easeOut }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 sm:h-9 sm:w-9">
                  <Check className="h-4 w-4 stroke-[2.5]" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-bold tracking-wide uppercase sm:text-[15px]">
                    Local Shop
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-white/90 sm:text-xs">
                    Edmonton fabrication
                  </span>
                </span>
              </motion.div>

              {/* White feature card */}
              <motion.div
                className="absolute -bottom-3 -left-2 z-20 flex max-w-[min(100%,12.5rem)] items-center gap-2.5 rounded-[14px] border border-black/5 bg-white px-3.5 py-3 shadow-[0_14px_34px_rgba(23,25,29,0.12)] sm:-bottom-4 sm:-left-3 sm:max-w-[14rem] sm:gap-3 sm:px-4 sm:py-3.5"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={show ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.48, ease: easeOut }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DC1421]/10 text-[#DC1421] sm:h-9 sm:w-9">
                  <Factory className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#17191D] sm:text-[15px]">
                    Full Service
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-[#596579] sm:text-xs">
                    Design to installation
                  </span>
                </span>
              </motion.div>
            </div>

            {/* Secondary overlapping image */}
            <motion.div
              className="absolute right-0 bottom-8 z-10 w-[42%] overflow-hidden rounded-[18px] bg-[#F8F9FA] shadow-[0_16px_36px_rgba(23,25,29,0.14)] sm:bottom-10 sm:w-[40%] lg:bottom-12"
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.15, ease: easeOut }}
            >
              <div className="group relative aspect-[3/4] overflow-hidden rounded-[18px]">
                <Image
                  src="/9e85633c-bfd7-4011-85a1-866453712a7b.jpg"
                  alt="Custom backlit sign fabricated by Desi Signs"
                  fill
                  sizes="(max-width: 1024px) 40vw, 18vw"
                  className="object-cover transition-[transform] duration-[350ms] ease-out group-hover:scale-[1.02]"
                />
              </div>
            </motion.div>
          </div>

          {/* Right — copy */}
          <div className="lg:col-span-6">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              <div className="mb-4 flex items-center gap-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#596579] uppercase sm:text-xs">
                  About Desi Signs
                </p>
                <span aria-hidden className="h-px w-8 bg-[#DC1421] sm:w-10" />
              </div>

              <h2
                id="about-desi-signs-heading"
                className="max-w-xl text-[clamp(1.85rem,4.2vw,3.15rem)] font-bold leading-[1.12] tracking-tight text-[#17191D]"
              >
                We build signs that make your business{' '}
                <span className="text-[#DC1421]">stand out.</span>
              </h2>

              <div className="mt-5 max-w-xl space-y-3 text-[15px] leading-relaxed text-[#596579] sm:text-base">
                <p>Desi Signs designs, builds, and installs commercial signs in Edmonton.</p>
                <p>
                  We help businesses with permits, fabrication, lighting, and installation, so your
                  sign is done right from start to finish.
                </p>
              </div>
            </motion.div>

            <ul className="mt-7 space-y-3.5 sm:mt-8">
              {BENEFITS.map((item, index) => (
                <motion.li
                  key={item.title}
                  className="flex items-start gap-3"
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={show ? { opacity: 1, y: 0 } : undefined}
                  transition={{
                    duration: 0.45,
                    delay: reduceMotion ? 0 : 0.2 + index * 0.1,
                    ease: easeOut,
                  }}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DC1421] text-white">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#17191D] sm:text-[15px]">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-[#596579]">
                      {item.description}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-8 sm:mt-9"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.55, ease: easeOut }}
            >
              <Link
                href="/about"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-[13px] bg-[#DC1421] px-6 py-3.5 text-sm font-semibold text-white transition-[background-color] duration-250 hover:bg-[#B80F1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1421] sm:w-auto"
              >
                Learn More About Us
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-250 ease-out group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
