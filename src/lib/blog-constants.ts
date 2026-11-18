export const BLOG_CATEGORIES = [
  'Permits & Regulations',
  'Sign Design Tips',
  'Materials & Durability',
  'Business & ROI',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_PAGE_SIZE = 9;

/** Map legacy / alternate category labels onto the four public nav categories. */
export function normalizeBlogCategory(category: string): string {
  const value = (category || '').trim();
  if (!value) return BLOG_CATEGORIES[0];

  if (/permit|regulation|bylaw/i.test(value)) return BLOG_CATEGORIES[0];
  if (/design/i.test(value)) return BLOG_CATEGORIES[1];
  if (/material|durability|engineering|maintenance/i.test(value)) return BLOG_CATEGORIES[2];
  if (/business|roi|strategy/i.test(value)) return BLOG_CATEGORIES[3];

  const exact = BLOG_CATEGORIES.find((c) => c.toLowerCase() === value.toLowerCase());
  return exact || value;
}

export function slugifyBlogTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Estimate reading time from HTML or plain text (~220 wpm). */
export function estimateReadTime(content: string): string {
  const text = (content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text ? text.split(' ').length : 0;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}
