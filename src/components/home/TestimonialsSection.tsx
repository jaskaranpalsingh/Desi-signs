'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { TestimonialItem } from '@/lib/types';

const easeOut = [0.22, 1, 0.36, 1] as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

const headerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });
  const animate = !reduceMotion && inView;

  const items = (testimonials || []).filter((t) => t.featured !== false).slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused || items.length < 2) return;
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [items.length, paused, reduceMotion]);

  if (!items.length) {
    return (
      <section className="border-b border-[#E8EAED] bg-[#F7F8FA] py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#D71920] uppercase">
            Client Experiences
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#111827]">
            What Our Clients Say
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#667085]">
            Verified client reviews will appear here as projects are completed.
          </p>
        </div>
      </section>
    );
  }

  const active = items[activeIndex] || items[0];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-[#E8EAED] bg-[#0F1115] py-20 text-white lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 55% at 12% 18%, rgba(215,25,32,0.22), transparent 55%), radial-gradient(ellipse 55% 45% at 88% 78%, rgba(215,25,32,0.1), transparent 50%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl"
          variants={animate ? headerVariants : undefined}
          initial={animate ? 'hidden' : false}
          animate="visible"
        >
          <motion.p
            variants={animate ? fadeUp : undefined}
            className="text-[11px] font-semibold tracking-[0.2em] text-[#F2A4A8] uppercase"
          >
            Client Experiences
          </motion.p>
          <motion.h2
            variants={animate ? fadeUp : undefined}
            className="mt-4 text-[clamp(1.85rem,1.2rem+2vw,3rem)] font-bold tracking-tight text-white"
          >
            Trusted by Edmonton businesses who needed signs done right.
          </motion.h2>
          <motion.p
            variants={animate ? fadeUp : undefined}
            className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/60"
          >
            Real feedback from clinics, restaurants, and commercial properties across the city.
          </motion.p>
          <motion.span
            className="mt-6 block h-[3px] w-14 origin-left rounded-full bg-[#D71920]"
            aria-hidden="true"
            initial={animate ? { scaleX: 0, opacity: 0 } : false}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.28, ease: easeOut }}
          />
        </motion.div>

        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] lg:gap-14 xl:gap-20">
          {/* Featured quote */}
          <div className="relative min-h-[280px] sm:min-h-[300px]">
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -top-6 left-0 select-none font-serif text-[7rem] leading-none text-[#D71920]/25 sm:-top-8 sm:text-[8.5rem]"
              initial={animate ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
            >
              “
            </motion.span>

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.id}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: easeOut }}
                className="relative pt-10"
              >
                <p className="text-[clamp(1.2rem,0.95rem+1.1vw,1.65rem)] leading-[1.45] font-medium tracking-[-0.01em] text-white/95">
                  {active.content}
                </p>

                <footer className="mt-8 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D71920] text-sm font-bold tracking-wide text-white">
                    {initials(active.clientName)}
                  </span>
                  <div>
                    <cite className="block text-[15px] font-semibold not-italic text-white">
                      {active.clientName}
                    </cite>
                    <p className="mt-0.5 text-[13px] text-white/55">
                      {active.role}
                      {active.companyName ? `, ${active.companyName}` : ''}
                    </p>
                    {(active.projectType || active.location) && (
                      <p className="mt-1 text-[12px] tracking-wide text-[#F2A4A8]/90">
                        {[active.projectType, active.location].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Client switcher */}
          <motion.div
            className="flex flex-col justify-center border-t border-white/10 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10 xl:pl-14"
            initial={animate ? { opacity: 0, x: 16 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.25, ease: easeOut }}
          >
            <p className="mb-5 text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">
              Voices from the floor
            </p>
            <ul className="space-y-2" role="tablist" aria-label="Client testimonials">
              {items.map((item, index) => {
                const selected = index === activeIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveIndex(index)}
                      className={`group flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-3.5 py-3 text-left transition-colors duration-250 ${
                        selected
                          ? 'bg-white/10'
                          : 'hover:bg-white/[0.05]'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          selected
                            ? 'bg-[#D71920] text-white'
                            : 'bg-white/10 text-white/70 group-hover:bg-white/15'
                        }`}
                      >
                        {initials(item.clientName)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-[14px] font-semibold ${
                            selected ? 'text-white' : 'text-white/75'
                          }`}
                        >
                          {item.clientName}
                        </span>
                        <span className="block truncate text-[12px] text-white/45">
                          {item.companyName || item.location}
                        </span>
                      </span>
                      {selected && (
                        <motion.span
                          layoutId="testimonial-active-bar"
                          className="h-8 w-[3px] shrink-0 rounded-full bg-[#D71920]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Progress ticks */}
            {items.length > 1 && (
              <div className="mt-8 flex gap-1.5" aria-hidden="true">
                {items.map((item, index) => (
                  <span
                    key={item.id}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      index === activeIndex ? 'bg-[#D71920]' : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
