import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowRight, Check, ShieldCheck, MapPin, Building, ArrowLeft } from 'lucide-react';
import { getServices, getServiceBySlug } from '@/lib/data-store';
import { constructMetadata, getServiceSchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: 'Service Not Found' };

  return constructMetadata({
    title: service.metaTitle || service.title,
    description: service.metaDescription || service.shortDescription,
    image: service.image,
    canonicalUrl: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const allServices = await getServices();
  const otherServices = allServices.filter((s) => s.id !== service.id).slice(0, 3);
  const jsonLd = getServiceSchema(service);

  return (
    <article className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Breadcrumbs & Intro */}
      <section className="bg-neutral-50/50 border-b border-neutral-200 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Services', href: '/services' },
              { label: service.title },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2 block">
                Signage Capability
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
                {service.title}
              </h1>
              {service.subtitle && (
                <p className="mt-3 text-lg text-neutral-600 font-normal">
                  {service.subtitle}
                </p>
              )}
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Button href={`/quote?service=${encodeURIComponent(service.title)}`} size="md" variant="primary">
                Get a Quote for this Sign
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Specs Grid */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left 7 Columns: Image & Editorial Narrative */}
            <div className="lg:col-span-7 space-y-10">
              {/* Primary Image */}
              <div className="relative aspect-16/10 w-full rounded-xs overflow-hidden border border-neutral-200 bg-neutral-100 shadow-xs">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>

              {/* Narrative Content */}
              <div className="space-y-6 text-neutral-700 leading-relaxed text-base">
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  Engineering Overview & Application
                </h2>
                <p className="leading-relaxed whitespace-pre-line text-neutral-600">
                  {service.fullDescription}
                </p>
              </div>

              {/* Sub-gallery images */}
              {service.galleryImages && service.galleryImages.length > 1 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                    Fabrication & Installation Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {service.galleryImages.slice(1, 3).map((imgUrl, i) => (
                      <div
                        key={i}
                        className="relative aspect-4/3 rounded-xs overflow-hidden border border-neutral-200 bg-neutral-100"
                      >
                        <Image
                          src={imgUrl}
                          alt={`${service.title} detail ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 30vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials & Applications Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
                    Architectural Materials:
                  </h4>
                  <ul className="space-y-1.5">
                    {service.materials.map((m, i) => (
                      <li key={i} className="text-xs text-neutral-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 shrink-0"></span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
                    Typical Applications:
                  </h4>
                  <ul className="space-y-1.5">
                    {service.applications.map((app, i) => (
                      <li key={i} className="text-xs text-neutral-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 shrink-0"></span>
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Technical Specifications Table & Direct Inquiry */}
            <div className="lg:col-span-5 space-y-8">
              {/* Technical Specs Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xs p-6 sm:p-8 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                    Engineering Data
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                    Technical Specifications
                  </h3>
                </div>

                <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                  {service.specifications.map((spec, i) => (
                    <div key={i} className="py-3 flex items-start justify-between gap-4 text-xs">
                      <span className="font-medium text-neutral-500">{spec.label}</span>
                      <span className="font-semibold text-neutral-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
                    Included in our Turnkey Package:
                  </div>
                  <ul className="space-y-2.5">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                        <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Button
                    href={`/quote?service=${encodeURIComponent(service.title)}`}
                    size="md"
                    variant="primary"
                    className="w-full justify-center"
                  >
                    Request Project Estimate
                  </Button>
                </div>
              </div>

              {/* Local Permit Callout */}
              <div className="p-6 bg-white border border-neutral-200 rounded-xs space-y-3">
                <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-neutral-800" />
                  <span>City of Edmonton Permitting Included</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Our engineering team produces stamped structural drawings and development permit documentation for City of Edmonton Bylaw 12800 compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services Navigation */}
      <section className="py-14 border-t border-neutral-200 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
              Other Signage Capabilities
            </h3>
            <Link
              href="/services"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-neutral-900"
            >
              View All Services →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherServices.map((other) => (
              <Link
                key={other.id}
                href={`/services/${other.slug}`}
                className="bg-white border border-neutral-200 p-5 rounded-xs hover:border-neutral-400 transition-colors group flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-base font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                    {other.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-neutral-600 line-clamp-2">
                    {other.shortDescription}
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-neutral-900 flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

