'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { AdaptiveLogo } from '@/components/brand/AdaptiveLogo';
import { initialSettings } from '@/lib/data/initial-data';

const serviceLinks = [
  { label: 'Channel Letters', href: '/services/channel-letters' },
  { label: '3D Letters', href: '/services/3d-architectural-letters' },
  { label: 'Storefront Signs', href: '/services/storefront-commercial-signs' },
  { label: 'Pylon & Monument', href: '/services/pylon-monument-signs' },
  { label: 'Interior Signs', href: '/services/interior-reception-signs' },
  { label: 'LED Neon', href: '/services/custom-led-neon' },
];

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Get a Quote', href: '/quote' },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-[12px] font-bold tracking-[0.14em] text-[#17191D] uppercase">
      <span aria-hidden className="h-3.5 w-[2.5px] rounded-full bg-[#DC1421]" />
      {children}
    </h2>
  );
}

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const phoneHref = `tel:${initialSettings.phone.replace(/[^\d+]/g, '')}`;

  return (
    <footer className="border-t border-[#E5E7EB] bg-white text-[#596579]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8 lg:gap-10">
          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-5">
            <AdaptiveLogo background="light" size="md" />

            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#596579]">
              Custom signs for shops, restaurants, and offices across Edmonton and nearby areas.
            </p>

            <div className="mt-7 space-y-3.5">
              <a
                href={`mailto:${initialSettings.email}`}
                className="group flex items-start gap-3 text-sm text-[#374151] transition-colors hover:text-[#DC1421]"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0F1] text-[#DC1421]">
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="pt-1.5 font-medium underline decoration-[#DC1421]/25 underline-offset-4 group-hover:decoration-[#DC1421]">
                  {initialSettings.email}
                </span>
              </a>

              <a
                href={phoneHref}
                className="group flex items-start gap-3 text-sm text-[#374151] transition-colors hover:text-[#DC1421]"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0F1] text-[#DC1421]">
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="pt-1.5 font-medium">{initialSettings.phone}</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-[#374151]">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0F1] text-[#DC1421]">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                </span>
                <p className="pt-1.5 leading-relaxed">
                  {initialSettings.address}
                  <br />
                  {initialSettings.city}, {initialSettings.province} {initialSettings.postalCode}
                </p>
              </div>

              <div className="flex items-start gap-3 text-sm text-[#6B7280]">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8F9FA] text-[#DC1421]">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                </span>
                <p className="pt-1.5">Mon–Fri 8:00 AM – 5:00 PM · Sat by appointment</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-3 lg:col-span-3">
            <FooterHeading>Services</FooterHeading>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#596579] transition-colors hover:text-[#DC1421]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2 lg:col-span-2">
            <FooterHeading>Company</FooterHeading>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#596579] transition-colors hover:text-[#DC1421]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div className="md:col-span-2 lg:col-span-2">
            <FooterHeading>We Serve</FooterHeading>
            <ul className="mt-5 space-y-2.5">
              {initialSettings.serviceArea.map((area) => (
                <li key={area} className="text-sm leading-relaxed text-[#596579]">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E5E7EB] bg-[#F8F9FA]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-[12px] text-[#6B7280] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Desi Signs Ltd. · Edmonton, Alberta</p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Legal">
            <Link href="/privacy-policy" className="transition-colors hover:text-[#DC1421]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#DC1421]">
              Terms
            </Link>
            <Link
              href="/admin/login"
              className="text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
