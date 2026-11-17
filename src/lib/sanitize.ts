/**
 * Lightweight HTML sanitizer for blog content (stored XSS protection).
 * Allows a safe subset of formatting tags used by the admin rich-text editor.
 */

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'blockquote',
  'code',
  'pre',
  'span',
  'div',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
  span: new Set(['class']),
  div: new Set(['class']),
  code: new Set(['class']),
  pre: new Set(['class']),
};

function isSafeUrl(value: string, allowDataImage = false): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  if (trimmed.startsWith('#')) return true;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^mailto:/i.test(trimmed)) return true;
  if (allowDataImage && /^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(trimmed)) return true;
  return false;
}

function sanitizeAttributes(tag: string, attrString: string): string {
  const allowed = ALLOWED_ATTRS[tag];
  if (!allowed || !attrString) return '';

  const parts: string[] = [];
  const attrRegex = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(attrString)) !== null) {
    const name = match[1].toLowerCase();
    if (!allowed.has(name)) continue;
    if (name.startsWith('on')) continue;

    const rawValue = match[2] ?? match[3] ?? match[4] ?? '';
    if (name === 'href' || name === 'src') {
      if (!isSafeUrl(rawValue, name === 'src')) continue;
      const safe = rawValue.replace(/"/g, '&quot;');
      parts.push(`${name}="${safe}"`);
      if (name === 'href' && /^https?:\/\//i.test(rawValue)) {
        parts.push('rel="noopener noreferrer"');
      }
      continue;
    }

    parts.push(`${name}="${rawValue.replace(/"/g, '&quot;')}"`);
  }

  return parts.length ? ` ${parts.join(' ')}` : '';
}

export function sanitizeBlogHtml(input: string): string {
  if (!input) return '';

  let html = input
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|form|input|button|textarea|select)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|form|input|button|textarea|select)[^>]*\/?\s*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');

  html = html.replace(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g, (full, rawTag: string, attrs = '') => {
    const tag = rawTag.toLowerCase();
    const isClosing = full.startsWith('</');
    if (!ALLOWED_TAGS.has(tag)) return '';
    if (isClosing) return `</${tag}>`;
    if (full.endsWith('/>') || tag === 'br' || tag === 'img') {
      return `<${tag}${sanitizeAttributes(tag, attrs)} />`;
    }
    return `<${tag}${sanitizeAttributes(tag, attrs)}>`;
  });

  return html.trim();
}

export function looksLikeHtml(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content || '');
}

/** Strip tags and control characters from plain-text form fields. */
export function sanitizePlainText(input: string, maxLength = 5000, allowNewlines = false): string {
  let value = String(input || '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

  if (allowNewlines) {
    value = value.replace(/[^\S\n]+/g, ' ').replace(/\n{3,}/g, '\n\n');
  } else {
    value = value.replace(/\s+/g, ' ');
  }

  return value.trim().slice(0, maxLength);
}
