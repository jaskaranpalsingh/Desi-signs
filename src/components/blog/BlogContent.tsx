import React from 'react';
import { looksLikeHtml, sanitizeBlogHtml } from '@/lib/sanitize';

function renderPlainContent(content: string) {
  return content.split('\n\n').map((paragraph, index) => {
    const clean = paragraph.trim();
    if (!clean) return null;

    if (clean.startsWith('### ')) {
      return (
        <h3
          key={index}
          className="mt-6 border-t border-neutral-100 pt-4 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl"
        >
          {clean.replace('### ', '')}
        </h3>
      );
    }

    if (clean.startsWith('## ')) {
      return (
        <h2
          key={index}
          className="mt-6 border-t border-neutral-100 pt-4 text-2xl font-bold tracking-tight text-neutral-900"
        >
          {clean.replace('## ', '')}
        </h2>
      );
    }

    if (clean.startsWith('- ')) {
      const listItems = clean.split('\n').filter((l) => l.startsWith('- '));
      return (
        <ul key={index} className="list-disc space-y-2 pl-5 text-neutral-700">
          {listItems.map((item, idx) => (
            <li key={idx}>{item.replace('- ', '')}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="text-base leading-relaxed text-neutral-700">
        {clean}
      </p>
    );
  });
}

export function BlogContent({ content }: { content: string }) {
  if (looksLikeHtml(content)) {
    const safe = sanitizeBlogHtml(content);
    return (
      <div
        className="blog-content space-y-4 text-base leading-relaxed text-neutral-700 [&_a]:font-medium [&_a]:text-[#D40018] [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-neutral-900 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-neutral-900 [&_img]:my-6 [&_img]:max-h-[480px] [&_img]:w-full [&_img]:rounded-xs [&_img]:object-cover [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }

  return <div className="space-y-6 text-base leading-relaxed text-neutral-800">{renderPlainContent(content)}</div>;
}
