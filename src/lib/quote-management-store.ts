import { randomUUID } from 'crypto';
import { connectToDatabase } from './db';
import { QuoteRequestModel } from './models';
import type {
  CustomerQuotationItem,
  QuoteAdminNote,
  QuoteRequestItem,
  QuoteStatusHistoryEntry,
} from './types';
import { calcQuotationTotals, type QuoteDashboardCounts, type QuoteStatus } from './quote-management-types';
import { getQuoteRequests, updateQuoteStatus as legacyUpdateStatus } from './data-store';

function mapQuotation(q: any, quoteRequestId: string): CustomerQuotationItem {
  return {
    id: q.id,
    quoteRequestId,
    quotationNumber: q.quotationNumber,
    quoteDate: q.quoteDate || '',
    expiryDate: q.expiryDate || '',
    customerName: q.customerName || '',
    businessName: q.businessName || '',
    customerEmail: q.customerEmail || '',
    customerPhone: q.customerPhone || '',
    customerLocation: q.customerLocation || '',
    signSpecifications: q.signSpecifications || '',
    materials: q.materials || '',
    manufacturingCost: Number(q.manufacturingCost) || 0,
    installationCharges: Number(q.installationCharges) || 0,
    permitCharges: Number(q.permitCharges) || 0,
    otherCharges: Number(q.otherCharges) || 0,
    discount: Number(q.discount) || 0,
    taxRatePercent: Number(q.taxRatePercent) || 0,
    taxAmount: Number(q.taxAmount) || 0,
    subtotal: Number(q.subtotal) || 0,
    totalCad: Number(q.totalCad) || 0,
    paymentTerms: q.paymentTerms || '',
    estimatedCompletion: q.estimatedCompletion || '',
    additionalNotes: q.additionalNotes || '',
    status: q.status === 'sent' ? 'sent' : 'draft',
    revision: Number(q.revision) || 1,
    createdAt: q.createdAt ? new Date(q.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: q.updatedAt ? new Date(q.updatedAt).toISOString() : new Date().toISOString(),
    sentAt: q.sentAt ? new Date(q.sentAt).toISOString() : undefined,
    emailDeliveryStatus: q.emailDeliveryStatus,
    emailDeliveryError: q.emailDeliveryError || '',
    emailMessageId: q.emailMessageId || '',
  };
}

export function mapManagedQuote(doc: any): QuoteRequestItem {
  const id = doc._id?.toString?.() || doc.id;
  return {
    ...doc,
    id,
    createdAt: doc.createdAt?.toISOString?.() || doc.createdAt || new Date().toISOString(),
    emailNotificationSentAt: doc.emailNotificationSentAt
      ? new Date(doc.emailNotificationSentAt).toISOString()
      : undefined,
    statusHistory: (doc.statusHistory || []).map((h: any) => ({
      id: h.id,
      status: h.status,
      changedAt: h.changedAt ? new Date(h.changedAt).toISOString() : new Date().toISOString(),
      changedBy: h.changedBy || 'admin',
      note: h.note || '',
    })),
    adminNotes: (doc.adminNotes || []).map((n: any) => ({
      id: n.id,
      body: n.body,
      author: n.author || 'admin',
      createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString(),
    })),
    followUpDate: doc.followUpDate ? new Date(doc.followUpDate).toISOString() : null,
    followUpCompleted: Boolean(doc.followUpCompleted),
    followUpCompletedAt: doc.followUpCompletedAt
      ? new Date(doc.followUpCompletedAt).toISOString()
      : null,
    quotations: (doc.quotations || []).map((q: any) => mapQuotation(q, id)),
  } as QuoteRequestItem;
}

export async function getManagedQuoteById(id: string): Promise<QuoteRequestItem | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const doc = await QuoteRequestModel.findById(id).lean();
      if (!doc) return null;
      return mapManagedQuote(doc);
    } catch {
      return null;
    }
  }
  const all = await getQuoteRequests();
  return all.find((q) => q.id === id) || null;
}

export async function getQuoteDashboardCounts(): Promise<QuoteDashboardCounts> {
  const quotes = await getQuoteRequests();
  const now = Date.now();
  return {
    new: quotes.filter((q) => q.status === 'new').length,
    reviewed: quotes.filter((q) => q.status === 'reviewed').length,
    quoted: quotes.filter((q) => q.status === 'quoted').length,
    closed: quotes.filter((q) => q.status === 'closed').length,
    declined: quotes.filter((q) => q.status === 'declined').length,
    overdueFollowUps: quotes.filter(
      (q) =>
        q.followUpDate &&
        !q.followUpCompleted &&
        new Date(q.followUpDate).getTime() < now &&
        q.status !== 'closed' &&
        q.status !== 'declined',
    ).length,
  };
}

export async function updateQuoteStatusManaged(
  id: string,
  status: QuoteStatus,
  opts?: { changedBy?: string; note?: string },
): Promise<QuoteRequestItem | null> {
  const entry: QuoteStatusHistoryEntry = {
    id: randomUUID(),
    status,
    changedAt: new Date().toISOString(),
    changedBy: opts?.changedBy || 'admin',
    note: opts?.note || '',
  };

  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await QuoteRequestModel.findByIdAndUpdate(
        id,
        {
          status,
          $push: { statusHistory: { ...entry, changedAt: new Date(entry.changedAt) } },
        },
        { new: true },
      ).lean();
      if (!updated) return null;
      return mapManagedQuote(updated);
    } catch (e) {
      console.error('updateQuoteStatusManaged error:', e);
      return null;
    }
  }

  await legacyUpdateStatus(id, status as QuoteRequestItem['status']);
  const quote = await getManagedQuoteById(id);
  if (!quote) return null;
  quote.status = status;
  quote.statusHistory = [...(quote.statusHistory || []), entry];
  return quote;
}

export async function addQuoteAdminNote(
  id: string,
  body: string,
  author = 'admin',
): Promise<QuoteAdminNote | null> {
  const note: QuoteAdminNote = {
    id: randomUUID(),
    body: body.trim(),
    author,
    createdAt: new Date().toISOString(),
  };
  if (!note.body) return null;

  const db = await connectToDatabase();
  if (db) {
    try {
      await QuoteRequestModel.findByIdAndUpdate(id, {
        $push: { adminNotes: { ...note, createdAt: new Date(note.createdAt) } },
      });
      return note;
    } catch (e) {
      console.error('addQuoteAdminNote error:', e);
      return null;
    }
  }

  const quote = await getManagedQuoteById(id);
  if (!quote) return null;
  quote.adminNotes = [...(quote.adminNotes || []), note];
  return note;
}

export async function updateQuoteFollowUp(
  id: string,
  update: {
    followUpDate?: string | null;
    followUpCompleted?: boolean;
  },
): Promise<QuoteRequestItem | null> {
  const db = await connectToDatabase();
  const payload: Record<string, unknown> = {};
  if (update.followUpDate !== undefined) {
    payload.followUpDate = update.followUpDate ? new Date(update.followUpDate) : null;
  }
  if (update.followUpCompleted !== undefined) {
    payload.followUpCompleted = update.followUpCompleted;
    payload.followUpCompletedAt = update.followUpCompleted ? new Date() : null;
  }

  if (db) {
    try {
      const updated = await QuoteRequestModel.findByIdAndUpdate(id, payload, { new: true }).lean();
      if (!updated) return null;
      return mapManagedQuote(updated);
    } catch (e) {
      console.error('updateQuoteFollowUp error:', e);
      return null;
    }
  }

  const quote = await getManagedQuoteById(id);
  if (!quote) return null;
  if (update.followUpDate !== undefined) quote.followUpDate = update.followUpDate;
  if (update.followUpCompleted !== undefined) {
    quote.followUpCompleted = update.followUpCompleted;
    quote.followUpCompletedAt = update.followUpCompleted ? new Date().toISOString() : null;
  }
  return quote;
}

export type QuotationInput = {
  quotationNumber?: string;
  quoteDate?: string;
  expiryDate?: string;
  customerName?: string;
  businessName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerLocation?: string;
  signSpecifications?: string;
  materials?: string;
  manufacturingCost?: number;
  installationCharges?: number;
  permitCharges?: number;
  otherCharges?: number;
  discount?: number;
  taxRatePercent?: number;
  paymentTerms?: string;
  estimatedCompletion?: string;
  additionalNotes?: string;
  status?: 'draft' | 'sent';
};

function buildQuotationFromInput(
  request: QuoteRequestItem,
  input: QuotationInput,
  existing?: CustomerQuotationItem,
): CustomerQuotationItem {
  const totals = calcQuotationTotals({
    manufacturingCost: input.manufacturingCost ?? existing?.manufacturingCost ?? 0,
    installationCharges: input.installationCharges ?? existing?.installationCharges ?? 0,
    permitCharges: input.permitCharges ?? existing?.permitCharges ?? 0,
    otherCharges: input.otherCharges ?? existing?.otherCharges ?? 0,
    discount: input.discount ?? existing?.discount ?? 0,
    taxRatePercent: input.taxRatePercent ?? existing?.taxRatePercent ?? 5,
  });

  const now = new Date().toISOString();
  const revision = existing ? existing.revision + (input.status === 'draft' && existing.status === 'sent' ? 1 : 0) : 1;

  return {
    id: existing?.id || randomUUID(),
    quoteRequestId: request.id,
    quotationNumber:
      input.quotationNumber ||
      existing?.quotationNumber ||
      `DSQ-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
    quoteDate: input.quoteDate || existing?.quoteDate || now.slice(0, 10),
    expiryDate:
      input.expiryDate ||
      existing?.expiryDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    customerName: input.customerName ?? existing?.customerName ?? request.fullName,
    businessName: input.businessName ?? existing?.businessName ?? request.businessName,
    customerEmail: input.customerEmail ?? existing?.customerEmail ?? request.email,
    customerPhone: input.customerPhone ?? existing?.customerPhone ?? request.phone,
    customerLocation: input.customerLocation ?? existing?.customerLocation ?? request.location,
    signSpecifications:
      input.signSpecifications ??
      existing?.signSpecifications ??
      [
        request.signType,
        request.estimatedDimensions,
        request.illuminationType,
        request.targetTimeline,
      ]
        .filter(Boolean)
        .join(' · '),
    materials: input.materials ?? existing?.materials ?? '',
    ...totals,
    paymentTerms:
      input.paymentTerms ??
      existing?.paymentTerms ??
      '50% deposit to begin fabrication. Balance due before installation.',
    estimatedCompletion: input.estimatedCompletion ?? existing?.estimatedCompletion ?? request.targetTimeline ?? '',
    additionalNotes: input.additionalNotes ?? existing?.additionalNotes ?? '',
    status: input.status ?? existing?.status ?? 'draft',
    revision: existing?.revision || revision,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    sentAt: existing?.sentAt,
    emailDeliveryStatus: existing?.emailDeliveryStatus,
    emailDeliveryError: existing?.emailDeliveryError,
    emailMessageId: existing?.emailMessageId,
  };
}

export async function saveQuotation(
  requestId: string,
  input: QuotationInput,
  quotationId?: string,
): Promise<CustomerQuotationItem | null> {
  const request = await getManagedQuoteById(requestId);
  if (!request) return null;

  const existing = quotationId
    ? (request.quotations || []).find((q) => q.id === quotationId)
    : undefined;
  const quotation = buildQuotationFromInput(request, input, existing);

  const db = await connectToDatabase();
  if (db) {
    try {
      if (existing) {
        await QuoteRequestModel.updateOne(
          { _id: requestId, 'quotations.id': quotationId },
          {
            $set: {
              'quotations.$': {
                ...quotation,
                createdAt: new Date(quotation.createdAt),
                updatedAt: new Date(quotation.updatedAt),
                sentAt: quotation.sentAt ? new Date(quotation.sentAt) : undefined,
              },
            },
          },
        );
      } else {
        await QuoteRequestModel.findByIdAndUpdate(requestId, {
          $push: {
            quotations: {
              ...quotation,
              createdAt: new Date(quotation.createdAt),
              updatedAt: new Date(quotation.updatedAt),
            },
          },
        });
      }
      return quotation;
    } catch (e) {
      console.error('saveQuotation error:', e);
      return null;
    }
  }

  if (!request.quotations) request.quotations = [];
  if (existing) {
    request.quotations = request.quotations.map((q) => (q.id === quotation.id ? quotation : q));
  } else {
    request.quotations.unshift(quotation);
  }
  return quotation;
}

export async function markQuotationSent(
  requestId: string,
  quotationId: string,
  delivery: {
    ok: boolean;
    skipped?: boolean;
    error?: string;
    messageId?: string;
  },
): Promise<CustomerQuotationItem | null> {
  const request = await getManagedQuoteById(requestId);
  if (!request) return null;
  const quotation = (request.quotations || []).find((q) => q.id === quotationId);
  if (!quotation) return null;

  const now = new Date().toISOString();
  if (delivery.ok) {
    quotation.status = 'sent';
    quotation.sentAt = now;
    quotation.emailDeliveryStatus = 'sent';
    quotation.emailDeliveryError = '';
    quotation.emailMessageId = delivery.messageId || '';
  } else {
    quotation.emailDeliveryStatus = delivery.skipped ? 'skipped' : 'failed';
    quotation.emailDeliveryError = delivery.error || '';
  }
  quotation.updatedAt = now;

  const db = await connectToDatabase();
  if (db) {
    try {
      await QuoteRequestModel.updateOne(
        { _id: requestId, 'quotations.id': quotationId },
        {
          $set: {
            'quotations.$': {
              ...quotation,
              createdAt: new Date(quotation.createdAt),
              updatedAt: new Date(quotation.updatedAt),
              sentAt: quotation.sentAt ? new Date(quotation.sentAt) : undefined,
            },
            ...(delivery.ok
              ? {
                  status: 'quoted',
                }
              : {}),
          },
          ...(delivery.ok
            ? {
                $push: {
                  statusHistory: {
                    id: randomUUID(),
                    status: 'quoted',
                    changedAt: new Date(),
                    changedBy: 'admin',
                    note: `Quotation ${quotation.quotationNumber} emailed to customer`,
                  },
                },
              }
            : {}),
        },
      );
      return quotation;
    } catch (e) {
      console.error('markQuotationSent error:', e);
      return null;
    }
  }

  if (delivery.ok) {
    request.status = 'quoted';
    request.statusHistory = [
      ...(request.statusHistory || []),
      {
        id: randomUUID(),
        status: 'quoted',
        changedAt: now,
        changedBy: 'admin',
        note: `Quotation ${quotation.quotationNumber} emailed to customer`,
      },
    ];
  }
  request.quotations = (request.quotations || []).map((q) => (q.id === quotationId ? quotation : q));
  return quotation;
}
