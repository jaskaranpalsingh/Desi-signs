import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '@/lib/types';
import { SectionHeader } from '../ui/SectionHeader';

export function ServicesShowcase({ services }: { services: ServiceItem[] }) {
  const primaryService = services.find((s) => s.slug === 'channel-letters') || services[0];
  const secondaryServices = services.filter((s) => s.id !== primaryService?.id).slice(0, 5);

  return (
    <section className="py-20 lg:py-28 bg-neutral-50/60 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader
            eyebrow="Commercial Services"
            title="Engineered Signage Capabilities"
            description="Turnkey signage manufacturing from initial architectural drawings and permit filings to crane-assisted installation."
            className="mb-0"
          />
          <Link
            href="/services"
            className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold text-neutral-900 hover:text-neutral-700 transition-colors shrink-0"
          >
            Explore All Capabilities <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>

        {/* Editorial Layout: Large Lead Feature + Structured Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Large Feature: Channel Letters */}
          {primaryService && (
            <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xs overflow-hidden flex flex-col justify-between group">
              <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100">
                <Image
                  src={primaryService.image}
                  alt={primaryService.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-neutral-900 border border-neutral-200 rounded-xs">
                  Flagship Offering
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="text-2xl font-semibold text-neutral-900 tracking-tight">
                    {primaryService.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    {primaryService.shortDescription}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-4">
                    {primaryService.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="text-xs text-neutral-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full shrink-0"></span>
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500">
                    UL/CSA Certified • Sub-Zero Rated LEDs
                  </span>
                  <Link
                    href={`/services/${primaryService.slug}`}
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    View Specifications <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Editorial Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {secondaryServices.map((service, idx) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="bg-white border border-neutral-200 p-5 rounded-xs hover:border-neutral-400 transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-neutral-400">0{idx + 2}</span>
                  <div>
                    <h4 className="text-base font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                      {service.subtitle || service.shortDescription}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors shrink-0 ml-3" />
              </Link>
            ))}

            {/* Inset Quote Request Prompt */}
            <div className="p-6 bg-surface border border-line rounded-[12px] mt-auto flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-brand font-semibold block">
                  Custom Architecture
                </span>
                <p className="text-sm font-medium text-ink mt-1">
                  Have unique structural requirements or specialized architectural plans?
                </p>
              </div>
              <Link
                href="/quote"
                className="inline-flex items-center text-xs font-semibold text-brand underline underline-offset-4 hover:text-brand-hover"
              >
                Send Us Your CAD / Vector Files →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

