import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand disabled:opacity-50 disabled:pointer-events-none text-center cursor-pointer';

  const variants = {
    primary:
      'bg-brand text-white hover:bg-brand-hover border border-brand shadow-xs rounded-lg',
    secondary:
      'bg-white text-brand hover:bg-red-50 border border-brand rounded-lg',
    outline:
      'bg-white text-brand hover:bg-red-50 border border-brand rounded-lg',
    ghost:
      'bg-transparent text-ink hover:bg-surface border border-transparent rounded-lg',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 tracking-wide',
    md: 'text-sm px-5 py-2.5 gap-2 tracking-normal',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-medium',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
