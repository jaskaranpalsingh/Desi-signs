import type { QuoteRequestItem } from '@/lib/types';
import type { QuoteStatus } from '@/lib/quote-management-types';

export const STATUS_OPTIONS: QuoteStatus[] = [
  'new',
  'reviewed',
  'quoted',
  'closed',
  'declined',
];

export function statusLabel(status: string): string {
  switch (status) {
    case 'new':
      return 'New';
    case 'reviewed':
      return 'Under Review';
    case 'quoted':
      return 'Quotes Sent';
    case 'closed':
      return 'Closed';
    case 'declined':
      return 'Declined';
    default:
      return status;
  }
}

export function statusClass(status: string): string {
  switch (status) {
    case 'new':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'reviewed':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'quoted':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'declined':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-neutral-100 text-neutral-600 border-neutral-200';
  }
}

export type QuoteCounts = {
  new: number;
  reviewed: number;
  quoted: number;
  closed: number;
  declined: number;
  overdueFollowUps: number;
};

export const EMPTY_COUNTS: QuoteCounts = {
  new: 0,
  reviewed: 0,
  quoted: 0,
  closed: 0,
  declined: 0,
  overdueFollowUps: 0,
};

export function isOverdue(quote: QuoteRequestItem): boolean {
  if (!quote.followUpDate || quote.followUpCompleted) return false;
  if (quote.status === 'closed' || quote.status === 'declined') return false;
  return new Date(quote.followUpDate).getTime() < Date.now();
}
