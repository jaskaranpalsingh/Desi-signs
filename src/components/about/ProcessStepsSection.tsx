'use client';

import React, { useRef } from 'react';
import { Pencil, Palette, Hammer, Truck, type LucideIcon } from 'lucide-react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';

type ProcessStep = {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

const STEPS: ProcessStep[] = [
  {
    num: '01',
    title: 'Planning',
    desc: 'Tell us what kind of sign you need.',
    icon: Pencil,
  },
  {
    num: '02',
    title: 'Design',
    desc: 'We create a design that suits your business.',
    icon: Palette,
  },
  {
    num: '03',
    title: 'Production',
    desc: 'We make your sign using suitable materials.',
    icon: Hammer,
  },
  {
    num: '04',
    title: 'Installation',
    desc: 'We install your sign at the agreed location.',
    icon: Truck,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function RibbonDecor({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M-20 220C40 160 90 120 150 130C220 142 250 210 320 200C380 192 420 140 460 90"
        stroke="#D50000"
        strokeWidth="28"
        strokeLinecap="round"
        opacity="0.12"
      />
      <path
        d="M-10 250C50 190 110 150 175 158C245 168 270 230 340 222C395 216 435 170 470 130"
        stroke="#D50000"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.08"
      />
    </svg>
  );
}

export function ProcessStepsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="relative overflow-hidden border-b border-neutral-200/80 bg-white py-16 sm:py-20 lg:py-28"
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(23,25,29,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,25,29,0.035) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[#F8F9FA]/55" />

      {/* Soft corner ribbons */}
      <RibbonDecor className="pointer-events-none absolute -bottom-10 -left-16 h-56 w-80 sm:h-72 sm:w-[26rem] rotate-[-8deg]" />
      <RibbonDecor className="pointer-events-none absolute -right-20 -top-8 h-56 w-80 sm:h-72 sm:w-[26rem] rotate-[168deg]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        {/* Centered heading */}
        <motion.div
          className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="hidden h-px w-10 bg-[#D50000] sm:block sm:w-14" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D50000]">
              The Shop
            </span>
            <span className="hidden h-px w-10 bg-[#D50000] sm:block sm:w-14" aria-hidden="true" />
          </div>

          <h2
            id="process-heading"
            className="text-[1.85rem] font-bold leading-[1.15] tracking-tight text-[#17191D] sm:text-4xl lg:text-[2.75rem]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            From Design to Installation
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#667085] sm:text-lg">
            We make the signage process simple, from your first idea to the finished product.
          </p>
        </motion.div>

        {/* Cards + timeline */}
        <motion.ol
          className="relative grid grid-cols-1 gap-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-4 lg:gap-7"
          variants={reduceMotion ? undefined : containerVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate={inView ? 'visible' : undefined}
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const showDesktopConnector = index < STEPS.length - 1;

            return (
              <motion.li
                key={step.num}
                variants={reduceMotion ? undefined : itemVariants}
                className="group relative flex justify-center pt-10"
              >
                {/* Desktop connector: from this icon center across the gap to the next */}
                {showDesktopConnector && (
                  <div
                    className="pointer-events-none absolute left-1/2 top-10 z-0 hidden h-[2px] w-[calc(100%+1.75rem)] lg:block"
                    aria-hidden="true"
                  >
                    <motion.div
                      className="h-full origin-left rounded-full bg-[#D50000]"
                      initial={reduceMotion ? false : { scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : undefined}
                      transition={{
                        duration: 0.55,
                        delay: 0.2 + index * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                    <span className="absolute left-1/2 top-1/2 z-[1] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#D50000] bg-white" />
                  </div>
                )}

                {/* Overlapping icon badge */}
                <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
                  <div
                    className="relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-[0_10px_28px_rgba(213,0,0,0.28)] transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 28%, #FF4D4D 0%, #D50000 48%, #A80000 100%)',
                    }}
                  >
                    <Icon className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-[#D50000] px-1.5 text-[11px] font-bold tracking-wide text-white shadow-sm">
                      {step.num}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <article className="relative flex h-full w-full max-w-sm flex-col items-center overflow-hidden rounded-[26px] bg-white px-6 pb-9 pt-14 text-center shadow-[0_12px_40px_rgba(23,25,29,0.08)] ring-1 ring-black/[0.03] transition-[transform,box-shadow] duration-300 ease-out motion-safe:group-hover:-translate-y-[5px] motion-safe:group-hover:shadow-[0_18px_48px_rgba(23,25,29,0.12)] sm:max-w-none">
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-70"
                    aria-hidden="true"
                    style={{
                      background:
                        'radial-gradient(ellipse at 100% 100%, rgba(213,0,0,0.07) 0%, transparent 58%)',
                    }}
                  />

                  <h3 className="relative text-xl font-bold tracking-tight text-[#17191D]">
                    {step.title}
                  </h3>
                  <span
                    className="relative mt-3 mb-4 h-[3px] w-11 rounded-full bg-[#D50000]"
                    aria-hidden="true"
                  />
                  <p className="relative text-[15px] leading-relaxed text-[#667085]">
                    {step.desc}
                  </p>
                </article>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
