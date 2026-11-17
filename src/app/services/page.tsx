import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, CheckCircle2, Shield, Wrench } from 'lucide-react';
import { getServices } from '@/lib/data-store';
import { constructMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = constructMetadata({
  title: 'Commercial Signage Services Edmonton | Turnkey Fabrication & Permits',
  description:
    'Explore our comprehensive commercial signage capabilities in Edmonton, AB. Channel letters, storefront fascias, 3D architectural letters, pylon monuments, and interior reception signage.',
  canonicalUrl: '/services',
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header Banner */}
      <section className="border-b border-neutral-200 bg-neutral-50/50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Services' }]} />
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
              Capabilities & Craftsmanship
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              Architectural & Commercial Signage Services
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              From laser site surveys and municipal permit approvals under Edmonton Bylaw 12800 to automated CNC fabrication and certified crane installations. Every sign is engineered specifically for Alberta’s extreme climate.
            </p>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className="border border-neutral-200 rounded-xs overflow-hidden bg-white hover:border-neutral-300 transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                    {/* Image Column */}
                    <div
                      className={`lg:col-span-6 relative aspect-16/10 lg:aspect-auto min-h-[300px] bg-neutral-100 ${
                        isEven ? 'lg:order-2' : ''
                      }`}
                    >
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-xs text-xs font-semibold text-neutral-900 border border-neutral-200">
                        Capability 0{index + 1}
                      </div>
                    </div>

                    {/* Content Column */}
                    <div
                      className={`lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6 ${
                        isEven ? 'lg:order-1' : ''
                      }`}
                    >
                      <div>
                        <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">
                          Commercial Service
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                          {service.title}
                        </h2>
                        {service.subtitle && (
                          <p className="text-sm font-medium text-neutral-700 mt-1">
                            {service.subtitle}
                          </p>
                        )}
                        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                          {service.shortDescription}
                        </p>

                        {/* Key Features */}
                        <div className="mt-6 border-t border-neutral-100 pt-5">
                          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
                            Key Specifications & Features:
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {service.features.slice(0, 4).map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center text-sm font-semibold text-neutral-900 hover:text-neutral-700 transition-colors"
                        >
                          Detailed Specifications & Gallery <ArrowRight className="ml-1.5 w-4 h-4" />
                        </Link>
                        <Button href={`/quote?service=${encodeURIComponent(service.title)}`} size="sm" variant="outline">
                          Request Estimate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Signage Comparison Matrix */}
      <section className="py-16 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Specification Comparison"
            title="Commercial Signage Engineering Matrix"
            description="Compare illumination methods, mounting requirements, and municipal landlord criteria across our primary systems."
          />

          <div className="border border-neutral-200 rounded-xs overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Sign Classification</th>
                  <th className="py-3.5 px-4">Illumination Method</th>
                  <th className="py-3.5 px-4">Mounting Architecture</th>
                  <th className="py-3.5 px-4">Landlord Acceptance</th>
                  <th className="py-3.5 px-4">Alberta Winter Rating</th>
                  <th className="py-3.5 px-4 text-right">Lead Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                <tr className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900">
                    Front-Lit Channel Letters
                  </td>
                  <td className="py-3.5 px-4">Direct Face-Lit Samsung IP68 LED</td>
                  <td className="py-3.5 px-4">Direct Flush Pin or Slim Raceway</td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-700 font-semibold">Universal (Mandatory)</span>
                  </td>
                  <td className="py-3.5 px-4">-45°C Tested</td>
                  <td className="py-3.5 px-4 text-right font-medium">2 to 3 weeks</td>
                </tr>
                <tr className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900">
                    Reverse Halo-Lit Letters
                  </td>
                  <td className="py-3.5 px-4">Silhouette Backlit Ambient (3000K)</td>
                  <td className="py-3.5 px-4">Floating Standoff Spacers (1/2" to 2")</td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-700 font-semibold">High (Upscale Retail)</span>
                  </td>
                  <td className="py-3.5 px-4">-45°C Tested</td>
                  <td className="py-3.5 px-4 text-right font-medium">2 to 3 weeks</td>
                </tr>
                <tr className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900">
                    Push-Through Acrylic Lightbox
                  </td>
                  <td className="py-3.5 px-4">Internal Edge & Face Acrylic Glow</td>
                  <td className="py-3.5 px-4">Structural Welded Aluminum Frame</td>
                  <td className="py-3.5 px-4">
                    <span className="text-neutral-800 font-semibold">Moderate to High</span>
                  </td>
                  <td className="py-3.5 px-4">-45°C Tested</td>
                  <td className="py-3.5 px-4 text-right font-medium">3 weeks</td>
                </tr>
                <tr className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900">
                    Pylon & Monument Signs
                  </td>
                  <td className="py-3.5 px-4">Dual-Sided High Output / EMC LED</td>
                  <td className="py-3.5 px-4">Engineered Reinforced Concrete Piles</td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-700 font-semibold">Plazas & Campuses</span>
                  </td>
                  <td className="py-3.5 px-4">135 km/h Wind Rated</td>
                  <td className="py-3.5 px-4 text-right font-medium">4 to 6 weeks</td>
                </tr>
                <tr className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900">
                    3D Architectural Letters
                  </td>
                  <td className="py-3.5 px-4">Non-Illuminated (External Spotlights)</td>
                  <td className="py-3.5 px-4">Threaded Rear Studs / VHB Cleats</td>
                  <td className="py-3.5 px-4">
                    <span className="text-neutral-800 font-semibold">Executive & Corporate</span>
                  </td>
                  <td className="py-3.5 px-4">Lifetime Structural</td>
                  <td className="py-3.5 px-4 text-right font-medium">10 to 14 days</td>
                </tr>
                <tr className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900">
                    Custom LED Neon Art
                  </td>
                  <td className="py-3.5 px-4">Flexible Silicone Low-Voltage LED</td>
                  <td className="py-3.5 px-4">Laser Standoffs / Interior Drywall</td>
                  <td className="py-3.5 px-4">
                    <span className="text-neutral-800 font-semibold">Hospitality & Studios</span>
                  </td>
                  <td className="py-3.5 px-4">Interior / Dry Rated</td>
                  <td className="py-3.5 px-4 text-right font-medium">7 to 10 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust & Permitting Standards */}
      <section className="py-16 bg-neutral-50/50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Compliance & Quality"
            title="Our Municipal & Manufacturing Standards"
            description="We build to exceed Canadian Electrical Code (CSA C22.1) and City of Edmonton engineering guidelines."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-neutral-200 rounded-xs">
              <Shield className="w-6 h-6 text-neutral-900 mb-3" />
              <h3 className="text-base font-semibold text-neutral-900">UL & CSA Electrical Safety</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                All transformers and LED circuits are UL/cUL listed, Class 2 certified, ensuring compliance with fire and electrical safety codes.
              </p>
            </div>
            <div className="p-6 bg-white border border-neutral-200 rounded-xs">
              <Wrench className="w-6 h-6 text-neutral-900 mb-3" />
              <h3 className="text-base font-semibold text-neutral-900">Extreme Winter Rating</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Tested down to -45°C with IP68 siliconized sealants and condensation drainage weeping holes that prevent freezing expansion.
              </p>
            </div>
            <div className="p-6 bg-white border border-neutral-200 rounded-xs">
              <CheckCircle2 className="w-6 h-6 text-neutral-900 mb-3" />
              <h3 className="text-base font-semibold text-neutral-900">Permit Guarantee</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                We coordinate site plan elevations, structural engineer stamps, and development permit filings with city planners directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

