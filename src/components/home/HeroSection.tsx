'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Building, ShieldCheck, Snowflake, HardHat } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useCinematicHeroMotion } from './useCinematicHeroMotion';

const trustItems = [
  {
    icon: Building,
    line1: 'Full City of Edmonton',
    line2: 'Bylaw Permitting',
  },
  {
    icon: ShieldCheck,
    line1: 'UL / CSA Certified',
    line2: 'Electrical Modules',
  },
  {
    icon: Snowflake,
    line1: 'Built for',
    line2: 'Alberta Weather',
  },
  {
    icon: HardHat,
    line1: 'Design, Fabrication',
    line2: '& Professional Installation',
  },
];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const ribbonRef = useRef<SVGPathElement>(null);
  const ribbonSoftRef = useRef<SVGPathElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaInnerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line2AccentRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const quoteBtnRef = useRef<HTMLAnchorElement>(null);
  const portfolioBtnRef = useRef<HTMLAnchorElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const trustItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useCinematicHeroMotion(
    {
      section: sectionRef,
      ribbon: ribbonRef,
      ribbonSoft: ribbonSoftRef,
      media: mediaRef,
      mediaInner: mediaInnerRef,
      divider: dividerRef,
      eyebrow: eyebrowRef,
      line1: line1Ref,
      line2: line2Ref,
      line2Accent: line2AccentRef,
      description: descriptionRef,
      quoteBtn: quoteBtnRef,
      portfolioBtn: portfolioBtnRef,
      trustItems: trustItemRefs,
      ambient: ambientRef,
    },
    { reduceMotion },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full flex-col overflow-hidden border-b border-neutral-200 bg-white lg:min-h-[calc(100svh-76px)]"
    >
      {/* Ambient glow near diagonal */}
      <div
        ref={ambientRef}
        aria-hidden
        className="pointer-events-none absolute top-[16%] right-[40%] z-[4] hidden h-48 w-48 rounded-full bg-[#DC1421]/[0.07] blur-3xl lg:block"
        style={reduceMotion ? { opacity: 1 } : undefined}
      />

      {/* Fluid ribbon — entrance only; clipped so it never sits on the storefront */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[6] hidden w-[58%] overflow-hidden lg:block"
        style={{
          maskImage: 'linear-gradient(to right, black 72%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 72%, transparent 100%)',
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 900"
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
        >
          <defs>
            <linearGradient id="desiRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC1421" />
              <stop offset="55%" stopColor="#DC1421" />
              <stop offset="100%" stopColor="#A80F1A" />
            </linearGradient>
          </defs>
          <path
            ref={ribbonSoftRef}
            fill="#DC1421"
            fillOpacity="0.28"
            opacity="0"
            d="M900,-60 C970,0 1040,70 1080,160 C1125,270 1095,380 1020,470 C950,550 870,590 800,610 C750,620 720,580 720,510 C720,420 800,320 870,220 C920,150 930,20 900,-60 Z"
          />
          <path
            ref={ribbonRef}
            fill="url(#desiRibbonGrad)"
            opacity="0"
            d="M920,-40 C980,20 1040,80 1080,160 C1120,250 1100,340 1040,430 C980,520 900,580 820,620 C760,650 700,640 680,560 C660,470 740,360 820,260 C880,180 900,60 920,-40 Z"
          />
        </svg>
      </div>

      {/* Mobile simplified ribbon accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 z-[3] h-28 w-28 bg-[#DC1421]/10 [clip-path:ellipse(80%_70%_at_100%_0%)] lg:hidden"
      />

      {/* ── Main Two-Column Hero ────────────────────────────────────────── */}
      <div className="relative flex min-h-[560px] w-full flex-1 flex-col items-stretch lg:min-h-0 lg:flex-row">
        {/* Left Content Area */}
        <div className="z-10 flex w-full flex-col justify-center bg-white px-6 py-14 sm:px-10 sm:py-16 md:px-14 lg:w-[54%] lg:py-0 lg:pr-12 lg:pl-16 xl:pl-20">
          <div className="max-w-[640px]">
            <div
              ref={eyebrowRef}
              className="mb-6 flex items-center gap-3 sm:mb-7"
              style={reduceMotion ? undefined : { opacity: 0 }}
            >
              <span className="inline-block h-5 w-1.5 flex-shrink-0 rounded-none bg-brand" />
              <span className="text-xs font-semibold tracking-[0.16em] text-neutral-800 uppercase sm:text-[13px]">
                EDMONTON&apos;S ARCHITECTURAL SIGNAGE FABRICATOR
              </span>
            </div>

            <h1 className="text-[2.15rem] leading-[1.08] font-extrabold tracking-tight text-neutral-950 sm:text-5xl sm:leading-[1.08] md:text-6xl lg:text-[clamp(3.15rem,4.2vw,3.85rem)] lg:leading-[1.05]">
              <span
                ref={line1Ref}
                className="block"
                style={reduceMotion ? undefined : { opacity: 0 }}
              >
                Desi Naam,
              </span>
              <span className="relative block">
                <span
                  ref={line2Ref}
                  className="text-brand"
                  style={reduceMotion ? undefined : { opacity: 0 }}
                >
                  Professional Kaam.
                </span>
                <span
                  ref={line2AccentRef}
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[3px] w-[72%] origin-left rounded-full bg-[#DC1421]/45"
                  style={
                    reduceMotion
                      ? { transform: 'scaleX(1)' }
                      : { transform: 'scaleX(0)' }
                  }
                />
              </span>
            </h1>

            <p
              ref={descriptionRef}
              className="mt-6 max-w-[540px] text-[15.5px] leading-relaxed font-normal text-neutral-600 sm:mt-7 sm:text-[17px] sm:leading-[1.65]"
              style={reduceMotion ? undefined : { opacity: 0 }}
            >
              We design, make, and install high-quality business signs, including light-up signs,
              storefront signs, and outdoor signs. From design to installation, we provide complete
              signage solutions across Edmonton and Northern Alberta.
            </p>

            <div className="mt-9 flex flex-col items-stretch gap-3.5 sm:mt-10 sm:flex-row sm:items-center">
              <Link
                ref={quoteBtnRef}
                href="/quote"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-brand px-7 py-4 text-[14.5px] font-semibold text-white shadow-xs will-change-transform transition-[background-color,box-shadow] duration-250 hover:bg-brand-hover hover:shadow-[0_10px_24px_rgba(220,20,33,0.28)] active:translate-y-px sm:w-auto"
                style={reduceMotion ? undefined : { opacity: 0 }}
              >
                <span>Request a Free Quote</span>
                <ArrowRight className="h-4 w-4 text-white transition-transform duration-250 group-hover:translate-x-1" />
              </Link>

              <Link
                ref={portfolioBtnRef}
                href="/projects"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand bg-white px-7 py-4 text-[14.5px] font-semibold text-brand will-change-transform transition-[background-color] duration-250 hover:bg-[#FFF0F1] sm:w-auto"
                style={reduceMotion ? undefined : { opacity: 0 }}
              >
                Explore Our Portfolio
                <ArrowRight className="h-4 w-4 opacity-0 transition-[opacity,transform] duration-250 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right media with diagonal cut */}
        <div
          ref={mediaRef}
          className="relative min-h-[400px] w-full overflow-hidden bg-neutral-900 sm:min-h-[480px] lg:min-h-0 lg:w-[46%] lg:flex-1"
          style={
            reduceMotion
              ? undefined
              : { clipPath: 'inset(0 0 0 100%)' }
          }
        >
          <div ref={mediaInnerRef} className="absolute inset-0 h-full w-full will-change-transform">
            {/* Keep existing media — poster image + optional video sources already in project */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-storefront.jpg"
              alt="Desi Signs commercial storefront in Edmonton"
              className="h-full w-full object-cover object-center"
              fetchPriority="high"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 -left-1 z-10 hidden w-28 lg:block"
            style={{
              background: 'linear-gradient(108deg, #ffffff 50%, transparent 50.5%)',
            }}
          />

          <div
            ref={dividerRef}
            className="pointer-events-none absolute top-0 -left-7 bottom-0 z-10 hidden w-[18px] bg-brand lg:block"
            style={{
              transform: 'skewX(-18deg)',
              clipPath: reduceMotion ? undefined : 'inset(0 0 100% 0)',
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-neutral-950/10" />
        </div>
      </div>

      {/* ── Bottom trust bar ───────────────────────────────────────────── */}
      <div className="relative z-10 w-full shrink-0 border-t border-neutral-200 bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 divide-y divide-neutral-200 sm:divide-y-0 md:grid-cols-4 md:gap-4 md:divide-x">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.line1}
                ref={(el) => {
                  trustItemRefs.current[index] = el;
                }}
                className="group flex items-center gap-3.5 pt-3 sm:px-4 sm:pt-0"
                style={reduceMotion ? undefined : { opacity: 0 }}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-neutral-900 transition-[color,transform] duration-250 group-hover:-translate-y-0.5 group-hover:text-brand">
                  <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden />
                </div>
                <div className="relative text-[13px] leading-tight font-bold text-neutral-900 sm:text-sm">
                  {item.line1}
                  <br />
                  <span className="font-semibold text-neutral-700">{item.line2}</span>
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-[2px] w-0 bg-brand transition-[width] duration-250 group-hover:w-10"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
