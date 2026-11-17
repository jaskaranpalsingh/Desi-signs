import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'accent';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    outline: 'bg-white text-neutral-700 border-neutral-300',
    accent: 'bg-brand text-white border-brand',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-xs text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

