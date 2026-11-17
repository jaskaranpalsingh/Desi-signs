'use client';

import React, { useRef } from 'react';
import { ClipboardList, PenTool, Factory, Truck } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { InfiniteMarquee } from '../ui/InfiniteMarquee';

const steps = [
  {
    num: '01',
    title: 'Consultation & Site Survey',
    description:
      'Laser site measurements, facade inspection, electrical supply assessment, and zoning verification under Edmonton Bylaw 12800.',
    icon: ClipboardList,
  },
  {
    num: '02',
    title: 'Design & Permits',
    description:
      'Scaled 2D/3D shop drawings and stamped structural engineering submitted to City of Edmonton Development Services.',
    icon: PenTool,
  },
  {
    num: '03',
    title: 'In-House Fabrication',
    description:
      'CNC waterjet cutting, automated letter bending, Matthews polyurethane painting, and CSA/UL electrical assembly.',
    icon: Factory,
  },
  {
    num: '04',
    title: 'Certified Installation',
    description:
      'Dedicated boom truck crew erects and electrically connects your sign, followed by a final photometric sign-off.',
    icon: Truck,
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

function ProcessStepCard({
  num,
  title,
  description,
  icon: Icon,
}: {
  num: string;
  title: string;
  description: string;
  icon: typeof ClipboardList;
}) {
  return (
    <article className="group relative flex h-[292px] w-[300px] flex-col overflow-hidden rounded-[22px] border border-[#E8EAED] bg-white p-7 shadow-[0_10px_30px_rgba(17,24,39,0.05)] transition-[border-color,box-shadow,transform] duration-300 sm:h-[300px] sm:w-[320px] hover:-translate-y-1 hover:border-[#DC1421]/35 hover:shadow-[0_18px_40px_rgba(220,20,33,0.1)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#DC1421] transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA] font-mono text-[13px] font-black tracking-tight text-[#17191D] transition-colors duration-300 group-hover:border-[#DC1421]/30 group-hover:bg-[#FFF0F1] group-hover:text-[#DC1421]">
          {num}
        </span>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F1] text-[#DC1421] transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
        </span>
      </div>

      <h3 className="text-[17px] font-bold leading-snug tracking-tight text-[#17191D]">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#596579]">{description}</p>

      <div
        aria-hidden
        className="mt-5 h-px w-10 bg-[#E5E7EB] transition-all duration-300 group-hover:w-14 group-hover:bg-[#DC1421]/50"
      />
    </article>
  );
}

export function ProcessTimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const show = inView || Boolean(reduceMotion);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-hidden border-b border-[#E5E7EB] bg-[#F7F8FA] py-16 sm:py-20 lg:py-24"
      aria-labelledby="process-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-7 bg-[#DC1421]" />
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#DC1421] uppercase">
              Turnkey Execution
            </p>
            <span aria-hidden className="h-px w-7 bg-[#DC1421]" />
          </div>
          <h2
            id="process-heading"
            className="text-[clamp(1.85rem,3.4vw,2.7rem)] font-bold tracking-tight text-[#17191D]"
          >
            From Concept to Illumination
          </h2>
          <p className="mx-auto mt-3.5 max-w-xl text-[15px] leading-relaxed text-[#596579] sm:text-base">
            We handle every step — from the first site visit to the final install — so your sign is
            done right.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="relative mt-12 w-full sm:mt-14"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={show ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.12, ease: easeOut }}
      >
        <InfiniteMarquee
          direction="left"
          duration={38}
          gap={22}
          copies={3}
          pauseOnHover={false}
          pauseOnFocus={false}
          className="py-3"
          itemClassName="py-2"
        >
          {steps.map((step) => (
            <ProcessStepCard
              key={step.num}
              num={step.num}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </InfiniteMarquee>
      </motion.div>
    </section>
  );
}
