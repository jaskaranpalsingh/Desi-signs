import type { BlogPostItem } from '@/lib/types';
import { getBlogBySlug, getBlogs } from '@/lib/data-store';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:4000';

/**
 * Public website blog reads prefer the Express API (same store admin writes to),
 * then fall back to the Next.js data-store / Mongo connection.
 */
export async function getPublishedBlogsForSite(options?: {
  category?: string;
}): Promise<BlogPostItem[]> {
  try {
    const params = new URLSearchParams({ limit: '100', page: '1' });
    if (options?.category) params.set('category', options.category);

    const res = await fetch(`${BACKEND_URL}/api/blogs?${params.toString()}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const json = (await res.json()) as {
        success?: boolean;
        data?: BlogPostItem[];
      };
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (error) {
    console.warn('getPublishedBlogsForSite API fallback:', error);
  }

  return getBlogs({
    publishedOnly: true,
    category: options?.category,
  });
}

export async function getPublishedBlogBySlugForSite(
  slug: string,
): Promise<BlogPostItem | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/blogs/${encodeURIComponent(slug)}`,
      { cache: 'no-store' },
    );

    if (res.status === 404) return null;

    if (res.ok) {
      const json = (await res.json()) as {
        success?: boolean;
        data?: BlogPostItem;
      };
      if (json.success && json.data) return json.data;
    }
  } catch (error) {
    console.warn('getPublishedBlogBySlugForSite API fallback:', error);
  }

  return getBlogBySlug(slug, { publishedOnly: true });
}
