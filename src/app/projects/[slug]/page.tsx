import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowRight, MapPin, Calendar, Building2, CheckCircle, ArrowLeft } from 'lucide-react';
import { getPublishedProjects, getProjectBySlug } from '@/lib/data-store';
import { constructMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  return constructMetadata({
    title: `${project.title} | Desi Signs Case Study`,
    description: project.summary,
    image: project.image,
    canonicalUrl: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getPublishedProjects();
  const otherProjects = allProjects.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <article className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-neutral-50/50 border-b border-neutral-200 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Portfolio', href: '/projects' },
              { label: project.title },
            ]}
          />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">
                <span>{project.category}</span>
                <span>•</span>
                <span>{project.year}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
                {project.title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-neutral-600 font-normal max-w-2xl">
                {project.summary}
              </p>
            </div>
            <Button
              href="/quote"
              size="lg"
              variant="primary"
            >
              Discuss a Similar Project
            </Button>
          </div>
        </div>
      </section>

      {/* Main Case Study */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Main Narrative */}
            <div className="lg:col-span-8 space-y-12">
              {/* Main Photo */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs border border-neutral-200 bg-neutral-100 shadow-xs">
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
                    priority
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="object-cover"
                  />
                )}
              </div>

              {/* Challenge Section */}
              <div className="space-y-4">
                <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Phase 1: Project Scope
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  The Client’s Architectural Challenge
                </h2>
                <p className="text-neutral-700 leading-relaxed text-base sm:text-lg">
                  {project.challenge}
                </p>
              </div>

              {/* Solution Section */}
              <div className="space-y-4 pt-6 border-t border-neutral-100">
                <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                  Phase 2: Fabrication & Execution
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  Our Engineering & Permitting Solution
                </h2>
                <p className="text-neutral-700 leading-relaxed text-base sm:text-lg">
                  {project.solution}
                </p>
              </div>

              {/* Additional Photos */}
              {project.additionalImages && project.additionalImages.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-neutral-100">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                    Installation & Photometric Results
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.additionalImages.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-4/3 overflow-hidden rounded-xs border border-neutral-200 bg-neutral-100"
                      >
                        {img.startsWith('/') ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img}
                            alt={`${project.title} photo ${i + 1}`}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <Image
                            src={img}
                            alt={`${project.title} photo ${i + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 35vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Facts */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xs p-6 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                    Project Overview
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    Project Specifications
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm divide-y divide-neutral-200">
                  <div className="pt-2">
                    <span className="text-neutral-500 block text-xs">Client Name</span>
                    <strong className="text-neutral-900 font-semibold block mt-0.5">{project.client}</strong>
                  </div>
                  <div className="pt-3">
                    <span className="text-neutral-500 block text-xs">Project Location</span>
                    <strong className="text-neutral-900 font-semibold block mt-0.5">{project.location}</strong>
                  </div>
                  <div className="pt-3">
                    <span className="text-neutral-500 block text-xs">Signage Classification</span>
                    <strong className="text-neutral-900 font-semibold block mt-0.5">{project.category}</strong>
                  </div>
                  <div className="pt-3">
                    <span className="text-neutral-500 block text-xs">Completion Year</span>
                    <strong className="text-neutral-900 font-semibold block mt-0.5">{project.year}</strong>
                  </div>
                </div>

                {project.materialsUsed.length > 0 && (
                  <div className="pt-2 border-t border-neutral-200">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 block mb-2.5">
                      Materials & Hardware:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.materialsUsed.map((m, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-white border border-neutral-200 rounded-xs text-xs text-neutral-700"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button href="/quote" size="md" variant="primary" className="w-full justify-center">
                    Request a Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="py-14 border-t border-neutral-200 bg-neutral-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight mb-8">
              Explore More Case Studies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherProjects.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  className="bg-white border border-neutral-200 p-6 rounded-xs hover:border-neutral-400 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                      {item.category} • {item.location}
                    </span>
                    <h4 className="text-lg font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors mt-1">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-semibold text-neutral-900 flex items-center gap-1">
                    Read Case Study <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

