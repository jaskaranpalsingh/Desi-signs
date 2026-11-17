'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  Package,
  FolderGit2,
  BookOpen,
  MessageSquareQuote,
  Settings,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { AdaptiveLogo } from '@/components/brand/AdaptiveLogo';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminShell
      pathname={pathname}
      onLogout={async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          router.push('/admin/login');
          router.refresh();
        } catch {
          /* ignore */
        }
      }}
    >
      {children}
    </AdminShell>
  );
}

function AdminShell({
  children,
  pathname,
  onLogout,
}: {
  children: React.ReactNode;
  pathname: string;
  onLogout: () => Promise<void>;
}) {
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Services', href: '/admin/services', icon: Wrench },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Portfolio / Projects', href: '/admin/projects', icon: FolderGit2 },
    { name: 'Blog & Articles', href: '/admin/blog', icon: BookOpen },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'Settings & SEO', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 md:flex-row">
      <aside className="flex w-full shrink-0 flex-col justify-between border-r border-neutral-200 bg-white md:w-64">
        <div>
          <div className="flex h-16 items-center border-b border-neutral-200 px-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <AdaptiveLogo
                href={false}
                background="light"
                size="sm"
                className="shrink-0"
              />
              <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
                Admin
              </span>
            </Link>
          </div>

          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xs px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 border-t border-neutral-200 p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xs px-3 py-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" /> View Live Site
            </span>
            <span className="text-[10px] text-neutral-400">Public</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xs px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-neutral-800" />
            <span className="text-xs font-semibold text-neutral-700">
              Desi Signs Secure Administrative Environment
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden text-xs text-neutral-500 sm:inline">
              Signed in as{' '}
              <strong className="font-semibold text-neutral-800">admin@desisigns.ca</strong>
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-6 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
