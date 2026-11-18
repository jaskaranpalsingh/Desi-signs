'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const SUCCESS_MESSAGE =
  "Thank you for contacting DESI SIGNS! We've received your message and will get back to you soon.";
const FAILURE_MESSAGE =
  "Sorry, we couldn't send your message. Please try again or contact us directly.";

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  website: '',
};

const inputClass =
  'w-full rounded-[13px] border border-[#D5DBE5] bg-white px-3.5 py-3 text-[14.5px] text-[#111827] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#98A2B3] focus:border-[#DC001B] focus:ring-[3px] focus:ring-[#DC001B]/15 disabled:opacity-60';

export function ContactForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const reduceMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submittingRef.current) return;

    submittingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSuccess(typeof data.message === 'string' ? data.message : SUCCESS_MESSAGE);
        setFormData(EMPTY_FORM);
      } else {
        setError(
          typeof data.message === 'string' && data.message
            ? data.message
            : FAILURE_MESSAGE,
        );
      }
    } catch {
      setError(FAILURE_MESSAGE);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  if (success) {
    return (
      <motion.div
        className="border border-[#E5E7EB] bg-white px-6 py-10 text-center sm:px-8"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DC001B] text-white">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-tight text-[#111827]">
          Message delivered
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-[#667085]">
          {success}
        </p>
        <button
          type="button"
          onClick={() => {
            setSuccess(null);
            setFormData(EMPTY_FORM);
          }}
          className="mt-5 cursor-pointer text-[13px] font-semibold text-[#DC001B] underline underline-offset-4 transition-colors hover:text-[#B80017]"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative space-y-5 border border-[#E5E7EB] bg-white p-6 sm:p-8"
      noValidate={false}
    >
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 border-l-[3px] border-[#DC001B] bg-[#FDECEF] px-3.5 py-3 text-[13px] text-[#9F1239]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Honeypot — hidden from people, filled by many bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-fullName"
            className="mb-1.5 block text-[13px] font-semibold text-[#111827]"
          >
            Full name *
          </label>
          <input
            id="contact-fullName"
            type="text"
            required
            maxLength={120}
            disabled={loading}
            autoComplete="name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Your name"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-[13px] font-semibold text-[#111827]"
          >
            Email *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            maxLength={160}
            disabled={loading}
            autoComplete="email"
            inputMode="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-phone"
            className="mb-1.5 block text-[13px] font-semibold text-[#111827]"
          >
            Phone <span className="font-normal text-[#98A2B3]">(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            maxLength={40}
            disabled={loading}
            autoComplete="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(780) 555-0199"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="mb-1.5 block text-[13px] font-semibold text-[#111827]"
          >
            Subject *
          </label>
          <input
            id="contact-subject"
            type="text"
            required
            maxLength={200}
            disabled={loading}
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g. Storefront inquiry"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-[13px] font-semibold text-[#111827]"
        >
          Message *
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          maxLength={5000}
          minLength={10}
          disabled={loading}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can our Edmonton signage team help?"
          className={`${inputClass} min-h-[140px] resize-y leading-relaxed`}
        />
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[13px] bg-[#DC001B] px-6 py-3.5 text-[14.5px] font-bold text-white transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#B80017] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC001B]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send inquiry
              <Send
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
