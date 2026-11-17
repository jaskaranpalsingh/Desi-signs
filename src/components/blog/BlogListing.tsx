'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { BlogPostItem } from '@/lib/types';
import { BLOG_PAGE_SIZE } from '@/lib/blog-constants';

export function BlogListing({
  blogs,
  selectedCategory,
}: {
  blogs: BlogPostItem[];
  selectedCategory?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(BLOG_PAGE_SIZE);

  const visibleBlogs = useMemo(
    () => blogs.slice(0, visibleCount),
    [blogs, visibleCount],
  );

  const hasMore = visibleCount < blogs.length;

  if (blogs.length === 0) {
    return (
      <div className="rounded-xl border border-[#E8EAED] bg-[#F8F9FA] px-5 py-10 text-center">
        <p className="text-sm font-semibold text-[#111827]">
          {selectedCategory
            ? `No published articles in “${selectedCategory}” yet.`
            : 'No published articles yet.'}
        </p>
        <p className="mt-2 text-sm text-[#596579]">
          New DESI SIGNS insights will appear here once they are published from the admin panel.
        </p>
        {selectedCategory && (
          <Link
            href="/blog#articles"
            className="mt-4 inline-flex text-sm font-semibold text-[#D40018] hover:text-[#A80000]"
          >
            View all articles
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleBlogs.map((blog) => (
          <article
            key={blog.id}
            className="group flex flex-col justify-between overflow-hidden rounded-xs border border-neutral-200 bg-white shadow-xs transition-colors hover:border-neutral-400"
          >
            <div>
              <Link
                href={`/blog/${blog.slug}`}
                className="relative block aspect-16/10 w-full overflow-hidden bg-neutral-100"
              >
                {blog.image ? (
                  <Image
                    src={blog.image}
                    alt={blog.imageAlt || blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#F8F9FA] via-white to-[#FDECEE] p-5">
                    <span className="inline-flex w-fit rounded-xs border border-[#F2C4C9] bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#D40018]">
                      {blog.category}
                    </span>
                    <p className="line-clamp-3 text-lg font-bold leading-snug text-[#111827]">
                      {blog.title}
                    </p>
                  </div>
                )}
                {blog.image && (
                  <div className="absolute top-3 left-3 rounded-xs border border-neutral-200 bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-900">
                    {blog.category}
                  </div>
                )}
              </Link>

              <div className="space-y-3 p-6">
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                    {new Date(blog.publishedDate).toLocaleDateString('en-CA', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    {blog.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-700">
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h2>

                <p className="line-clamp-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  {blog.shortDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 px-6 pt-3 pb-6">
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-500">
                <User className="h-3.5 w-3.5 text-neutral-400" /> {blog.author || 'Desi Signs'}
              </span>
              <Link
                href={`/blog/${blog.slug}`}
                className="flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-600"
              >
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + BLOG_PAGE_SIZE)}
            className="cursor-pointer rounded-xs border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-500 hover:bg-neutral-50"
          >
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
}
