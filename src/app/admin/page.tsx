'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Package,
  FolderGit2,
  BookOpen,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import type { DashboardOverview } from '@/lib/data-store';

type DashboardState = {
  loading: boolean;
  error: string | null;
  connected: boolean;
  data: DashboardOverview | null;
};

export default function AdminDashboardOverviewPage() {
  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: null,
    connected: false,
    data: null,
  });

  const loadDashboard = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch('/api/admin/dashboard', { credentials: 'include' });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setState({
          loading: false,
          error: json.message || 'Unable to load dashboard data from MongoDB.',
          connected: Boolean(json.connected),
          data: json.data || null,
        });
        return;
      }

      setState({
        loading: false,
        error: null,
        connected: true,
        data: json.data as DashboardOverview,
      });
    } catch {
      setState({
        loading: false,
        error:
          'Could not reach the backend. Start it with npm run dev:backend, then refresh.',
        connected: false,
        data: null,
      });
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = state.data?.stats;

  const cards = [
    {
      title: 'Active Services',
      value: stats?.activeServices,
      badge: 'In MongoDB',
      href: '/admin/services',
      icon: Wrench,
    },
    {
      title: 'Sign Products',
      value: stats?.signProducts,
      badge: 'In MongoDB',
      href: '/admin/products',
      icon: Package,
    },
    {
      title: 'Portfolio Projects',
      value: stats?.portfolioProjects,
      badge: 'In MongoDB',
      href: '/admin/projects',
      icon: FolderGit2,
    },
    {
      title: 'Blog Articles',
      value: stats?.blogArticlesPublished,
      badge: stats ? `${stats.blogArticlesTotal} Total` : '—',
      href: '/admin/blog',
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Executive Dashboard
          </h1>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
            Live overview from MongoDB — published website content. Contact form
            enquiries are emailed to Save@desisigns.com.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          disabled={state.loading}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xs border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
        >
          {state.loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </button>
      </div>

      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xs border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Database / API issue</p>
            <p className="mt-0.5">{state.error}</p>
            <p className="mt-1 text-amber-800/80">
              Counts are not shown as zero unless MongoDB confirms an empty collection.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {cards.map((s) => {
          const Icon = s.icon;
          const displayValue =
            state.loading && !stats
              ? '…'
              : state.error && !state.connected
                ? '—'
                : s.value ?? 0;

          return (
            <Link
              key={s.title}
              href={s.href}
              className="group flex flex-col justify-between rounded-xs border border-neutral-200 bg-white p-4 shadow-xs transition-colors hover:border-neutral-400"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                  {s.title}
                </span>
                <Icon className="h-4 w-4 text-neutral-400 transition-colors group-hover:text-neutral-900" />
              </div>
              <div className="my-3">
                <div className="text-2xl font-bold text-neutral-900">{displayValue}</div>
              </div>
              <div className="w-fit rounded-xs bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                {state.error && !state.connected ? 'Unavailable' : s.badge}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
