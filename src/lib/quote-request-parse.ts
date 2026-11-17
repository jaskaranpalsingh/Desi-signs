import { extractAttachmentLinks } from './quote-attachments';
import type { QuoteRequestItem } from './types';

export type ParsedCalculatorDetails = {
  signText?: string;
  signboard?: string;
  letterHeight?: string;
  letteringWidth?: string;
  fontStyle?: string;
  faceColour?: string;
  lighting?: string;
  installation?: string;
  permitting?: string;
  estimatedPrice?: string;
  charCount?: string;
};

function pick(details: string, label: string): string | undefined {
  const re = new RegExp(`^-\\s*${label}:\\s*(.+)$`, 'im');
  const match = details.match(re);
  return match?.[1]?.trim() || undefined;
}

/** Parse structured calculator lines from projectDetails when present. */
export function parseCalculatorDetails(projectDetails: string): ParsedCalculatorDetails {
  const text = projectDetails || '';
  if (!/Online Calculator Quote/i.test(text) && !/Estimated Selling Price/i.test(text)) {
    return {};
  }

  const signTextRaw = pick(text, 'Text');
  const signText = signTextRaw?.replace(/^"|"$/g, '').replace(/\s*\(\d+\s*letters?\)$/i, '').trim();

  return {
    signText,
    signboard: pick(text, 'Signboard'),
    letterHeight: pick(text, 'Proposed Letter Height') || pick(text, 'Letter Height'),
    letteringWidth: pick(text, 'Estimated Lettering Width'),
    fontStyle: pick(text, 'Font Style'),
    faceColour: pick(text, 'Letter Colour') || pick(text, 'Face Colour'),
    lighting: pick(text, 'Lighting'),
    installation: pick(text, 'Professional Installation'),
    permitting: pick(text, 'City Bylaw Permitting'),
    estimatedPrice: pick(text, 'Estimated Selling Price'),
    charCount: signTextRaw?.match(/\((\d+)\s*letters?\)/i)?.[1],
  };
}

export function extractEstimatedPriceLabel(quote: QuoteRequestItem): string | null {
  if (quote.budgetRange?.trim()) return quote.budgetRange.trim();
  const parsed = parseCalculatorDetails(quote.projectDetails);
  return parsed.estimatedPrice || null;
}

export function getQuoteAttachments(quote: QuoteRequestItem) {
  return extractAttachmentLinks(quote.projectDetails || '');
}

export function shortRequestId(id: string): string {
  if (!id) return '—';
  if (id.length <= 10) return id.toUpperCase();
  return id.slice(-8).toUpperCase();
}
