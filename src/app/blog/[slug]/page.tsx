import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { constructMetadata, getArticleSchema } from '@/lib/seo';
import { BlogArticleView } from '@/components/blog/BlogArticleView';
import {
  getPublishedBlogBySlugForSite,
  getPublishedBlogsForSite,
} from '@/lib/blog-server';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlugForSite(slug);
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
  const blog = await getPublishedBlogBySlugForSite(slug);

  if (!blog) {
    notFound();
  }

  const allBlogs = await getPublishedBlogsForSite();
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

  const publishedLabel = new Date(blog.publishedDate).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogArticleView
        blog={blog}
        relatedBlogs={relatedBlogs}
        publishedLabel={publishedLabel}
      />
    </>
  );
}
