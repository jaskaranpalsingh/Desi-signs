'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

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

export function ContactForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

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
      <div className="bg-white border border-neutral-200 p-8 rounded-xs text-center space-y-3 shadow-xs">
        <div className="w-10 h-10 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900">Message Delivered</h3>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">{success}</p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setSuccess(null);
              setFormData(EMPTY_FORM);
            }}
            className="text-xs font-semibold text-neutral-900 underline underline-offset-4"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-white border border-neutral-200 p-6 sm:p-8 rounded-xs shadow-xs space-y-5"
    >
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            maxLength={120}
            disabled={loading}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="John Doe"
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            maxLength={160}
            disabled={loading}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 disabled:opacity-60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            maxLength={40}
            disabled={loading}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(780) 555-0199"
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Subject *
          </label>
          <input
            type="text"
            required
            maxLength={200}
            disabled={loading}
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g. Sign maintenance / Storefront inquiry"
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 mb-1">
          Message *
        </label>
        <textarea
          required
          rows={5}
          maxLength={5000}
          minLength={10}
          disabled={loading}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can our Edmonton signage team assist your business?"
          className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 leading-relaxed disabled:opacity-60"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full sm:w-auto px-6 py-2.5 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...
            </>
          ) : (
            <>
              Send Inquiry <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
