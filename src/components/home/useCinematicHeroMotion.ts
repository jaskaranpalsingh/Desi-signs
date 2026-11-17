'use client';

import { useEffect, type MutableRefObject, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type HeroMotionRefs = {
  section: RefObject<HTMLElement | null>;
  ribbon: RefObject<SVGPathElement | null>;
  ribbonSoft: RefObject<SVGPathElement | null>;
  media: RefObject<HTMLElement | null>;
  mediaInner: RefObject<HTMLElement | null>;
  divider: RefObject<HTMLElement | null>;
  eyebrow: RefObject<HTMLElement | null>;
  line1: RefObject<HTMLElement | null>;
  line2: RefObject<HTMLElement | null>;
  line2Accent: RefObject<HTMLElement | null>;
  description: RefObject<HTMLElement | null>;
  quoteBtn: RefObject<HTMLElement | null>;
  portfolioBtn: RefObject<HTMLElement | null>;
  trustItems: MutableRefObject<(HTMLElement | null)[]>;
  ambient: RefObject<HTMLElement | null>;
};

const RIBBON_START =
  'M920,-40 C980,20 1040,80 1080,160 C1120,250 1100,340 1040,430 C980,520 900,580 820,620 C760,650 700,640 680,560 C660,470 740,360 820,260 C880,180 900,60 920,-40 Z';
const RIBBON_MID =
  'M780,40 C860,100 940,180 980,280 C1020,380 1000,480 920,560 C840,640 740,680 660,700 C600,710 560,680 560,600 C560,500 640,400 720,300 C780,220 820,120 780,40 Z';
const RIBBON_END =
  'M760,0 C790,80 810,180 820,300 C830,420 820,540 800,680 C790,760 770,820 740,900 C720,860 710,780 700,680 C690,540 700,400 710,260 C720,140 740,40 760,0 Z';

const RIBBON_SOFT_START =
  'M900,-60 C970,0 1040,70 1080,160 C1125,270 1095,380 1020,470 C950,550 870,590 800,610 C750,620 720,580 720,510 C720,420 800,320 870,220 C920,150 930,20 900,-60 Z';
const RIBBON_SOFT_END =
  'M740,-10 C775,70 800,180 810,300 C820,430 810,560 790,700 C780,780 760,850 735,920 C710,870 700,780 690,680 C680,540 690,390 700,250 C710,130 720,40 740,-10 Z';

const RIBBON_SCROLL =
  'M780,-20 C820,100 840,240 850,400 C860,560 850,720 820,900 C790,860 770,720 760,560 C750,380 760,200 780,-20 Z';

export function useCinematicHeroMotion(
  refs: HeroMotionRefs,
  options: { reduceMotion: boolean | null },
) {
  useEffect(() => {
    if (options.reduceMotion) return;

    const section = refs.section.current;
    const ribbon = refs.ribbon.current;
    const ribbonSoft = refs.ribbonSoft.current;
    const media = refs.media.current;
    const mediaInner = refs.mediaInner.current;
    const divider = refs.divider.current;
    if (!section || !ribbon || !media || !mediaInner || !divider) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (cancelled) return;

      const desktop = () => window.matchMedia('(min-width: 1024px)').matches;
      const finePointer = () =>
        window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      gsap.set(ribbon, { attr: { d: RIBBON_START }, opacity: 0 });
      if (ribbonSoft) gsap.set(ribbonSoft, { attr: { d: RIBBON_SOFT_START }, opacity: 0 });

      gsap.set(mediaInner, { scale: 1.05, y: 16, x: 0, force3D: true });
      gsap.set(media, {
        clipPath: desktop() ? 'inset(0% 0% 0% 100%)' : 'inset(12% 0% 0% 0%)',
      });
      gsap.set(divider, {
        clipPath: 'inset(0 0 100% 0)',
        opacity: 1,
      });

      const textTargets = [
        refs.eyebrow.current,
        refs.line1.current,
        refs.line2.current,
        refs.description.current,
        refs.quoteBtn.current,
        refs.portfolioBtn.current,
      ].filter(Boolean);

      gsap.set(textTargets, { opacity: 0, y: 24 });
      if (refs.line2Accent.current) {
        gsap.set(refs.line2Accent.current, { scaleX: 0, transformOrigin: 'left center' });
      }
      gsap.set((refs.trustItems.current ?? []).filter(Boolean), { opacity: 0, y: 12 });
      if (refs.ambient.current) gsap.set(refs.ambient.current, { opacity: 0 });

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Fluid ribbon entrance
      intro
        .to(ribbon, { opacity: 0.95, duration: 0.25 }, 0)
        .to(
          ribbon,
          { attr: { d: RIBBON_MID }, duration: 0.8, ease: 'power2.inOut' },
          0.05,
        )
        .to(
          ribbon,
          { attr: { d: RIBBON_END }, duration: 0.75, ease: 'power3.inOut' },
          0.75,
        );

      if (ribbonSoft) {
        intro
          .to(ribbonSoft, { opacity: 0.3, duration: 0.3 }, 0.05)
          .to(
            ribbonSoft,
            { attr: { d: RIBBON_SOFT_END }, duration: 1.25, ease: 'power2.inOut' },
            0.1,
          );
      }

      // Image unveil + settle
      intro
        .to(
          media,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05, ease: 'power3.inOut' },
          0.28,
        )
        .to(
          mediaInner,
          { scale: 1, y: 0, duration: 1.1, ease: 'power3.out' },
          0.32,
        )
        .to(
          divider,
          { clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power3.inOut' },
          0.55,
        );

      if (refs.ambient.current) {
        intro.to(refs.ambient.current, { opacity: 1, duration: 0.85 }, 0.5);
      }

      // Typography
      if (refs.eyebrow.current) {
        intro.to(refs.eyebrow.current, { opacity: 1, y: 0, duration: 0.45 }, 0.32);
      }
      if (refs.line1.current) {
        intro.fromTo(
          refs.line1.current,
          { opacity: 0, y: 35, clipPath: 'inset(100% 0 0 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.75 },
          0.46,
        );
      }
      if (refs.line2.current) {
        intro.fromTo(
          refs.line2.current,
          { opacity: 0, y: 35, clipPath: 'inset(100% 0 0 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.75 },
          0.64,
        );
      }
      if (refs.line2Accent.current) {
        intro.to(refs.line2Accent.current, { scaleX: 1, duration: 0.55 }, 0.88);
      }
      if (refs.description.current) {
        intro.to(refs.description.current, { opacity: 1, y: 0, duration: 0.5 }, 0.86);
      }
      if (refs.quoteBtn.current) {
        intro.to(refs.quoteBtn.current, { opacity: 1, y: 0, duration: 0.45 }, 1.0);
      }
      if (refs.portfolioBtn.current) {
        intro.to(refs.portfolioBtn.current, { opacity: 1, y: 0, duration: 0.45 }, 1.1);
      }

      const trust = (refs.trustItems.current ?? []).filter(Boolean) as HTMLElement[];
      if (trust.length) {
        intro.to(trust, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, 1.18);
      }

      // Settle: fluid hands off to the solid diagonal — leave the storefront clear
      intro.to(ribbon, { opacity: 0, duration: 0.65, ease: 'power2.out' }, 1.35);
      if (ribbonSoft) intro.to(ribbonSoft, { opacity: 0, duration: 0.55 }, 1.3);

      // Scroll-linked cinema (no pin — scrub only)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        })
        .to(
          ribbon,
          {
            attr: { d: RIBBON_SCROLL },
            y: desktop() ? 90 : 40,
            opacity: 0,
            ease: 'none',
          },
          0,
        )
        .to(
          mediaInner,
          {
            y: desktop() ? -30 : -16,
            scale: 1.035,
            ease: 'none',
          },
          0,
        )
        .to(
          [refs.line1.current, refs.line2.current].filter(Boolean),
          { y: -20, ease: 'none' },
          0,
        )
        .to(refs.description.current, { y: -10, opacity: 0.8, ease: 'none' }, 0)
        .to(divider, { y: 36, opacity: 0.8, ease: 'none' }, 0);

      if (ribbonSoft) {
        gsap.to(ribbonSoft, {
          y: 110,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.7,
          },
        });
      }

      // Desktop pointer parallax (x only — y owned by scroll)
      if (finePointer() && desktop()) {
        const onMove = (e: MouseEvent) => {
          const rect = media.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
          gsap.to(mediaInner, {
            x: gsap.utils.clamp(-5, 5, px),
            duration: 0.55,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };
        const onLeave = () => {
          gsap.to(mediaInner, { x: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
        };
        media.addEventListener('mousemove', onMove);
        media.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          media.removeEventListener('mousemove', onMove);
          media.removeEventListener('mouseleave', onLeave);
        });
      }

      // Magnetic CTAs
      const bindMagnet = (el: HTMLElement | null) => {
        if (!el || !finePointer()) return;
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          if (Math.hypot(x, y) > 90) {
            gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
            return;
          }
          gsap.to(el, {
            x: gsap.utils.clamp(-5, 5, x * 0.16),
            y: gsap.utils.clamp(-5, 5, y * 0.16),
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      };

      bindMagnet(refs.quoteBtn.current);
      bindMagnet(refs.portfolioBtn.current);
    }, section);

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
    // Refs are stable; only re-bind when reduced-motion preference changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.reduceMotion]);
}
