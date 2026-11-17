'use client';

import React, { useEffect, useRef } from 'react';
import {
  Bold,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
} from 'lucide-react';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value || '');
}

function plainTextToHtml(value: string) {
  const blocks = value
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) return '<p></p>';

  return blocks
    .map((block) => {
      if (block.startsWith('### ')) return `<h3>${block.slice(4)}</h3>`;
      if (block.startsWith('## ')) return `<h2>${block.slice(3)}</h2>`;
      if (block.split('\n').every((line) => line.trim().startsWith('- '))) {
        const items = block
          .split('\n')
          .map((line) => `<li>${line.replace(/^\s*-\s*/, '')}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your article…',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastExternal = useRef<string>('');

  useEffect(() => {
    if (!editorRef.current) return;
    const html = looksLikeHtml(value) ? value || '<p></p>' : plainTextToHtml(value || '');
    if (html === lastExternal.current) return;
    lastExternal.current = html;
    if (editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [value]);

  const emitChange = () => {
    const html = editorRef.current?.innerHTML || '';
    lastExternal.current = html;
    onChange(html);
  };

  const run = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emitChange();
  };

  const insertLink = () => {
    const url = window.prompt('Enter link URL (https://…)');
    if (!url) return;
    run('createLink', url);
  };

  const insertImage = () => {
    const url = window.prompt('Enter image URL');
    if (!url) return;
    run('insertImage', url);
  };

  const toolbarBtn =
    'inline-flex h-8 w-8 items-center justify-center rounded-xs border border-neutral-200 text-neutral-700 hover:bg-neutral-50 cursor-pointer';

  return (
    <div className="overflow-hidden rounded-xs border border-neutral-300">
      <div className="flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 p-2">
        <button type="button" className={toolbarBtn} title="Paragraph" onClick={() => run('formatBlock', 'p')}>
          <Pilcrow className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={toolbarBtn} title="Heading 2" onClick={() => run('formatBlock', 'h2')}>
          <Heading2 className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={toolbarBtn} title="Heading 3" onClick={() => run('formatBlock', 'h3')}>
          <Heading3 className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={toolbarBtn} title="Bold" onClick={() => run('bold')}>
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={toolbarBtn} title="Italic" onClick={() => run('italic')}>
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={toolbarBtn} title="Bullet list" onClick={() => run('insertUnorderedList')}>
          <List className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={toolbarBtn} title="Numbered list" onClick={() => run('insertOrderedList')}>
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={toolbarBtn} title="Link" onClick={insertLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={toolbarBtn} title="Image" onClick={insertImage}>
          <ImageIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        className="min-h-[220px] max-h-[420px] overflow-y-auto bg-white px-3 py-3 text-sm leading-relaxed text-neutral-800 outline-none empty:before:pointer-events-none empty:before:text-neutral-400 empty:before:content-[attr(data-placeholder)] [&_a]:text-[#D40018] [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-bold [&_img]:my-3 [&_img]:max-h-64 [&_img]:rounded-xs [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
        onInput={emitChange}
        onBlur={emitChange}
      />
    </div>
  );
}
