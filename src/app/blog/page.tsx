import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getBlogs } from '@/lib/data-store';
import { constructMetadata } from '@/lib/seo';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogListing } from '@/components/blog/BlogListing';
import { BLOG_CATEGORIES } from '@/lib/blog-constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = constructMetadata({
  title: 'Signage Insights, Bylaws & Engineering Guides | Desi Signs Edmonton',
  description:
    'Expert advice on Edmonton commercial sign permits, Bylaw 12800, storefront branding ROI, and sub-zero winter signage durability in Alberta.',
  canonicalUrl: '/blog',
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category: categoryParam } = await searchParams;
  const selectedCategory = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;

  const blogs = await getBlogs({ publishedOnly: true });
  const availableCategories = Array.from(
    new Set([
      ...BLOG_CATEGORIES,
      ...blogs.map((blog) => blog.category).filter(Boolean),
    ]),
  );

  const visibleBlogs = selectedCategory
    ? blogs.filter((blog) => blog.category.toLowerCase() === selectedCategory.toLowerCase())
    : blogs;

  return (
    <div className="min-h-screen bg-white">
      <BlogHero availableCategories={availableCategories} />

      <section id="articles" className="scroll-mt-24 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {selectedCategory && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#596579]">
                Showing articles in{' '}
                <span className="font-semibold text-[#111827]">{selectedCategory}</span>
              </p>
              <Link
                href="/blog#articles"
                className="text-sm font-semibold text-[#D40018] transition-colors hover:text-[#A80000]"
              >
                View all articles
              </Link>
            </div>
          )}

          <BlogListing blogs={visibleBlogs} selectedCategory={selectedCategory} />
        </div>
      </section>
    </div>
  );
}
