'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';

/** Intrinsic logo artwork size (all brand PNGs share this ratio). */
export const DESI_LOGO_INTRINSIC = { width: 1024, height: 341 } as const;

export type LogoVariant = 'light' | 'dark' | 'red' | 'gold' | 'auto';

export type LogoBackgroundHint =
  | 'light'
  | 'dark'
  | 'red'
  | 'gold'
  | 'white'
  | 'black'
  | 'grey'
  | 'gray'
  | (string & {});

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const LOGO_SRC: Record<Exclude<LogoVariant, 'auto'>, string> = {
  // Black + gold — for white / light grey backgrounds
  light: '/brand/desi-logo-light.png',
  // White + gold — for black / dark grey backgrounds
  dark: '/brand/desi-logo-dark.png',
  // White + gold — for red backgrounds
  red: '/brand/desi-logo-red.png',
  // Prefer black + red when supplied; currently black + gold placeholder
  gold: '/brand/desi-logo-gold.png',
};

const SIZE_CLASS: Record<LogoSize, string> = {
  // Width-driven so aspect ratio stays true (1024×341)
  sm: 'h-auto w-full max-w-[120px] sm:max-w-[135px]',
  md: 'h-auto w-full max-w-[145px] sm:max-w-[165px] lg:max-w-[190px]',
  lg: 'h-auto w-full max-w-[160px] sm:max-w-[180px] lg:max-w-[200px]',
  xl: 'h-auto w-full max-w-[200px] sm:max-w-[220px] lg:max-w-[240px]',
};

function parseCssColor(input: string): { r: number; g: number; b: number } | null {
  const value = input.trim().toLowerCase();

  if (value.startsWith('#')) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length === 6 || hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  const rgb = value.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+\s*)?\)$/,
  );
  if (rgb) {
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) };
  }

  return null;
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Resolve which artwork to use for a given background hint / CSS colour.
 * Prefers named brand slots; falls back to luminance for unknown colours.
 */
export function resolveLogoVariant(
  background?: LogoBackgroundHint,
): Exclude<LogoVariant, 'auto'> {
  if (!background) return 'light';

  const key = background.trim().toLowerCase();

  if (
    key === 'light' ||
    key === 'white' ||
    key === 'grey' ||
    key === 'gray' ||
    key === 'light-grey' ||
    key === 'light-gray'
  ) {
    return 'light';
  }
  if (key === 'dark' || key === 'black' || key === 'dark-grey' || key === 'dark-gray') {
    return 'dark';
  }
  if (key === 'red' || key === 'brand' || key === 'brand-red') {
    return 'red';
  }
  if (key === 'gold' || key === 'amber' || key === 'yellow') {
    return 'gold';
  }

  const rgb = parseCssColor(key);
  if (!rgb) return 'light';

  // Brand red range → white/gold mark
  if (rgb.r > 160 && rgb.g < 90 && rgb.b < 90) return 'red';

  // Gold / amber range → black/red (gold slot) mark
  if (rgb.r > 160 && rgb.g > 110 && rgb.b < 100 && rgb.r >= rgb.g) return 'gold';

  // Dark surfaces → white/gold; light surfaces → black/gold
  return relativeLuminance(rgb) < 0.45 ? 'dark' : 'light';
}

export type AdaptiveLogoProps = {
  /** Explicit artwork slot, or `auto` (default) to pick from `background`. */
  variant?: LogoVariant;
  /** Named surface or CSS colour used when `variant="auto"`. */
  background?: LogoBackgroundHint;
  /** Wrap in a home link. Pass `false` to render the image only. */
  href?: string | false;
  /** Preset responsive max widths. */
  size?: LogoSize;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  alt?: string;
  /** Soften hover motion (also respects prefers-reduced-motion). */
  interactive?: boolean;
};

export function AdaptiveLogo({
  variant = 'auto',
  background = 'light',
  href = '/',
  size = 'md',
  priority = false,
  className = '',
  imgClassName = '',
  alt = 'Desi Signs',
  interactive = true,
}: AdaptiveLogoProps) {
  const reduceMotion = useReducedMotion();
  const resolved = variant === 'auto' ? resolveLogoVariant(background) : variant;
  const src = LOGO_SRC[resolved];

  const motionSafe = interactive && !reduceMotion;
  const frameClass = [
    'inline-flex items-center justify-center',
    motionSafe
      ? 'transition-transform duration-200 ease-out hover:scale-[1.02] focus-visible:scale-[1.02]'
      : '',
    interactive
      ? 'rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1421]'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const image = (
    <Image
      src={src}
      alt={alt}
      width={DESI_LOGO_INTRINSIC.width}
      height={DESI_LOGO_INTRINSIC.height}
      priority={priority}
      className={[
        'object-contain object-left',
        SIZE_CLASS[size],
        motionSafe ? 'transition-opacity duration-200 ease-out hover:opacity-95' : '',
        imgClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      sizes="(max-width: 640px) 145px, (max-width: 1024px) 170px, 200px"
    />
  );

  if (href === false) {
    return (
      <span className={frameClass} data-logo-variant={resolved}>
        {image}
      </span>
    );
  }

  return (
    <Link href={href} className={frameClass} aria-label="Desi Signs home" data-logo-variant={resolved}>
      {image}
    </Link>
  );
}
