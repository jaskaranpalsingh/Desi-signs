import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { getBlogs, getBlogBySlug } from '@/lib/data-store';
import { constructMetadata, getArticleSchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { BlogContent } from '@/components/blog/BlogContent';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug, { publishedOnly: true });
  if (!blog) return { title: 'Article Not Found' };

  const canonical =
    blog.canonicalUrl && blog.canonicalUrl.trim()
      ? blog.canonicalUrl
      : `/blog/${blog.slug}`;

  return constructMetadata({
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.shortDescription,
    image: blog.image || undefined,
    canonicalUrl: canonical,
  });
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug, { publishedOnly: true });

  if (!blog) {
    notFound();
  }

  const allBlogs = await getBlogs({ publishedOnly: true });
  const relatedBlogs = allBlogs
    .filter((b) => b.id !== blog.id)
    .sort((a, b) => {
      const aSame = a.category === blog.category ? 0 : 1;
      const bSame = b.category === blog.category ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, 2);

  const articleJsonLd = getArticleSchema({
    title: blog.title,
    description: blog.shortDescription,
    slug: blog.slug,
    publishedDate: blog.publishedDate,
    author: blog.author || 'Desi Signs',
    image: blog.image || undefined,
  });

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <section className="border-b border-neutral-200 bg-neutral-50/50 py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: blog.title }]} />

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              <Link
                href={`/blog?category=${encodeURIComponent(blog.category)}#articles`}
                className="rounded-xs bg-neutral-200/80 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-neutral-800 uppercase hover:bg-neutral-300"
              >
                {blog.category}
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                {new Date(blog.publishedDate).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                {blog.readTime}
              </span>
            </div>

            <h1 className="text-3xl leading-tight font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>

            <p className="text-base leading-relaxed font-normal text-neutral-600 sm:text-lg">
              {blog.shortDescription}
            </p>

            {(blog.author || blog.authorRole) && (
              <div className="flex items-center gap-3 pt-2 text-xs text-neutral-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                  {(blog.author || 'D').charAt(0)}
                </div>
                <div>
                  <strong className="block font-semibold text-neutral-900">
                    {blog.author || 'Desi Signs'}
                  </strong>
                  {blog.authorRole && <span className="text-neutral-500">{blog.authorRole}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl space-y-10 px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>

          {blog.image ? (
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-xs border border-neutral-200 bg-neutral-100 shadow-xs">
              <Image
                src={blog.image}
                alt={blog.imageAlt || blog.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          ) : null}

          <BlogContent content={blog.content} />

          {blog.tags.length > 0 && (
            <div className="border-t border-neutral-200 pt-6">
              <span className="mb-2.5 block text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                Related Topics:
              </span>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-xs border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col items-start justify-between gap-6 rounded-xs border border-neutral-200 bg-neutral-50 p-8 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-neutral-900">
                Planning a new commercial sign in Edmonton?
              </h4>
              <p className="text-xs text-neutral-600 sm:text-sm">
                We provide preliminary permit assessments and itemized estimates at no charge.
              </p>
            </div>
            <Button href="/quote" size="md" variant="primary" className="shrink-0">
              Request Project Estimate
            </Button>
          </div>
        </div>
      </section>

      {relatedBlogs.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50/50 py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-neutral-900">Further Reading</h3>
              <Link
                href="/blog"
                className="text-xs font-semibold tracking-wider text-neutral-700 uppercase hover:text-neutral-900"
              >
                All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group flex flex-col justify-between rounded-xs border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400"
                >
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
                      {rel.category}
                    </span>
                    <h4 className="mt-1 text-base font-bold text-neutral-900 transition-colors group-hover:text-neutral-700">
                      {rel.title}
                    </h4>
                    <p className="mt-1.5 line-clamp-2 text-xs text-neutral-600">
                      {rel.shortDescription}
                    </p>
                  </div>
                  <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-neutral-900">
                    Read Article <ArrowRight className="h-3.5 w-3.5" />
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
