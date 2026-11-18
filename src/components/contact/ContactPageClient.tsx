'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ArrowRight, Home } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ContactForm } from '@/components/forms/ContactForm';

const easeOut = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

const lineDraw: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: easeOut, delay: 0.1 },
  },
};

export type ContactSettingsProps = {
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  businessHours: string;
  serviceArea: string[];
};

export function ContactPageClient({ settings }: { settings: ContactSettingsProps }) {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, '')}`;

  const contactRows = [
    {
      icon: MapPin,
      label: 'Fabrication facility & office',
      body: (
        <span className="block text-[15px] leading-relaxed text-[#344054]">
          {settings.address}
          <br />
          {settings.city}, {settings.province} {settings.postalCode}
          <br />
          {settings.country}
        </span>
      ),
    },
    {
      icon: Phone,
      label: 'Telephone',
      body: (
        <>
          <a
            href={phoneHref}
            className="block text-[15px] font-semibold text-[#111827] transition-colors hover:text-[#DC001B]"
          >
            {settings.phone}
          </a>
          <span className="mt-0.5 block text-[13px] text-[#667085]">
            Toll-free across Northern Alberta
          </span>
        </>
      ),
    },
    {
      icon: Mail,
      label: 'Email inquiries',
      body: (
        <>
          <a
            href={`mailto:${settings.email}`}
            className="block text-[15px] font-semibold text-[#111827] transition-colors hover:text-[#DC001B]"
          >
            {settings.email}
          </a>
          <span className="mt-0.5 block text-[13px] text-[#667085]">
            Estimates & project questions
          </span>
        </>
      ),
    },
    {
      icon: Clock,
      label: 'Hours of operation',
      body: (
        <span className="block whitespace-pre-line text-[15px] leading-relaxed text-[#344054]">
          {settings.businessHours}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="border-b border-[#E5E7EB] bg-white">
        <motion.div
          className="mx-auto w-full max-w-[1100px] px-5 pt-12 pb-12 sm:px-8 sm:pt-14 sm:pb-14 lg:px-10"
          variants={animate ? stagger : undefined}
          initial={animate ? 'hidden' : false}
          animate="visible"
        >
          <motion.nav
            aria-label="Breadcrumb"
            className="mb-7 sm:mb-8"
            variants={animate ? fadeUp : undefined}
          >
            <ol className="flex items-center gap-2 text-[14px]">
              <li className="flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-[#98A2B3]" aria-hidden="true" />
                <Link
                  href="/"
                  className="text-[#667085] transition-colors duration-200 hover:text-[#111827]"
                >
                  Home
                </Link>
              </li>
              <li className="text-[#98A2B3]" aria-hidden="true">
                ›
              </li>
              <li className="font-medium text-[#111827]" aria-current="page">
                Contact
              </li>
            </ol>
          </motion.nav>

          <motion.p
            className="mb-3 text-[11px] font-bold tracking-[0.18em] text-[#C90018] uppercase"
            variants={animate ? fadeUp : undefined}
          >
            Edmonton facility
          </motion.p>

          <motion.h1
            className="max-w-[16ch] text-[clamp(2rem,1.2rem+2.6vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-[#111827]"
            variants={animate ? fadeUp : undefined}
          >
            Contact Desi Signs
          </motion.h1>

          <motion.div
            className="mt-6 h-1 w-[70px] origin-left rounded-[2px] bg-[#DC001B] sm:mt-7"
            variants={animate ? lineDraw : undefined}
            aria-hidden="true"
          />

          <motion.p
            className="mt-6 max-w-[40rem] text-[17px] leading-[1.65] text-[#667085] sm:mt-7 sm:text-[19px]"
            variants={animate ? fadeUp : undefined}
          >
            Project consulting, landlord bylaw help, or emergency sign repair — our local Edmonton
            team is ready to assist.
          </motion.p>
        </motion.div>
      </header>

      {/* Content */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-10">
          {/* Info column */}
          <motion.div
            className="lg:col-span-5"
            variants={animate ? stagger : undefined}
            initial={animate ? 'hidden' : false}
            whileInView={animate ? 'visible' : undefined}
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={animate ? fadeUp : undefined} className="mb-8">
              <h2 className="text-[1.5rem] font-bold tracking-tight text-[#111827]">
                Get in touch directly
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#667085]">
                Our fabrication shop and showroom are in South Edmonton.
              </p>
            </motion.div>

            <div className="space-y-0 divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
              {contactRows.map((row) => {
                const Icon = row.icon;
                return (
                  <motion.div
                    key={row.label}
                    className="flex items-start gap-3.5 py-5"
                    variants={animate ? fadeUp : undefined}
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FDECEF] text-[#DC001B]">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold tracking-[0.12em] text-[#98A2B3] uppercase">
                        {row.label}
                      </p>
                      <div className="mt-1.5">{row.body}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="mt-8"
              variants={animate ? fadeUp : undefined}
            >
              <p className="text-[11px] font-bold tracking-[0.14em] text-[#111827] uppercase">
                On-site installation regions
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#667085]">
                {settings.serviceArea.join(', ')}
              </p>
            </motion.div>

            <motion.div variants={animate ? fadeUp : undefined} className="mt-8">
              <Link
                href="/quote"
                className="group inline-flex items-center gap-2 text-[14px] font-semibold text-[#DC001B] transition-colors hover:text-[#B80017]"
              >
                Prefer a project estimate?
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Form column */}
          <motion.div
            className="lg:col-span-7"
            variants={animate ? fadeUp : undefined}
            initial={animate ? 'hidden' : false}
            whileInView={animate ? 'visible' : undefined}
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="mb-6">
              <h2 className="text-[1.5rem] font-bold tracking-tight text-[#111827]">
                Send a message
              </h2>
              <p className="mt-2 text-[15px] text-[#667085]">
                An Edmonton team member will follow up shortly.
              </p>
            </div>
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
