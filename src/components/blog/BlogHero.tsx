'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, PencilRuler, Layers, TrendingUp, type LucideIcon } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { BLOG_CATEGORIES } from '@/lib/blog-constants';

type BlogCategoryNavItem = {
  id: string;
  label: (typeof BLOG_CATEGORIES)[number];
  icon: LucideIcon;
};

const CATEGORY_NAV: BlogCategoryNavItem[] = [
  {
    id: 'permits',
    label: 'Permits & Regulations',
    icon: FileText,
  },
  {
    id: 'design',
    label: 'Sign Design Tips',
    icon: PencilRuler,
  },
  {
    id: 'materials',
    label: 'Materials & Durability',
    icon: Layers,
  },
  {
    id: 'business',
    label: 'Business & ROI',
    icon: TrendingUp,
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const copyContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const categoryContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.35 },
  },
};

const categoryItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

function EdmontonSkylineIllustration({
  className = '',
  animate,
}: {
  className?: string;
  animate: boolean;
}) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 520 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      initial={animate ? { opacity: 0, x: 24 } : false}
      animate={animate ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
    >
      {/* Soft sparkle accent */}
      <motion.g
        initial={animate ? { opacity: 0, scale: 0.7 } : false}
        animate={
          animate
            ? {
                opacity: [0.35, 0.7, 0.35],
                scale: [0.95, 1.05, 0.95],
              }
            : undefined
        }
        transition={
          animate
            ? { duration: 3.6, delay: 1.1, repeat: Infinity, ease: 'easeInOut' }
            : undefined
        }
        style={{ transformOrigin: '360px 70px' }}
      >
        <path
          d="M360 42 L366 62 L386 68 L366 74 L360 94 L354 74 L334 68 L354 62 Z"
          fill="#F7C4CB"
          opacity="0.85"
        />
      </motion.g>

      {/* Bridge */}
      <motion.g
        stroke="#9AA3B2"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { opacity: 0 } : false}
        animate={animate ? { opacity: 1 } : undefined}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <path d="M18 228 C70 148, 150 148, 202 228" />
        <path d="M28 228 C74 168, 146 168, 192 228" />
        <path d="M18 228 H202" />
        <path d="M50 228 V198" />
        <path d="M80 228 V178" />
        <path d="M110 228 V172" />
        <path d="M140 228 V178" />
        <path d="M170 228 V198" />
        <path d="M14 236 H210" />
      </motion.g>

      {/* Skyline buildings — rise in */}
      <motion.g
        stroke="#9AA3B2"
        strokeWidth="1.55"
        strokeLinejoin="round"
        fill="none"
        initial={animate ? { opacity: 0, y: 16 } : false}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.65, delay: 0.45, ease: easeOut }}
      >
        <path d="M210 236 V150 H248 V236" />
        <path d="M218 162 H240 M218 174 H240 M218 186 H240 M218 198 H240 M218 210 H240" />

        <path d="M252 236 V118 H292 V236" />
        <path d="M260 130 H284 M260 142 H284 M260 154 H284 M260 166 H284 M260 178 H284 M260 190 H284 M260 202 H284" />

        <path d="M296 236 V96 H348 V236" />
        <path d="M308 96 V84 H336 V96" />
        <path d="M304 110 H340 M304 122 H340 M304 134 H340 M304 146 H340 M304 158 H340 M304 170 H340 M304 182 H340 M304 194 H340 M304 206 H340" />

        <path d="M352 236 V138 H392 V236" />
        <path d="M360 150 H384 M360 162 H384 M360 174 H384 M360 186 H384 M360 198 H384 M360 210 H384" />

        <path d="M396 236 V110 H448 V236" />
        <path d="M408 110 V98 H436 V110" />
        <path d="M404 122 H440 M404 134 H440 M404 146 H440 M404 158 H440 M404 170 H440 M404 182 H440 M404 194 H440 M404 206 H440" />

        <path d="M452 236 V156 H498 V236" />
        <path d="M460 168 H490 M460 180 H490 M460 192 H490 M460 204 H490 M460 216 H490" />
      </motion.g>

      {/* Ground line */}
      <motion.path
        d="M12 236 H508"
        stroke="#C5CAD3"
        strokeWidth="1.2"
        initial={animate ? { pathLength: 0, opacity: 0 } : false}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 0.55, ease: easeOut }}
      />

      {/* Red swoosh — draw in */}
      <motion.path
        d="M24 268 C120 248, 210 292, 310 276 C390 264, 450 248, 508 254"
        stroke="#D40018"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        initial={animate ? { pathLength: 0, opacity: 0 } : false}
        animate={animate ? { pathLength: 1, opacity: 0.92 } : undefined}
        transition={{ duration: 1.05, delay: 0.7, ease: easeOut }}
      />
      <motion.path
        d="M40 278 C140 262, 220 298, 320 284 C400 274, 460 260, 500 266"
        stroke="#D40018"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={animate ? { pathLength: 0, opacity: 0 } : false}
        animate={animate ? { pathLength: 1, opacity: 0.35 } : undefined}
        transition={{ duration: 1.05, delay: 0.85, ease: easeOut }}
      />
    </motion.svg>
  );
}

function resolveCategoryHref(item: BlogCategoryNavItem): string {
  return `/blog?category=${encodeURIComponent(item.label)}#articles`;
}

export function BlogHero({ availableCategories = [] }: { availableCategories?: string[] }) {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <section className="relative overflow-hidden border-b border-[#E8EAED] bg-white">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F8F9FA] to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Breadcrumb */}
        <motion.nav
          aria-label="Breadcrumb"
          className="pt-8 sm:pt-10 lg:pt-12"
          initial={animate ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
        >
          <ol className="flex items-center gap-2 text-[13px]">
            <li>
              <Link
                href="/"
                className="text-[#596579] transition-colors duration-200 hover:text-[#111827]"
              >
                Home
              </Link>
            </li>
            <li className="text-[#9AA3B2]" aria-hidden="true">
              ›
            </li>
            <li>
              <span className="font-medium text-[#D40018]" aria-current="page">
                Blog
              </span>
            </li>
          </ol>
        </motion.nav>

        {/* Hero copy + illustration */}
        <div className="grid grid-cols-1 items-center gap-10 pb-10 pt-8 lg:grid-cols-12 lg:gap-8 lg:pb-12 lg:pt-10 xl:gap-12">
          <motion.div
            className="lg:col-span-7 xl:col-span-6"
            variants={animate ? copyContainer : undefined}
            initial={animate ? 'hidden' : false}
            animate="visible"
          >
            <motion.span
              variants={animate ? fadeUp : undefined}
              className="inline-flex items-center rounded-md bg-[#FDECEE] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D40018]"
            >
              Industry Knowledge &amp; Guides
            </motion.span>

            <motion.h1
              variants={animate ? fadeUp : undefined}
              className="mt-5 max-w-[18ch] font-bold tracking-tight text-[#111827]"
              style={{
                fontSize: 'clamp(2rem, 1.35rem + 2.4vw, 3.5rem)',
                lineHeight: 1.12,
              }}
            >
              Edmonton Commercial Signage Insights
            </motion.h1>

            <motion.span
              className="mt-5 block h-[3px] w-14 origin-left rounded-full bg-[#D40018]"
              aria-hidden="true"
              initial={animate ? { scaleX: 0, opacity: 0 } : false}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32, ease: easeOut }}
            />

            <motion.p
              variants={animate ? fadeUp : undefined}
              className="mt-5 max-w-[700px] text-[#596579]"
              style={{
                fontSize: 'clamp(1rem, 0.95rem + 0.35vw, 1.25rem)',
                lineHeight: 1.65,
              }}
            >
              Helpful guides on sign permits, design, materials, and choosing the right signage for
              your business.
            </motion.p>
          </motion.div>

          <div className="relative hidden justify-end lg:col-span-5 lg:flex xl:col-span-6">
            <motion.div
              animate={
                animate
                  ? { y: [0, -6, 0] }
                  : undefined
              }
              transition={
                animate
                  ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }
                  : undefined
              }
            >
              <EdmontonSkylineIllustration
                className="h-auto w-full max-w-[520px]"
                animate={animate}
              />
            </motion.div>
          </div>
        </div>

        {/* Category strip */}
        <div className="relative pb-10 sm:pb-12">
          <motion.ul
            className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#E8EAED] bg-white sm:grid-cols-2 lg:grid-cols-4"
            variants={animate ? categoryContainer : undefined}
            initial={animate ? 'hidden' : false}
            animate="visible"
          >
            {CATEGORY_NAV.map((item, index) => {
              const Icon = item.icon;
              const href = resolveCategoryHref(item);
              const hasPosts = availableCategories.some(
                (category) => category.toLowerCase() === item.label.toLowerCase(),
              );
              const sharedClassName = [
                'group flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-5 transition-colors duration-250',
                index % 2 === 1 ? 'border-l border-[#E8EAED]' : '',
                index >= 2 ? 'border-t border-[#E8EAED] lg:border-t-0' : '',
                index > 0 ? 'lg:border-l lg:border-[#E8EAED]' : '',
                'hover:bg-[#F8F9FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D40018]/40 focus-visible:ring-inset',
                !hasPosts ? 'opacity-80' : '',
              ]
                .filter(Boolean)
                .join(' ');

              const content = (
                <>
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFF7F8] text-[#D40018] ring-1 ring-[#F2C4C9] transition-all duration-250 group-hover:bg-[#FDECEE] group-hover:ring-[#E8A0A8] motion-safe:group-hover:-translate-y-0.5">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-[13px] font-semibold leading-snug text-[#111827] transition-colors duration-250 group-hover:text-[#D40018] sm:text-sm">
                    {item.label}
                  </span>
                </>
              );

              return (
                <motion.li
                  key={item.id}
                  className="min-w-0"
                  variants={animate ? categoryItem : undefined}
                  whileHover={animate ? { y: -2 } : undefined}
                  transition={{ duration: 0.25 }}
                >
                  <Link href={href} className={sharedClassName}>
                    {content}
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
