'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Store,
  UtensilsCrossed,
  Briefcase,
  Layers,
  Sparkles,
  Globe2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Flame,
  Award,
  Users2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProcessStepsSection } from '@/components/about/ProcessStepsSection';

export default function AboutPageClient({
  showcaseProjects,
}: {
  showcaseProjects: any[];
}) {
  const businessTypes = [
    {
      title: 'Retail Stores',
      desc: 'Storefront signs that help customers find your shop.',
      icon: Store,
    },
    {
      title: 'Restaurants & Cafés',
      desc: 'Signs that make your business easy to recognise.',
      icon: UtensilsCrossed,
    },
    {
      title: 'Offices',
      desc: 'Professional signs for entrances and reception areas.',
      icon: Briefcase,
    },
    {
      title: 'Franchises',
      desc: 'Consistent signage across different locations.',
      icon: Layers,
    },
    {
      title: 'Small Businesses',
      desc: 'Custom signs that fit your needs and budget.',
      icon: Sparkles,
    },
    {
      title: 'Local & Multicultural Businesses',
      desc: 'Signs that reflect your brand and identity.',
      icon: Globe2,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO — composition matched to 110% zoom, at browser 100% ── */}
      <section className="relative w-full overflow-hidden border-b border-neutral-200 bg-white">
        <div className="relative mx-auto flex w-full max-w-[1440px] flex-col lg:min-h-[calc(100svh-76px)]">
          {/* Desktop image panel (right) with diagonal edge */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[56%] lg:block xl:w-[54%]">
            <div
              className="absolute inset-0 bg-neutral-900"
              style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              <Image
                src="/about-hero-storefront.jpg"
                alt="Desi Signs commercial storefront in Edmonton"
                fill
                priority
                sizes="56vw"
                className="object-cover object-center"
              />
            </div>

            {/* Soft white wedge so copy never sits under the photo */}
            <div
              className="absolute inset-y-0 left-0 w-[22%] bg-white"
              style={{ clipPath: 'polygon(0 0, 100% 0, 42% 100%, 0 100%)' }}
            />

            {/* Red diagonal slash */}
            <div
              className="absolute inset-y-[-12%] left-[5%] w-3 origin-center bg-[#D71920] xl:left-[6%] xl:w-[13px]"
              style={{ transform: 'skewX(-17deg)' }}
            />

            {/* Bottom-right accent */}
            <div
              className="absolute bottom-0 right-0 h-7 w-48 bg-[#D71920] xl:h-8 xl:w-56"
              style={{ clipPath: 'polygon(22px 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            />
          </div>

          {/* Content column */}
          <div className="relative z-10 flex flex-1 items-center px-5 py-12 sm:px-8 sm:py-14 md:px-12 lg:w-[52%] lg:px-12 lg:py-14 xl:w-[50%] xl:px-16 xl:py-16">
            <div className="w-full max-w-[580px]">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mb-3.5 flex items-center gap-3"
              >
                <span className="inline-block h-[3px] w-7 bg-[#D71920]" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-neutral-800 sm:text-xs">
                  DESI NAAM. PROFESSIONAL KAAM.
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="mb-2.5 text-[2.2rem] font-black leading-[1.08] tracking-tight sm:text-[2.7rem] lg:text-[2.95rem] xl:text-[3.2rem]"
              >
                <span className="text-[#202124]">About </span>
                <span className="text-[#D71920]">Desi Signs</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="mb-4 text-base font-bold tracking-tight text-[#202124] sm:text-[17px]"
              >
                Your Local Signage Company in Edmonton
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="space-y-3 text-[14.5px] leading-relaxed text-[#475569] sm:text-[15px] sm:leading-[1.65]"
              >
                <p>
                  At Desi Signs, we help businesses stand out with custom signs that look
                  professional and attract attention.
                </p>
                <p>
                  Based in Edmonton, Alberta, we create signage for shops, restaurants, offices, and
                  other businesses. From storefront signs and 3D letters to illuminated signs and
                  window graphics, we offer solutions that match your brand and budget.
                </p>
                <p>
                  Whether you&apos;re starting a new business or updating an existing sign, we&apos;re
                  here to help bring your ideas to life.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 }}
                className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#D71920] bg-white text-[#D71920]">
                    <MapPin className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="text-xs font-bold leading-tight text-[#202124]">
                    Local to<br />Edmonton
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#D71920] bg-white text-[#D71920]">
                    <Award className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="text-xs font-bold leading-tight text-[#202124]">
                    Quality<br />Craftsmanship
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#D71920] bg-white text-[#D71920]">
                    <Users2 className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="text-xs font-bold leading-tight text-[#202124]">
                    Businesses<br />of All Sizes
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3 }}
                className="mt-6 flex flex-wrap items-center gap-3.5"
              >
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D71920] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#B5121B]"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D71920] bg-white px-6 py-3 text-sm font-bold text-[#D71920] transition-colors hover:bg-red-50"
                >
                  <span>Contact Our Shop</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile / tablet image */}
          <div className="relative h-[280px] w-full overflow-hidden bg-neutral-900 sm:h-[360px] lg:hidden">
            <Image
              src="/about-hero-storefront.jpg"
              alt="Desi Signs commercial storefront in Edmonton"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              className="absolute bottom-0 right-0 h-5 w-36 bg-[#D71920]"
              style={{ clipPath: 'polygon(18px 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE SHOP — FROM DESIGN TO INSTALLATION ─────────────── */}
      <ProcessStepsSection />

      {/* ── SECTION 4: WHO WE WORK WITH ─────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Industries & Clients"
            title="Signs for Every Type of Business"
            description="Whether you run a neighbourhood storefront or manage multiple commercial locations, we craft signage tailored to your business."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {businessTypes.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-neutral-200/80 rounded-xs p-6 hover:border-[#D71920] transition-all duration-150 shadow-xs flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xs bg-[#FFF5EB] group-hover:bg-[#D71920] flex items-center justify-center text-[#D71920] group-hover:text-white transition-colors flex-shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#202124] tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed mt-1 font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: OUR WORK — PROJECT GALLERY ─────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <SectionHeader
              eyebrow="Portfolio & Proof"
              title="Signs That Make Businesses Stand Out"
              description="Every sign we build is custom-made to help our clients make a lasting impression across Edmonton."
              className="mb-0"
            />
            <Link
              href="/projects"
              className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold text-[#202124] hover:text-[#D71920] transition-colors shrink-0"
            >
              View Full Portfolio <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseProjects.map((proj) => (
              <Link
                key={proj.id}
                href={`/projects/${proj.slug}`}
                className="group border border-neutral-200 bg-white rounded-xs overflow-hidden hover:border-[#202124] transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#202124]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-xs">
                      {proj.category.split('&')[0]}
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="text-[11px] font-semibold text-[#D71920] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {proj.location.split(',')[0]}
                    </div>
                    <h3 className="text-sm font-bold text-[#202124] leading-snug group-hover:text-[#D71920] transition-colors line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                      {proj.summary}
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-1 flex items-center text-xs font-semibold text-[#202124]">
                  <span className="text-[11px] group-hover:underline">View Case Study →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: WHY DESI SIGNS & CRAFTSMANSHIP ────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#D71920] inline-block" />
                <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
                  Why Desi Signs
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#202124] tracking-tight leading-tight">
                Quality Materials, Edmonton Craftsmanship &amp; Reliable Handover
              </h2>
              <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
                We believe that great commercial signage shouldn&apos;t be complicated. Based right
                here in Edmonton, our in-house team oversees the entire journey — from initial site
                measurements and city permit filings under Bylaw 12800 to precision CNC routing and
                certified installation.
              </p>
              <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
                Every illuminated sign is engineered for Alberta&apos;s extreme sub-zero winters,
                incorporating IP68 moisture protection and UL/CSA certified electrical components.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAFAFA] border border-neutral-200 rounded-xs flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#202124] flex-shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-[#202124] block">UL &amp; CSA Certified</span>
                    <span className="text-xs text-neutral-500">Electrical safety standard</span>
                  </div>
                </div>
                <div className="p-4 bg-[#FAFAFA] border border-neutral-200 rounded-xs flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#202124] flex-shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-[#202124] block">On-Time Delivery</span>
                    <span className="text-xs text-neutral-500">Clear project milestones</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80"
                  alt="Desi Signs commercial craftsmanship in Edmonton"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: FAQ ACCORDION ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#FAFAFA] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-3">
                Common Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124] tracking-tight leading-tight">
                Everything you need to know about working with us.
              </h2>
              <p className="mt-4 text-sm text-[#475569] leading-relaxed">
                Have questions regarding permits, timelines, or materials? Here are answers to the
                questions we hear most often from Edmonton business owners.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-semibold text-[#202124] hover:text-[#D71920] transition-colors"
                >
                  Speak with an estimator <ArrowRight className="ml-1.5 w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <FaqAccordion
                items={[
                  {
                    question: 'Do I need a permit for a commercial sign in Edmonton?',
                    answer:
                      'Yes. The City of Edmonton requires a Development Permit and in most cases a Building Permit under Bylaw 12800 for any permanent exterior sign. The permit process involves submitting scaled drawings, structural engineering calculations, and electrical specifications. Desi Signs handles the full permit application on your behalf — including liaison with Development Services Officers and any required revisions.',
                  },
                  {
                    question: 'How long does a signage project take from approval to installation?',
                    answer:
                      'Standard illuminated channel letter projects typically take 3–5 weeks from signed approval: 1 week for shop drawings and permit submission, 2–3 weeks for in-house fabrication, and 1–2 days for professional crane installation. Pylon and monument signs with concrete foundation work require 5–8 weeks. We provide a binding milestone schedule at the project kickoff.',
                  },
                  {
                    question: "Are your signs rated for Edmonton's extreme winters?",
                    answer:
                      "Every sign we manufacture is engineered specifically for Alberta's -40°C to +35°C temperature swings. We use IP68 silicone-sealed Samsung LED modules, Mean Well sub-zero rated LED drivers, engineered weep-hole drainage systems to prevent ice expansion, and 2-part Matthews polyurethane exterior coatings rated for UV and prairie freeze-thaw cycling.",
                  },
                  {
                    question: 'Can you match my existing corporate brand colours exactly?',
                    answer:
                      'Absolutely. We colour-match to any Pantone, RAL, or brand-specific hex reference using our in-house Matthews polyurethane paint mixing system. We also provide acrylic face materials in custom tints from Plexiglas and Lucite. A test colour swatch is provided for your approval before we begin full production.',
                  },
                  {
                    question: 'Do you work with landlords and property managers?',
                    answer:
                      'Yes — this is a significant part of our business. We regularly produce landlord approval packages including rendered elevations, structural data sheets, and insurance documentation required by commercial property managers. We attend Tenant Coordination meetings on your behalf when required by shopping centre or commercial plaza landlord agreements.',
                  },
                  {
                    question: 'What warranty do you offer on your signs?',
                    answer:
                      'We provide a 5-year comprehensive warranty covering LED module output degradation, power driver failures, aluminum structural welds, and trim cap adhesion. Cabinet and face materials carry a 7-year UV and weather resistance guarantee. We also offer extended service contracts for multi-location retail chains and franchise operators.',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: FINAL CTA SECTION ─────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-surface border-t border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-xs font-semibold text-brand">
            <Flame className="w-3.5 h-3.5" /> Ready To Get Started?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
            Ready to give your business the signage it deserves?
          </h2>
          <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Contact our Edmonton team today for a free project estimate, design consultation, or
            site measurement.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white text-sm font-bold px-8 py-4 rounded-lg transition-colors shadow-xs w-full sm:w-auto"
            >
              Request a Free Quote <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <a
              href="tel:7805550192"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold border border-brand text-brand hover:bg-red-50 rounded-lg transition-colors w-full sm:w-auto"
            >
              <Phone className="w-4 h-4 text-brand" />
              Call (780) 555-0192
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
