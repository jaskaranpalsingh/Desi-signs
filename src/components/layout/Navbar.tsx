'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { AdaptiveLogo } from '@/components/brand/AdaptiveLogo';

// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  {
    name: 'Services',
    href: '/services',
    dropdown: [
      { title: 'Channel Letters (Halo & Front-Lit)', href: '/services/channel-letters' },
      { title: '3D Dimensional Architectural Letters', href: '/services/3d-architectural-letters' },
      { title: 'Storefront Signs & Fascias', href: '/services/storefront-commercial-signs' },
      { title: 'Pylon & Monument Signs', href: '/services/pylon-monument-signs' },
      { title: 'Interior & Reception Signage', href: '/services/interior-reception-signs' },
      { title: 'Custom LED Neon Signs', href: '/services/custom-led-neon' },
    ],
  },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

// ─── Dropdown Menu ────────────────────────────────────────────────────────────

interface DropdownItem {
  title: string;
  href: string;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  parentHref: string;
  isOpen: boolean;
}

function DropdownMenu({ items, parentHref, isOpen }: DropdownMenuProps) {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-64 bg-white border border-line rounded-xl shadow-lg z-50 overflow-hidden">
      <div className="py-1.5">
        <div className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-brand border-b border-line">
          {parentHref === '/services' ? 'Signage Capabilities' : 'Product Categories'}
        </div>
        {items.map((item) => (
          <Link
            key={item.href + item.title}
            href={item.href}
            className="block px-4 py-2.5 text-[13px] text-ink-muted hover:bg-red-50 hover:text-ink transition-colors duration-100 border-b border-neutral-50 last:border-0"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
  }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleMouseEnter = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.28)' : '#FFFFFF',
        backdropFilter: scrolled ? 'blur(10px) saturate(1.05)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(10px) saturate(1.05)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(229, 231, 235, 0.45)'
          : '1px solid #E5E7EB',
        boxShadow: scrolled ? '0 8px 28px rgba(17, 24, 39, 0.05)' : 'none',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[76px] gap-5 lg:gap-8">

          {/* Black + gold on light header; highlighted when scrolled */}
          <div
            className={`relative z-10 flex-shrink-0 rounded-md transition-[box-shadow,transform] duration-300 ${
              scrolled
                ? 'shadow-[0_0_0_1.5px_rgba(220,20,33,0.28),0_6px_16px_rgba(17,24,39,0.1)]'
                : ''
            }`}
          >
            <AdaptiveLogo
              background="light"
              size="sm"
              priority
              className="leading-none"
              imgClassName="!max-w-[132px] sm:!max-w-[148px] lg:!max-w-[158px]"
            />
          </div>

          {/* Desktop nav — soft matte on scroll, dark readable text */}
          <nav
            className={`mx-auto hidden items-center gap-1.5 xl:gap-2.5 lg:flex transition-opacity duration-300 ease-out ${
              scrolled ? 'opacity-[0.78] hover:opacity-100' : 'opacity-100'
            }`}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const hasDropdown = !!link.dropdown;
              const dropdownOpen = openDropdown === link.name;

              return (
                <div
                  key={link.name}
                  className="relative flex items-center h-[76px]"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(link.name)}
                  onMouseLeave={() => hasDropdown && handleMouseLeave()}
                >
                  <Link
                    href={link.href}
                    className={`relative flex items-center gap-1 px-3 xl:px-3.5 py-1.5 text-[13.5px] font-semibold transition-colors duration-150 whitespace-nowrap rounded-md ${
                      active
                        ? 'text-[#111827] font-bold'
                        : 'text-[#111827] hover:text-black hover:bg-white/50'
                    }`}
                  >
                    <span>{link.name}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          dropdownOpen ? 'rotate-180 text-brand' : 'text-[#374151]'
                        }`}
                      />
                    )}
                    {active && (
                      <span className="absolute -bottom-1 left-2.5 right-2.5 h-[2.5px] bg-brand rounded-full" />
                    )}
                  </Link>

                  {hasDropdown && link.dropdown && (
                    <DropdownMenu
                      items={link.dropdown}
                      parentHref={link.href}
                      isOpen={dropdownOpen}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop phone + CTA */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <a
              href="tel:7805550192"
              className={`flex items-center gap-1.5 text-[13px] font-semibold text-[#111827] hover:text-brand whitespace-nowrap transition-[opacity,color] duration-300 ${
                scrolled ? 'opacity-[0.78] hover:opacity-100' : 'opacity-100'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-brand" strokeWidth={2.2} />
              (780) 555-0192
            </a>
            <Link
              href="/quote"
              className="relative z-10 inline-flex items-center justify-center bg-brand hover:bg-brand-hover text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 whitespace-nowrap tracking-wide shadow-xs"
            >
              Request a Quote
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2 ml-auto">
            <Link
              href="/quote"
              className="inline-flex items-center bg-brand hover:bg-brand-hover text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-ink-muted hover:text-ink focus:outline-none rounded-lg hover:bg-surface"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-line bg-white">
          <div className="max-w-[1280px] mx-auto px-4 py-4 space-y-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const hasDropdown = !!link.dropdown;
              const expanded = mobileExpanded === link.name;

              return (
                <div key={link.name}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      className={`flex-1 py-3 text-sm font-medium border-b border-neutral-100 ${
                        active ? 'text-ink font-semibold' : 'text-ink-muted'
                      }`}
                    >
                      {active && (
                        <span className="inline-block w-1.5 h-1.5 bg-brand rounded-full mr-2 mb-0.5" />
                      )}
                      {link.name}
                    </Link>
                    {hasDropdown && (
                      <button
                        onClick={() => setMobileExpanded(expanded ? null : link.name)}
                        className="p-2 text-neutral-500 hover:text-ink border-b border-neutral-100"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>
                  {hasDropdown && expanded && link.dropdown && (
                    <div className="pl-3 pb-2 space-y-0 bg-surface border-b border-neutral-100">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="block py-2 text-xs text-ink-muted hover:text-brand border-b border-neutral-100 last:border-0"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-4 flex flex-col gap-2.5">
              <a
                href="tel:7805550192"
                className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-ink border border-line bg-white rounded-lg"
              >
                <Phone className="w-4 h-4 text-brand" strokeWidth={2} />
                (780) 555-0192
              </a>
              <Link
                href="/quote"
                className="flex items-center justify-center bg-brand hover:bg-brand-hover text-white text-sm font-semibold py-3 rounded-lg tracking-wide transition-colors"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
