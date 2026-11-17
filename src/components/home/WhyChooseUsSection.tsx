'use client';

import React, { useId, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Factory,
  FileCheck,
  ShieldCheck,
  Snowflake,
} from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: typeof Factory;
};

const FEATURED: Feature = {
  id: 'fabrication',
  title: 'In-House Fabrication',
  description: 'We make our signs using quality materials and careful workmanship.',
  icon: Factory,
};

const FEATURES: Feature[] = [
  {
    id: 'weather',
    title: 'Built for Alberta Weather',
    description: "We use durable materials made to handle Alberta's changing weather.",
    icon: Snowflake,
  },
  {
    id: 'permits',
    title: 'Permit Assistance',
    description: 'We help you understand and manage the sign permit process.',
    icon: FileCheck,
  },
  {
    id: 'warranty',
    title: 'Warranty & Support',
    description: 'We provide support and warranty coverage on eligible signs.',
    icon: ShieldCheck,
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export function WhyChooseUsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();
  const show = inView || Boolean(reduceMotion);
  const accordionId = useId();
  const [openId, setOpenId] = useState<string | null>(FEATURES[0]?.id ?? null);
  const FeaturedIcon = FEATURED.icon;

  return (
    <section
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden border-b border-[#E5E7EB] bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="why-choose-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-4 mx-auto h-[320px] max-w-5xl opacity-[0.045]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 280' fill='%23111827'%3E%3Cpath d='M60 260V150h40v-40h40V80h40V40h80v40h40v30h40v40h40v110H60zm140-40h40v40h-40v-40zm80 0h40v40h-40v-40zm80 0h40v40h-40v-40zM520 260V120h50V70h80v50h50v140H520zm70-50h40v40h-40v-40z'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          backgroundSize: 'min(980px, 100%) auto',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 right-0 h-48 w-56 bg-[#DC1421]/[0.06] [clip-path:ellipse(78%_62%_at_86%_12%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-7 bg-[#DC1421]" />
            <p className="text-[11px] font-bold tracking-[0.16em] text-[#DC1421] uppercase sm:text-xs">
              Our Craftsmanship Standard
            </p>
          </div>
          <h2
            id="why-choose-heading"
            className="text-[clamp(1.75rem,3.4vw,2.65rem)] font-bold leading-[1.2] tracking-tight text-[#111827]"
          >
            Why Leading Alberta Businesses Choose{' '}
            <span className="relative whitespace-nowrap text-[#DC1421]">
              Desi Signs
              <span
                aria-hidden
                className="absolute right-0 -bottom-1 left-0 h-[3px] rounded-full bg-[#DC1421]/45"
              />
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[#596579] sm:text-base">
            We design, build, and install quality signs that help your business stand out.
          </p>
        </motion.div>

        {/* Desktop: featured left + 3 equal vertical cards */}
        <div className="mt-10 hidden lg:mt-12 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-6">
          <motion.article
            className="group flex min-h-[420px] flex-col overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_12px_30px_rgba(17,24,39,0.07)] lg:col-span-5"
            initial={reduceMotion ? false : { opacity: 0, x: -22 }}
            animate={show ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.05, ease: easeOut }}
          >
            <div className="relative min-h-[200px] flex-[1.05] overflow-hidden bg-[#F8F9FA]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portfolio/fincan.jpg"
                alt="Desi Signs fabrication shop preparing illuminated channel letters"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="relative flex flex-1 flex-col justify-center bg-[#DC1421] px-6 py-7 text-white lg:px-7">
              <span className="mb-3.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <FeaturedIcon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="pr-14 text-xl font-bold tracking-tight lg:text-[1.35rem]">
                {FEATURED.title}
              </h3>
              <p className="mt-2.5 max-w-[28ch] text-sm leading-relaxed text-white/90">
                {FEATURED.description}
              </p>
              <span
                aria-hidden
                className="absolute right-6 bottom-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#DC1421] shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition-transform duration-250 group-hover:translate-x-0.5"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
              </span>
            </div>
          </motion.article>

          <div className="grid h-full min-h-[420px] grid-cols-3 gap-6 lg:col-span-7">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.id}
                  className="group flex h-full min-h-0 flex-col rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-[0_8px_22px_rgba(17,24,39,0.045)] transition-[transform,box-shadow,border-color] duration-250 ease-out hover:-translate-y-1 hover:border-[#DC1421] hover:shadow-[0_16px_36px_rgba(220,20,33,0.14)]"
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={show ? { opacity: 1, y: 0 } : undefined}
                  transition={{
                    duration: 0.45,
                    delay: reduceMotion ? 0 : 0.12 + index * 0.08,
                    ease: easeOut,
                  }}
                >
                  <span className="mb-7 inline-flex text-[#DC1421]">
                    <Icon className="h-8 w-8" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="text-[15px] font-bold leading-snug tracking-tight text-[#111827] lg:text-base">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#596579]">{feature.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Tablet: featured full width, then 3-up */}
        <div className="mt-9 hidden gap-5 md:grid md:grid-cols-3 lg:hidden">
          <motion.article
            className="group col-span-3 flex overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_12px_30px_rgba(17,24,39,0.07)] sm:flex-row"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={show ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-[#F8F9FA] sm:h-auto sm:min-h-[220px] sm:w-[44%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portfolio/fincan.jpg"
                alt="Desi Signs fabrication shop preparing illuminated channel letters"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="relative flex flex-1 flex-col justify-center bg-[#DC1421] px-6 py-6 text-white">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <FeaturedIcon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="pr-12 text-xl font-bold tracking-tight">{FEATURED.title}</h3>
              <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-white/90">
                {FEATURED.description}
              </p>
              <span
                aria-hidden
                className="absolute right-5 bottom-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#DC1421]"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
              </span>
            </div>
          </motion.article>

          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.id}
                className="group flex min-h-[220px] flex-col rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-[0_8px_22px_rgba(17,24,39,0.045)] transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-1 hover:border-[#DC1421] hover:shadow-[0_14px_32px_rgba(220,20,33,0.12)]"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={show ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.1 + index * 0.07,
                  ease: easeOut,
                }}
              >
                <span className="mb-5 inline-flex text-[#DC1421]">
                  <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="text-[15px] font-bold tracking-tight text-[#111827]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#596579]">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>

        {/* Mobile: featured + accordion rows */}
        <div className="mt-8 space-y-4 md:hidden">
          <motion.article
            className="overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_10px_28px_rgba(17,24,39,0.06)]"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={show ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            <div className="relative h-44 overflow-hidden bg-[#F8F9FA]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portfolio/fincan.jpg"
                alt="Desi Signs fabrication shop preparing illuminated channel letters"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="relative bg-[#DC1421] p-5 text-white">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <FeaturedIcon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="pr-12 text-lg font-bold tracking-tight">{FEATURED.title}</h3>
              <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-white/90">
                {FEATURED.description}
              </p>
              <span
                aria-hidden
                className="absolute top-1/2 right-5 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#DC1421]"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
              </span>
            </div>
          </motion.article>

          <div className="space-y-3" role="list">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const isOpen = openId === feature.id;
              const panelId = `${accordionId}-panel-${feature.id}`;
              const buttonId = `${accordionId}-button-${feature.id}`;

              return (
                <motion.div
                  key={feature.id}
                  role="listitem"
                  className={`overflow-hidden rounded-[14px] border bg-white shadow-[0_6px_18px_rgba(17,24,39,0.04)] transition-colors ${
                    isOpen ? 'border-[#DC1421]/40' : 'border-[#E5E7EB]'
                  }`}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={show ? { opacity: 1, y: 0 } : undefined}
                  transition={{
                    duration: 0.35,
                    delay: reduceMotion ? 0 : 0.08 + index * 0.05,
                    ease: easeOut,
                  }}
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : feature.id)}
                    className="flex min-h-[56px] w-full items-center gap-3 px-4 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1421]"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-[#DC1421]">
                      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="flex-1 text-[15px] font-bold text-[#111827]">{feature.title}</span>
                    <ChevronRight
                      className={`h-5 w-5 shrink-0 text-[#596579] transition-transform duration-250 ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                      aria-hidden
                    />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className={isOpen ? 'border-t border-[#E5E7EB] px-4 pb-4' : undefined}
                  >
                    {isOpen ? (
                      <p className="pt-3 pl-[52px] text-sm leading-relaxed text-[#596579]">
                        {feature.description}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
