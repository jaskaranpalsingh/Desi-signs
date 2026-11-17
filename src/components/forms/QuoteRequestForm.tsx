'use client';

import React, { useEffect, useId, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  CloudUpload,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Ruler,
  User,
} from 'lucide-react';

const FALLBACK_SIGN_TYPES = [
  'Channel Letters (Front-Lit or Halo-Lit)',
  '3D Dimensional Architectural Letters',
  'Storefront Fascia / Lightbox Cabinet',
  'Freestanding Pylon & Roadside Monument',
  'Interior Reception & Lobby Logo Wall',
  'Custom LED Neon Sign',
  'Projecting Sidewalk Blade Sign',
  'Other / Custom Architectural Signage',
];

const ILLUMINATION_OPTIONS = [
  'Illuminated (Front or Halo LED)',
  'Reverse Halo-Lit (Silhouette Warm Glow)',
  'Push-Through Acrylic Glow',
  'Non-Illuminated (Architectural Metal / Acrylic)',
  'External Spotlights',
];

const TIMELINE_OPTIONS = [
  'Urgent (2-3 weeks)',
  'Within 4-6 weeks',
  'Within 2-3 months',
  'Planning / Budgeting Phase',
];

const ACCEPTED_EXTENSIONS = new Set(['pdf', 'ai', 'eps', 'svg', 'png', 'jpg', 'jpeg', 'webp']);
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

type QuoteFormProps = {
  signTypeOptions?: string[];
};

function SectionHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DC1421] text-[13px] font-bold text-white">
        {step}
      </span>
      <h3 className="text-[17px] font-bold tracking-tight text-[#111111]">{title}</h3>
    </div>
  );
}

const fieldClass =
  'w-full rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] py-3 pr-3.5 pl-10 text-[14px] text-[#111111] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#98A2B3] focus:border-[#DC1421] focus:bg-white focus:ring-[3px] focus:ring-[#DC1421]/15';

const selectClass =
  'w-full rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] px-3.5 py-3 text-[14px] text-[#111111] outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-[#DC1421] focus:bg-white focus:ring-[3px] focus:ring-[#DC1421]/15';

export function QuoteRequestForm({ signTypeOptions = [] }: QuoteFormProps) {
  const searchParams = useSearchParams();
  const prefillService = searchParams.get('service') || searchParams.get('product') || '';
  const nameId = useId();
  const businessId = useId();
  const emailId = useId();
  const phoneId = useId();
  const locationId = useId();
  const detailsId = useId();
  const fileId = useId();

  const baseSignTypes =
    signTypeOptions.filter(Boolean).length > 0 ? signTypeOptions.filter(Boolean) : FALLBACK_SIGN_TYPES;
  const signTypes = Array.from(
    new Set([...baseSignTypes, ...(prefillService ? [prefillService] : [])]),
  );

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    location: '',
    signType: prefillService || (signTypeOptions.filter(Boolean)[0] ?? FALLBACK_SIGN_TYPES[0]),
    estimatedDimensions: '',
    illuminationType: ILLUMINATION_OPTIONS[0],
    targetTimeline: TIMELINE_OPTIONS[1],
    budgetRange: '',
    projectDetails: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prefillService) {
      setFormData((prev) => ({ ...prev, signType: prefillService }));
    }
  }, [prefillService]);

  const defaultSignType = baseSignTypes[0] || FALLBACK_SIGN_TYPES[0];

  const resetForm = () => {
    setSuccess(null);
    setQuoteId(null);
    setUploadedFileName(null);
    setUploadError(null);
    setFieldErrors({});
    setFormData({
      fullName: '',
      businessName: '',
      email: '',
      phone: '',
      location: '',
      signType: defaultSignType,
      estimatedDimensions: '',
      illuminationType: ILLUMINATION_OPTIONS[0],
      targetTimeline: TIMELINE_OPTIONS[1],
      budgetRange: '',
      projectDetails: '',
    });
  };

  const validateClient = () => {
    const next: Record<string, string> = {};
    if (formData.fullName.trim().length < 2) next.fullName = 'Please enter your name.';
    if (formData.businessName.trim().length < 2) next.businessName = 'Business name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      next.email = 'Enter a valid work email.';
    }
    if (formData.phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a valid phone number.';
    if (formData.location.trim().length < 2) next.location = 'Job site location is required.';
    if (formData.projectDetails.trim().length < 10) {
      next.projectDetails = 'Please describe your project in a bit more detail.';
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFile = async (file: File | null) => {
    setUploadError(null);
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ACCEPTED_EXTENSIONS.has(ext)) {
      setUploadError('Unsupported file type. Use PDF, AI, EPS, SVG, PNG, or JPG.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError('File exceeds the 15MB limit.');
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }
      setUploadedFileName(data.fileName || file.name);
      setFormData((prev) => ({
        ...prev,
        projectDetails: `${prev.projectDetails}\n[Attached File: ${data.fileName} (${data.url})]`.trim(),
      }));
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || uploading) return;
    if (!validateClient()) {
      setError('Please correct the highlighted fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'request-a-quote' }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(
          data.message || 'Thank you! We have received your request and will contact you soon.',
        );
        setQuoteId(data.data?.id || null);
      } else {
        const serverFields = data.errors
          ? Object.fromEntries(
              Object.entries(data.errors as Record<string, string[]>).map(([k, v]) => [
                k,
                Array.isArray(v) ? v[0] : String(v),
              ]),
            )
          : {};
        setFieldErrors((prev) => ({ ...prev, ...serverFields }));
        setError(data.message || 'Please check your form entries.');
      }
    } catch {
      setError('A network error occurred. Please try again or contact us by phone.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-12"
        role="status"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DC1421] text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-[#111111]">
          Estimate Request Received
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#596579]">
          {success ||
            'Thank you! We have received your request and will contact you soon.'}
        </p>
        {quoteId && (
          <div className="mt-4 inline-block rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] px-4 py-2 font-mono text-xs text-[#596579]">
            Reference: {quoteId}
          </div>
        )}
        <div className="mt-6">
          <button
            type="button"
            onClick={resetForm}
            className="cursor-pointer text-xs font-semibold tracking-wider text-[#DC1421] uppercase underline-offset-4 hover:underline"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10"
    >
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-[#FFF5F5] px-4 py-3 text-[13px] text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Contact */}
      <section>
        <SectionHeading step={1} title="Contact & Business Details" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={nameId} className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
              Your Name *
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
              <input
                id={nameId}
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Your full name"
                className={fieldClass}
                aria-invalid={Boolean(fieldErrors.fullName)}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="mt-1 text-[12px] text-red-600">{fieldErrors.fullName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor={businessId}
              className="mb-1.5 block text-[13px] font-semibold text-[#111111]"
            >
              Business / Property Name *
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
              <input
                id={businessId}
                type="text"
                autoComplete="organization"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Business or property name"
                className={fieldClass}
                aria-invalid={Boolean(fieldErrors.businessName)}
              />
            </div>
            {fieldErrors.businessName && (
              <p className="mt-1 text-[12px] text-red-600">{fieldErrors.businessName}</p>
            )}
          </div>

          <div>
            <label htmlFor={emailId} className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
              Work Email *
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@business.com"
                className={fieldClass}
                aria-invalid={Boolean(fieldErrors.email)}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-[12px] text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor={phoneId} className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
              <input
                id={phoneId}
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(780) 000-0000"
                className={fieldClass}
                aria-invalid={Boolean(fieldErrors.phone)}
              />
            </div>
            {fieldErrors.phone && (
              <p className="mt-1 text-[12px] text-red-600">{fieldErrors.phone}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor={locationId}
            className="mb-1.5 block text-[13px] font-semibold text-[#111111]"
          >
            Sign Location / Job Site (Edmonton & Surrounding) *
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              id={locationId}
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Street address or area in Edmonton & surrounding"
              className={fieldClass}
              aria-invalid={Boolean(fieldErrors.location)}
            />
          </div>
          {fieldErrors.location && (
            <p className="mt-1 text-[12px] text-red-600">{fieldErrors.location}</p>
          )}
        </div>
      </section>

      {/* 2. Specs */}
      <section>
        <SectionHeading step={2} title="Signage Specifications" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
              Sign Category / Type *
            </label>
            <select
              value={formData.signType}
              onChange={(e) => setFormData({ ...formData, signType: e.target.value })}
              className={selectClass}
            >
              {signTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
              Illumination Preference
            </label>
            <select
              value={formData.illuminationType}
              onChange={(e) => setFormData({ ...formData, illuminationType: e.target.value })}
              className={selectClass}
            >
              {ILLUMINATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
              Estimated Dimensions (W × H)
            </label>
            <div className="relative">
              <Ruler className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
              <input
                type="text"
                value={formData.estimatedDimensions}
                onChange={(e) => setFormData({ ...formData, estimatedDimensions: e.target.value })}
                placeholder="e.g. 14 ft wide × 3 ft high"
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
              Target Installation Timeline
            </label>
            <select
              value={formData.targetTimeline}
              onChange={(e) => setFormData({ ...formData, targetTimeline: e.target.value })}
              className={selectClass}
            >
              {TIMELINE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 3. Description */}
      <section>
        <SectionHeading step={3} title="Project Description & Scope" />
        <div>
          <label htmlFor={detailsId} className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
            Tell us about your signage project *
          </label>
          <textarea
            id={detailsId}
            required
            rows={5}
            value={formData.projectDetails}
            onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
            placeholder="Describe the type of sign you need, approximate size, location, and any special requirements."
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] px-3.5 py-3 text-[14px] leading-relaxed text-[#111111] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#98A2B3] focus:border-[#DC1421] focus:bg-white focus:ring-[3px] focus:ring-[#DC1421]/15"
            aria-invalid={Boolean(fieldErrors.projectDetails)}
          />
          {fieldErrors.projectDetails && (
            <p className="mt-1 text-[12px] text-red-600">{fieldErrors.projectDetails}</p>
          )}
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-[13px] font-semibold text-[#111111]">
            Attach Logo, Drawing or Site Photo (Optional)
          </p>
          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-[#D0D5DD] bg-[#F8F9FA] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CloudUpload className="mt-0.5 h-5 w-5 shrink-0 text-[#DC1421]" />
              <div className="text-[12px] text-[#596579]">
                <span className="block font-semibold text-[#111111]">
                  {uploadedFileName ? uploadedFileName : 'Upload artwork or site photo'}
                </span>
                <span>PDF, AI, EPS, SVG, PNG, JPG · up to 15MB</span>
                {uploadError && <span className="mt-1 block text-red-600">{uploadError}</span>}
              </div>
            </div>
            <label
              htmlFor={fileId}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#111111] transition-colors hover:border-[#DC1421] hover:text-[#DC1421]"
            >
              {uploading ? 'Uploading…' : 'Choose File'}
              <input
                id={fileId}
                type="file"
                accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.webp"
                className="sr-only"
                disabled={uploading || loading}
                onChange={(e) => handleFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 border-t border-[#EEF0F3] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-[12px] leading-relaxed text-[#596579]">
          <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-[#DC1421]" />
          No obligation. Our team will review your request and contact you.
        </p>
        <button
          type="submit"
          disabled={loading || uploading}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#DC1421] px-6 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-[#B9101A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC1421]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              Submit Estimate Request <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
