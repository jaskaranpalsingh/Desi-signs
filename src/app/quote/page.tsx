import React, { Suspense } from 'react';
import { Metadata } from 'next';
import {
  ClipboardCheck,
  Clock,
  FileSearch,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { constructMetadata } from '@/lib/seo';
import { QuoteRequestForm } from '@/components/forms/QuoteRequestForm';
import { getServices, getSettings } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = constructMetadata({
  title: 'Request a Commercial Signage Quote | Desi Signs Edmonton',
  description:
    'Request a detailed itemized quote for custom commercial signage in Edmonton, AB. Channel letters, storefront signs, architectural letters, and pylon monuments.',
  canonicalUrl: '/quote',
});

export default async function QuotePage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const signTypeOptions = services.map((service) => service.title);
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, '')}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <section className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#DC1421] uppercase">
              Request a Quote
            </p>
            <span className="h-px w-10 bg-[#DC1421]" aria-hidden="true" />
          </div>
          <h1 className="mt-4 max-w-3xl text-[clamp(1.85rem,1.2rem+2vw,2.75rem)] font-bold tracking-tight text-[#111111]">
            Tell Us About Your Signage Project
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#596579] sm:text-base">
            Share a few details and our team will get back to you with a customized estimate.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
            <div>
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center text-sm text-[#596579]">
                    Loading quote form…
                  </div>
                }
              >
                <QuoteRequestForm signTypeOptions={signTypeOptions} />
              </Suspense>
            </div>

            <aside className="space-y-5 lg:pt-1">
              {/* What Happens Next */}
              <div
                className="overflow-hidden rounded-2xl p-6 text-white sm:p-7"
                style={{
                  background:
                    'linear-gradient(160deg, #850B15 0%, #DC1421 58%, #B9101A 100%)',
                }}
              >
                <h2 className="text-lg font-bold tracking-tight">What Happens Next?</h2>
                <ol className="relative mt-6 space-y-6">
                  <span
                    className="absolute top-3 bottom-3 left-[15px] w-px border-l border-dashed border-white/35"
                    aria-hidden="true"
                  />
                  {[
                    {
                      icon: ClipboardCheck,
                      title: 'Technical Review',
                      body: 'We review your sign requirements, size, and installation location.',
                    },
                    {
                      icon: FileSearch,
                      title: 'Permit Check',
                      body: 'We check whether your project needs permits or approvals.',
                    },
                    {
                      icon: FileText,
                      title: 'Custom Quote',
                      body: 'We prepare a quote based on your signage needs.',
                    },
                  ].map((step) => {
                    const Icon = step.icon;
                    return (
                      <li key={step.title} className="relative flex gap-3.5 pl-1">
                        <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#DC1421] shadow-sm">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-[14px] font-semibold">{step.title}</p>
                          <p className="mt-1 text-[13px] leading-relaxed text-white/80">
                            {step.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Contact */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-[3px] rounded-full bg-[#DC1421]" aria-hidden="true" />
                  <h2 className="text-[15px] font-bold text-[#111111]">
                    Have a Question? Contact Us
                  </h2>
                </div>
                <div className="mt-5 space-y-3.5 text-[14px] text-[#596579]">
                  <a
                    href={phoneHref}
                    className="flex items-center gap-2.5 font-semibold text-[#111111] transition-colors hover:text-[#DC1421]"
                  >
                    <Phone className="h-4 w-4 text-[#DC1421]" />
                    {settings.phone}
                  </a>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-2.5 transition-colors hover:text-[#DC1421]"
                  >
                    <Mail className="h-4 w-4 text-[#DC1421]" />
                    {settings.email}
                  </a>
                  <div className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#DC1421]" />
                    <span>{settings.businessHours}</span>
                  </div>
                </div>
              </div>

              {/* Verified warranty from site terms */}
              <div className="flex gap-3 rounded-2xl border border-[#F2C4C9] bg-[#FFF5F5] p-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#DC1421]" />
                <div>
                  <p className="text-[13px] font-bold text-[#111111]">Alberta Winter Guarantee</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#596579]">
                    All custom fabricated illuminated signs carry our standard 5-year warranty on LED
                    modules, power drivers, and aluminum structural welds against manufacturing
                    defects under normal operating conditions.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
