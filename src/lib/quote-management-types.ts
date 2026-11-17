export type QuoteStatus = 'new' | 'reviewed' | 'quoted' | 'closed' | 'declined';

export type QuoteStatusHistoryEntry = {
  id: string;
  status: QuoteStatus;
  changedAt: string;
  changedBy: string;
  note?: string;
};

export type QuoteAdminNote = {
  id: string;
  body: string;
  author: string;
  createdAt: string;
};

export type QuoteLineItem = {
  id: string;
  description: string;
  amount: number;
};

export type CustomerQuotation = {
  id: string;
  quoteRequestId: string;
  quotationNumber: string;
  quoteDate: string;
  expiryDate: string;
  customerName: string;
  businessName: string;
  customerEmail: string;
  customerPhone: string;
  customerLocation: string;
  signSpecifications: string;
  materials: string;
  manufacturingCost: number;
  installationCharges: number;
  permitCharges: number;
  otherCharges: number;
  discount: number;
  taxRatePercent: number;
  taxAmount: number;
  subtotal: number;
  totalCad: number;
  paymentTerms: string;
  estimatedCompletion: string;
  additionalNotes: string;
  status: 'draft' | 'sent';
  revision: number;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  emailDeliveryStatus?: 'pending' | 'sent' | 'failed' | 'skipped';
  emailDeliveryError?: string;
  emailMessageId?: string;
};

export type QuoteDashboardCounts = {
  new: number;
  reviewed: number;
  quoted: number;
  closed: number;
  declined: number;
  overdueFollowUps: number;
};

export function calcQuotationTotals(input: {
  manufacturingCost: number;
  installationCharges: number;
  permitCharges: number;
  otherCharges: number;
  discount: number;
  taxRatePercent: number;
}) {
  const manufacturingCost = Math.max(0, Number(input.manufacturingCost) || 0);
  const installationCharges = Math.max(0, Number(input.installationCharges) || 0);
  const permitCharges = Math.max(0, Number(input.permitCharges) || 0);
  const otherCharges = Math.max(0, Number(input.otherCharges) || 0);
  const discount = Math.max(0, Number(input.discount) || 0);
  const taxRatePercent = Math.max(0, Number(input.taxRatePercent) || 0);

  const gross = manufacturingCost + installationCharges + permitCharges + otherCharges;
  const subtotal = Math.max(0, gross - discount);
  const taxAmount = Math.round(subtotal * (taxRatePercent / 100) * 100) / 100;
  const totalCad = Math.round((subtotal + taxAmount) * 100) / 100;

  return { manufacturingCost, installationCharges, permitCharges, otherCharges, discount, taxRatePercent, subtotal, taxAmount, totalCad };
}

export function moneyCad(value: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}
