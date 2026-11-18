'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { BlogPostItem } from '@/lib/types';
import { BlogContent } from '@/components/blog/BlogContent';

const easeOut = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

const lineDraw: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: easeOut, delay: 0.12 },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: easeOut },
  },
};

export function BlogArticleView({
  blog,
  relatedBlogs,
  publishedLabel,
}: {
  blog: BlogPostItem;
  relatedBlogs: BlogPostItem[];
  publishedLabel: string;
}) {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  const authorName = blog.author || 'Desi Signs';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article className="min-h-screen bg-white">
      <header className="bg-white">
        <motion.div
          className="mx-auto w-full max-w-[1030px] px-5 pt-12 pb-12 sm:px-8 sm:pt-14 sm:pb-14 lg:px-10 lg:pt-14 lg:pb-16"
          variants={animate ? stagger : undefined}
          initial={animate ? 'hidden' : false}
          animate="visible"
        >
          <motion.nav
            aria-label="Breadcrumb"
            className="mb-7 sm:mb-8"
            variants={animate ? fadeUp : undefined}
          >
            <ol className="flex min-w-0 items-center gap-2 text-[14px] leading-none">
              <li className="flex shrink-0 items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-[#98A2B3]" aria-hidden="true" />
                <Link
                  href="/"
                  className="text-[#667085] transition-colors duration-200 hover:text-[#111827]"
                >
                  Home
                </Link>
              </li>
              <li className="shrink-0 text-[#98A2B3]" aria-hidden="true">
                ›
              </li>
              <li className="shrink-0">
                <Link
                  href="/blog"
                  className="text-[#667085] transition-colors duration-200 hover:text-[#111827]"
                >
                  Blog
                </Link>
              </li>
              <li className="shrink-0 text-[#98A2B3]" aria-hidden="true">
                ›
              </li>
              <li className="min-w-0 truncate font-medium text-[#111827]" aria-current="page">
                {blog.title}
              </li>
            </ol>
          </motion.nav>

          <motion.div
            className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2.5 sm:mb-7 sm:gap-x-4"
            variants={animate ? fadeUp : undefined}
          >
            <Link
              href={`/blog?category=${encodeURIComponent(blog.category)}#articles`}
              className="inline-flex items-center rounded-[7px] bg-[#FDECEF] px-3 py-1.5 text-[13px] font-bold tracking-[0.06em] text-[#C90018] uppercase transition-colors duration-200 hover:bg-[#FAD7DD]"
            >
              {blog.category}
            </Link>

            <span
              className="hidden h-4 w-px bg-[#E5E7EB] sm:inline-block"
              aria-hidden="true"
            />

            <span className="inline-flex items-center gap-1.5 text-[14px] text-[#667085]">
              <Calendar className="h-3.5 w-3.5 stroke-[1.75] text-[#98A2B3]" aria-hidden="true" />
              {publishedLabel}
            </span>

            <span
              className="hidden h-4 w-px bg-[#E5E7EB] sm:inline-block"
              aria-hidden="true"
            />

            <span className="inline-flex items-center gap-1.5 text-[14px] text-[#667085]">
              <Clock className="h-3.5 w-3.5 stroke-[1.75] text-[#98A2B3]" aria-hidden="true" />
              {blog.readTime}
            </span>
          </motion.div>

          <motion.h1
            className="max-w-[18ch] text-[clamp(1.875rem,1.15rem+2.6vw,3.5rem)] font-extrabold leading-[1.12] tracking-[-0.035em] text-[#111827] sm:max-w-[22ch] lg:max-w-none lg:text-[56px]"
            variants={animate ? fadeUp : undefined}
          >
            {blog.title}
          </motion.h1>

          <motion.div
            className="mt-7 h-1 w-[70px] origin-left rounded-[2px] bg-[#DC001B] sm:mt-8"
            variants={animate ? lineDraw : undefined}
            aria-hidden="true"
          />

          <motion.p
            className="mt-7 max-w-[46rem] text-[17px] leading-[1.6] text-[#667085] sm:mt-8 sm:text-[20px] sm:leading-[1.6]"
            variants={animate ? fadeUp : undefined}
          >
            {blog.shortDescription}
          </motion.p>

          {(blog.author || blog.authorRole) && (
            <motion.div
              className="mt-8 border-t border-[#E5E7EB] pt-8 sm:mt-10 sm:pt-8"
              variants={animate ? fadeUp : undefined}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#DC001B] text-[17px] font-bold text-white"
                  aria-hidden="true"
                >
                  {authorInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold tracking-tight text-[#111827] sm:text-[16px]">
                    {authorName}
                  </p>
                  {blog.authorRole && (
                    <p className="mt-0.5 text-[13px] leading-snug text-[#667085] sm:text-[14px]">
                      {blog.authorRole}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </header>

      <section className="border-t border-[#E5E7EB] bg-white">
        <motion.div
          className="mx-auto w-full max-w-[1030px] space-y-10 px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
          variants={animate ? fadeIn : undefined}
          initial={animate ? 'hidden' : false}
          whileInView={animate ? 'visible' : undefined}
          viewport={{ once: true, amount: 0.08 }}
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-[14px] font-semibold text-[#667085] transition-colors duration-200 hover:text-[#DC001B]"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Blog
          </Link>

          <BlogContent content={blog.content} />

          {blog.tags.length > 0 && (
            <div className="border-t border-[#E5E7EB] pt-8">
              <p className="mb-3 text-[11px] font-bold tracking-[0.16em] text-[#98A2B3] uppercase">
                Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] font-medium text-[#344054] transition-colors duration-200 hover:border-[#F2C4C9] hover:bg-[#FDECEF]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <aside className="flex flex-col gap-5 border border-[#E5E7EB] bg-[#FAFBFC] px-6 py-7 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(16,24,40,0.06)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="max-w-md space-y-1.5">
              <h2 className="text-[17px] font-bold tracking-tight text-[#111827] sm:text-lg">
                Planning a new commercial sign in Edmonton?
              </h2>
              <p className="text-[14px] leading-relaxed text-[#667085]">
                Free preliminary permit assessment and itemized estimate for Alberta businesses.
              </p>
            </div>
            <Link
              href="/quote"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#DC001B] px-5 py-3 text-[14px] font-bold text-white transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#B80017]"
            >
              Request a Quote
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </aside>
        </motion.div>
      </section>

      {relatedBlogs.length > 0 && (
        <section className="border-t border-[#E5E7EB] bg-white py-12 sm:py-14">
          <div className="mx-auto w-full max-w-[1030px] px-5 sm:px-8 lg:px-10">
            <motion.div
              className="mb-7 flex items-end justify-between gap-4"
              variants={animate ? fadeUp : undefined}
              initial={animate ? 'hidden' : false}
              whileInView={animate ? 'visible' : undefined}
              viewport={{ once: true, amount: 0.4 }}
            >
              <h2 className="text-xl font-bold tracking-tight text-[#111827] sm:text-2xl">
                Related articles
              </h2>
              <Link
                href="/blog"
                className="text-[13px] font-semibold text-[#667085] transition-colors duration-200 hover:text-[#DC001B]"
              >
                All articles →
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
              variants={animate ? stagger : undefined}
              initial={animate ? 'hidden' : false}
              whileInView={animate ? 'visible' : undefined}
              viewport={{ once: true, amount: 0.15 }}
            >
              {relatedBlogs.map((rel) => (
                <motion.div key={rel.id} variants={animate ? fadeUp : undefined}>
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="group block border border-[#E5E7EB] bg-white p-5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#D0D5DD] hover:shadow-[0_10px_28px_rgba(16,24,40,0.06)]"
                  >
                    <span className="text-[11px] font-bold tracking-[0.12em] text-[#C90018] uppercase">
                      {rel.category}
                    </span>
                    <h3 className="mt-2 text-[15px] font-bold leading-snug tracking-tight text-[#111827] transition-colors group-hover:text-[#DC001B]">
                      {rel.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#667085]">
                      {rel.shortDescription}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#111827]">
                      Read article
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </article>
  );
}
