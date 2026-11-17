import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-12 ${align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'} ${className}`}
    >
      {eyebrow && (
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-ink leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3.5 text-base sm:text-lg text-ink-muted leading-relaxed font-normal">
          {description}
        </p>
      )}
    </div>
  );
}

