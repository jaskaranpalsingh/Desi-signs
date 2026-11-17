'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ProjectItem } from '@/lib/types';

const easeOut = [0.22, 1, 0.36, 1] as const;

function ProjectImage({
  src,
  alt,
  className = '',
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const isLocal = src.startsWith('/');
  if (isLocal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-cover ${className}`}
      priority={priority}
    />
  );
}

function pickFeatured(projects: ProjectItem[]): ProjectItem | null {
  if (!projects.length) return null;
  const featured = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
  return featured[0] || projects[0] || null;
}

export function FeaturedProjectsSection({ projects = [] }: { projects?: ProjectItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const show = inView || Boolean(reduceMotion);

  const published = projects.filter((p) => p.published !== false);
  const featured = pickFeatured(published);
  const gridProjects = featured
    ? published.filter((p) => p.id !== featured.id).slice(0, 3)
    : published.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      className="border-b border-[#E5E7EB] bg-white"
      aria-labelledby="recent-work-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Clean header */}
        <motion.div
          className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-3">
              <span aria-hidden className="h-px w-7 bg-[#DC1421]" />
              <p className="text-[11px] font-bold tracking-[0.18em] text-[#DC1421] uppercase">
                Portfolio
              </p>
            </div>
            <h2
              id="recent-work-heading"
              className="text-[clamp(1.85rem,3.2vw,2.6rem)] font-bold tracking-tight text-[#111111]"
            >
              Our Recent Work
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#596579] sm:text-base">
              Latest signage projects across Edmonton and nearby areas.
            </p>
          </div>

          <Link
            href="/projects"
            className="group inline-flex w-fit items-center gap-2 rounded-lg bg-[#DC1421] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B80F1D]"
          >
            View Complete Portfolio
            <ArrowRight
              className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </motion.div>

        {published.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA] px-6 py-14 text-center text-sm text-[#596579]">
            Portfolio projects will appear here once they are published in the admin panel.
          </div>
        ) : (
          <div className="space-y-8 lg:space-y-10">
            {/* Featured — clean split, text never over the photo */}
            {featured ? (
              <motion.article
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={show ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.08, ease: easeOut }}
                className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#111111] shadow-[0_12px_32px_rgba(17,17,17,0.06)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <Link
                    href={`/projects/${featured.slug}`}
                    className="group relative min-h-[240px] overflow-hidden sm:min-h-[300px] lg:min-h-[380px]"
                  >
                    <ProjectImage
                      src={featured.image}
                      alt={featured.title}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="transition-transform duration-600 ease-out group-hover:scale-[1.03]"
                      priority
                    />
                  </Link>

                  <div className="flex flex-col justify-center px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
                    <p className="text-[11px] font-bold tracking-[0.16em] text-[#DC1421] uppercase">
                      Featured Project
                    </p>
                    <h3 className="mt-3 text-[clamp(1.4rem,2.2vw,1.85rem)] font-bold leading-snug tracking-tight">
                      {featured.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-[15px]">
                      {featured.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50">
                      <span>{featured.category}</span>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" aria-hidden />
                        {featured.location}
                      </span>
                      {featured.year ? (
                        <>
                          <span aria-hidden>·</span>
                          <span>{featured.year}</span>
                        </>
                      ) : null}
                    </div>
                    <Link
                      href={`/projects/${featured.slug}`}
                      className="group mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-[#DC1421] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B80F1D]"
                    >
                      View Case Study
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ) : null}

            {/* Supporting projects — equal clean cards */}
            {gridProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {gridProjects.map((project, index) => (
                  <motion.article
                    key={project.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                    animate={show ? { opacity: 1, y: 0 } : undefined}
                    transition={{
                      duration: 0.45,
                      delay: reduceMotion ? 0 : 0.16 + index * 0.08,
                      ease: easeOut,
                    }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_6px_20px_rgba(17,17,17,0.04)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#DC1421]/30 hover:shadow-[0_14px_28px_rgba(220,20,33,0.1)]"
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="relative aspect-[16/10] overflow-hidden bg-[#F3F4F6]"
                    >
                      <ProjectImage
                        src={project.image}
                        alt={project.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold tracking-wider text-[#6B7280] uppercase">
                        <span>{project.category}</span>
                        {project.year ? (
                          <>
                            <span aria-hidden className="text-[#D1D5DB]">
                              |
                            </span>
                            <span>{project.year}</span>
                          </>
                        ) : null}
                      </div>

                      <h3 className="mt-2.5 text-[17px] font-bold leading-snug tracking-tight text-[#111111]">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="transition-colors hover:text-[#DC1421]"
                        >
                          {project.title}
                        </Link>
                      </h3>

                      <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#6B7280]">
                        <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                        {project.location}
                      </p>

                      <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[#596579]">
                        {project.summary}
                      </p>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#DC1421] transition-colors hover:text-[#B80F1D]"
                      >
                        Read Case Study
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-250 group-hover:translate-x-1"
                          aria-hidden
                        />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
