import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, MapPin, Calendar, Building2 } from 'lucide-react';
import { getPublishedProjects } from '@/lib/data-store';
import { constructMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = constructMetadata({
  title: 'Commercial Signage Portfolio & Case Studies Edmonton | Desi Signs',
  description:
    'Review in-depth commercial signage case studies in Edmonton. Front-lit and halo-lit letters, pylon monuments, and storefront fascias built by Desi Signs.',
  canonicalUrl: '/projects',
});

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="border-b border-neutral-200 bg-neutral-50/50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Portfolio' }]} />
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
              Case Studies & Portfolio
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              Featured Commercial Projects
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Explore how we solved complex engineering, architectural, and municipal zoning challenges for businesses throughout Edmonton and surrounding Alberta municipalities.
            </p>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className="border border-neutral-200 rounded-xs overflow-hidden bg-white hover:border-neutral-300 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  <div className="relative min-h-[320px] bg-neutral-100 aspect-[16/10] lg:col-span-6 lg:aspect-auto">
                    {project.image.startsWith('/') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    )}
                    <div className="absolute top-4 left-4 rounded-xs border border-neutral-200 bg-white/95 px-3 py-1 text-xs font-semibold text-neutral-900">
                      Case Study 0{idx + 1}
                    </div>
                  </div>

                  <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mb-2">
                        <span className="uppercase tracking-wider font-semibold text-neutral-800">
                          {project.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {project.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {project.year}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                        <Link href={`/projects/${project.slug}`} className="hover:text-neutral-700 transition-colors">
                          {project.title}
                        </Link>
                      </h2>

                      <p className="mt-1 text-xs font-medium text-neutral-500 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> Client: {project.client}
                      </p>

                      <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                        {project.summary}
                      </p>

                      {/* Materials Badges */}
                      {project.materialsUsed.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-neutral-100">
                          <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
                            Key Materials & Finishes:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {project.materialsUsed.map((m, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-xs text-xs text-neutral-700"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors"
                      >
                        Read Engineering Case Study <ArrowRight className="ml-1.5 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

