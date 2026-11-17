'use client';

import React, { useEffect, useMemo, useState } from 'react';

export type InfiniteMarqueeProps = {
  children: React.ReactNode;
  /** Scroll direction. Default: left (content moves right → left). */
  direction?: 'left' | 'right';
  /** Seconds for one full sequence cycle. Default: 40. */
  duration?: number;
  /** Gap between items in px. Default: 24. */
  gap?: number;
  /** Pause while pointer is over the marquee. Default: true. */
  pauseOnHover?: boolean;
  /** Pause while focus is inside the marquee. Default: true. */
  pauseOnFocus?: boolean;
  /**
   * How many identical sequences to render.
   * Animation shifts by exactly one sequence (100% / copies).
   * Default: 3 (fills ultra-wide screens without gaps).
   */
  copies?: number;
  className?: string;
  trackClassName?: string;
  itemClassName?: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}

/**
 * Premium infinite horizontal marquee using CSS transforms.
 * Visual clones are inert + aria-hidden so assistive tech only meets one sequence.
 */
export function InfiniteMarquee({
  children,
  direction = 'left',
  duration = 40,
  gap = 24,
  pauseOnHover = true,
  pauseOnFocus = true,
  copies = 3,
  className = '',
  trackClassName = '',
  itemClassName = '',
}: InfiniteMarqueeProps) {
  const reducedMotion = usePrefersReducedMotion();
  const items = useMemo(() => React.Children.toArray(children).filter(Boolean), [children]);
  const sequenceCount = Math.max(2, Math.floor(copies));
  const shiftPercent = -100 / sequenceCount;

  if (items.length === 0) return null;

  if (reducedMotion) {
    return (
      <div
        className={`overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
        role="list"
      >
        <div className="flex w-max" style={{ gap }}>
          {items.map((child, index) => (
            <div key={`static-${index}`} className={`shrink-0 ${itemClassName}`} role="listitem">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pauseClasses = [
    pauseOnHover ? 'group-hover/marquee:[animation-play-state:paused]' : '',
    pauseOnFocus ? 'group-focus-within/marquee:[animation-play-state:paused]' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`group/marquee relative w-full max-w-full overflow-hidden ${className}`}
      style={{
        maskImage:
          'linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)',
      }}
    >
      <div
        className={`desi-marquee-track flex w-max will-change-transform ${pauseClasses} ${trackClassName}`}
        style={
          {
            // Gap lives inside each sequence (padding-right) so -100%/copies is exact
            ['--marquee-shift' as string]: `${shiftPercent}%`,
            animationName: 'desi-marquee-scroll',
            animationDuration: `${Math.max(8, duration)}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDirection: direction === 'left' ? 'normal' : 'reverse',
          } as React.CSSProperties
        }
      >
        {Array.from({ length: sequenceCount }, (_, sequenceIndex) => {
          const isClone = sequenceIndex > 0;
          return (
            <div
              key={`seq-${sequenceIndex}`}
              className="flex shrink-0"
              style={{ gap, paddingRight: gap }}
              aria-hidden={isClone || undefined}
              // Prevent clone links/buttons from entering the tab order
              {...(isClone ? ({ inert: true } as React.HTMLAttributes<HTMLDivElement>) : {})}
            >
              {items.map((child, index) => (
                <div
                  key={`seq-${sequenceIndex}-item-${index}`}
                  className={`shrink-0 ${itemClassName}`}
                >
                  {child}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
