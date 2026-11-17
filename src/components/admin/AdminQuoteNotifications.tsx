'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, FileSpreadsheet, X } from 'lucide-react';
import type { QuoteRequestItem } from '@/lib/types';

const POLL_MS = 12_000;
const TOAST_MS = 6_500;
const SEEN_KEY = 'desi-admin-quotes-seen-ids';

type ToastItem = {
  id: string;
  businessName: string;
  fullName: string;
  signType: string;
};

type QuoteNotificationsContextValue = {
  quotes: QuoteRequestItem[];
  newQuotes: QuoteRequestItem[];
  newCount: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
  markAllSeen: () => void;
  requestDesktopPermission: () => Promise<void>;
  refresh: () => Promise<void>;
};

const QuoteNotificationsContext = createContext<QuoteNotificationsContextValue | null>(null);

export function useQuoteNotifications() {
  const ctx = useContext(QuoteNotificationsContext);
  if (!ctx) {
    throw new Error('useQuoteNotifications must be used within AdminQuoteNotificationsProvider');
  }
  return ctx;
}

function readSeenIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

function writeSeenIds(ids: Set<string>) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore quota errors */
  }
}

export function AdminQuoteNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [quotes, setQuotes] = useState<QuoteRequestItem[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [open, setOpen] = useState(false);
  const knownIdsRef = useRef<Set<string> | null>(null);
  const pathname = usePathname();

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/quotes', { cache: 'no-store' });
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data)) return;

      const next = data.data as QuoteRequestItem[];
      const nextIds = new Set(next.map((q) => q.id));

      if (knownIdsRef.current === null) {
        knownIdsRef.current = nextIds;
        const seen = readSeenIds();
        next.forEach((q) => seen.add(q.id));
        writeSeenIds(seen);
      } else {
        const fresh = next.filter((q) => !knownIdsRef.current!.has(q.id));
        if (fresh.length > 0) {
          const seen = readSeenIds();
          const toastPayload: ToastItem[] = fresh
            .filter((q) => !seen.has(q.id))
            .slice(0, 4)
            .map((q) => ({
              id: q.id,
              businessName: q.businessName,
              fullName: q.fullName,
              signType: q.signType,
            }));

          if (toastPayload.length > 0) {
            setToasts((prev) => [...toastPayload, ...prev].slice(0, 4));
            if (typeof window !== 'undefined' && 'Notification' in window) {
              if (Notification.permission === 'granted') {
                const first = toastPayload[0];
                try {
                  new Notification('New quote request', {
                    body: `${first.businessName} — ${first.signType}`,
                    tag: first.id,
                  });
                } catch {
                  /* ignore */
                }
              }
            }
          }

          window.dispatchEvent(
            new CustomEvent('desi:quotes-updated', { detail: { quotes: next, fresh } }),
          );
        }
        knownIdsRef.current = nextIds;
      }

      setQuotes(next);
    } catch {
      /* keep last good state */
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    const timer = window.setInterval(fetchQuotes, POLL_MS);
    const onFocus = () => fetchQuotes();
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchQuotes]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.slice(0, -1));
    }, TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toasts]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const newQuotes = useMemo(
    () => quotes.filter((q) => q.status === 'new').slice(0, 8),
    [quotes],
  );
  const newCount = useMemo(() => quotes.filter((q) => q.status === 'new').length, [quotes]);

  const markAllSeen = useCallback(() => {
    const seen = readSeenIds();
    quotes.forEach((q) => seen.add(q.id));
    writeSeenIds(seen);
    setToasts([]);
  }, [quotes]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const seen = readSeenIds();
    seen.add(id);
    writeSeenIds(seen);
  }, []);

  const requestDesktopPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {
        /* ignore */
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      quotes,
      newQuotes,
      newCount,
      open,
      setOpen,
      toasts,
      dismissToast,
      markAllSeen,
      requestDesktopPermission,
      refresh: fetchQuotes,
    }),
    [
      quotes,
      newQuotes,
      newCount,
      open,
      toasts,
      dismissToast,
      markAllSeen,
      requestDesktopPermission,
      fetchQuotes,
    ],
  );

  return (
    <QuoteNotificationsContext.Provider value={value}>
      {children}
      <QuoteToastStack />
    </QuoteNotificationsContext.Provider>
  );
}

function QuoteToastStack() {
  const { toasts, dismissToast } = useQuoteNotifications();

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[80] flex w-[min(100vw-2rem,360px)] flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)]"
          >
            <div className="flex items-start gap-3 p-3.5">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D71920] text-white">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D71920]">
                  New quote request
                </p>
                <p className="mt-0.5 truncate text-sm font-bold text-[#111111]">
                  {toast.businessName}
                </p>
                <p className="truncate text-[12px] text-[#596579]">
                  {toast.fullName} · {toast.signType}
                </p>
                <Link
                  href="/admin/quotes"
                  onClick={() => dismissToast(toast.id)}
                  className="mt-2 inline-flex text-[12px] font-semibold text-[#D71920] hover:underline"
                >
                  Open Quote Requests
                </Link>
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismissToast(toast.id)}
                className="cursor-pointer rounded-md p-1 text-[#98A2B3] hover:bg-neutral-100 hover:text-[#111111]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <motion.div
              className="h-0.5 origin-left bg-[#D71920]"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: TOAST_MS / 1000, ease: 'linear' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function QuoteNotificationBell() {
  const {
    open,
    setOpen,
    newCount,
    newQuotes,
    markAllSeen,
    requestDesktopPermission,
  } = useQuoteNotifications();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-quote-bell-root]')) return;
      setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open, setOpen]);

  return (
    <div className="relative" data-quote-bell-root>
      <button
        type="button"
        aria-label={newCount > 0 ? `${newCount} new quote requests` : 'Quote notifications'}
        aria-expanded={open}
        onClick={async () => {
          await requestDesktopPermission();
          const next = !open;
          setOpen(next);
          if (next) markAllSeen();
        }}
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900"
      >
        <Bell className="h-4 w-4" />
        {newCount > 0 && (
          <>
            <span className="absolute -right-1 -top-1 z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D71920] px-1 text-[10px] font-bold text-white shadow-sm">
              {newCount > 9 ? '9+' : newCount}
            </span>
            <span className="absolute -right-1 -top-1 h-[18px] w-[18px] animate-ping rounded-full bg-[#D71920]/35" />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-[320px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]"
          >
            <div className="border-b border-neutral-100 px-3.5 py-3">
              <p className="text-sm font-bold text-neutral-900">Quote notifications</p>
              <p className="text-[11px] text-neutral-500">
                {newCount === 0
                  ? 'You are caught up'
                  : `${newCount} new request${newCount === 1 ? '' : 's'} awaiting review`}
              </p>
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              {newQuotes.length === 0 ? (
                <div className="px-3.5 py-8 text-center text-xs text-neutral-500">
                  No new quote requests right now.
                </div>
              ) : (
                newQuotes.map((q) => (
                  <Link
                    key={q.id}
                    href="/admin/quotes"
                    onClick={() => setOpen(false)}
                    className="block border-b border-neutral-50 px-3.5 py-3 transition-colors hover:bg-neutral-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-[13px] font-semibold text-neutral-900">
                        {q.businessName}
                      </p>
                      <span className="shrink-0 rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700">
                        New
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-neutral-500">
                      {q.fullName} · {q.signType}
                    </p>
                    <p className="mt-1 text-[10px] text-neutral-400">
                      {new Date(q.createdAt).toLocaleString()}
                    </p>
                  </Link>
                ))
              )}
            </div>

            <div className="border-t border-neutral-100 bg-neutral-50 px-3.5 py-2.5">
              <Link
                href="/admin/quotes"
                onClick={() => setOpen(false)}
                className="text-[12px] font-semibold text-[#D71920] hover:underline"
              >
                View all quote requests →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function QuoteNavBadge({ inverted = false }: { inverted?: boolean }) {
  const { newCount } = useQuoteNotifications();
  if (newCount <= 0) return null;
  return (
    <span
      className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
        inverted ? 'bg-white text-[#D71920]' : 'bg-[#D71920] text-white'
      }`}
    >
      {newCount > 9 ? '9+' : newCount}
    </span>
  );
}
