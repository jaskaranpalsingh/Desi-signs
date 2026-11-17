import React from 'react';
import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactForm } from '@/components/forms/ContactForm';
import { getSettings } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = constructMetadata({
  title: 'Contact Desi Signs | Edmonton Signage Fabrication Facility',
  description:
    'Contact Desi Signs in Edmonton, AB. Speak with our signage designers, request site surveys, or visit our local manufacturing shop at 9845 62 Ave NW.',
  canonicalUrl: '/contact',
});

export default async function ContactPage() {
  const settings = await getSettings();
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, '')}`;

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="border-b border-neutral-200 bg-neutral-50/50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Contact Us' }]} />
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
              Edmonton Facility
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              Contact Desi Signs
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Whether you need preliminary project consulting, landlord bylaw assistance, or emergency sign repair, our local Edmonton team is here to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Form + Verified Contact Cards */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Information & Map Info (Cols 1-5) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                    Get in Touch Directly
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                    Our fabrication shop and showroom are conveniently located in South Edmonton.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-semibold text-neutral-900 uppercase tracking-wider block">
                        Fabrication Facility & Office
                      </strong>
                      <span className="text-sm text-neutral-700 block mt-1">
                        {settings.address}
                        <br />
                        {settings.city}, {settings.province} {settings.postalCode}
                        <br />
                        {settings.country}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-semibold text-neutral-900 uppercase tracking-wider block">
                        Telephone
                      </strong>
                      <a
                        href={phoneHref}
                        className="text-sm text-neutral-800 font-semibold hover:text-neutral-950 block mt-1"
                      >
                        {settings.phone}
                      </a>
                      <span className="text-xs text-neutral-500">Toll-free across Northern Alberta</span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-semibold text-neutral-900 uppercase tracking-wider block">
                        Email Inquiries
                      </strong>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-sm text-neutral-800 font-semibold hover:text-neutral-950 block mt-1"
                      >
                        {settings.email}
                      </a>
                      <span className="text-xs text-neutral-500">Estimates: {settings.email}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-semibold text-neutral-900 uppercase tracking-wider block">
                        Hours of Operation
                      </strong>
                      <span className="text-sm text-neutral-700 block mt-1 whitespace-pre-line">
                        {settings.businessHours}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="border-t border-neutral-200 pt-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 block mb-2">
                  On-Site Installation Regions:
                </span>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {settings.serviceArea.join(', ')}
                </p>
              </div>
            </div>

            {/* Interactive Form (Cols 6-12) */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  Send a Direct Message
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Fill in your details below and an Edmonton team member will contact you.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

  