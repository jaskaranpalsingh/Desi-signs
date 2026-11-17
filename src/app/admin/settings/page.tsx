'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { WebsiteSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      setSuccess(false);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="py-16 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading website settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Website Settings & Global SEO
        </h1>
        <p className="text-xs text-neutral-500">
          Configure verified business contact data, Edmonton operating hours, and search engine metadata.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Website settings and SEO parameters saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-neutral-200 p-6 sm:p-8 rounded-xs shadow-xs text-xs">
        {/* Business Identity */}
        <div className="space-y-4">
          <div className="border-b border-neutral-200 pb-2">
            <h2 className="text-sm font-bold text-neutral-900">Business Identity & Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Company Legal Name</label>
              <input
                type="text"
                required
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Shop / Facility Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">City, Province, Postal Code</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  className="px-2 py-2 border border-neutral-300 rounded-xs"
                />
                <input
                  type="text"
                  value={settings.province}
                  onChange={(e) => setSettings({ ...settings, province: e.target.value })}
                  className="px-2 py-2 border border-neutral-300 rounded-xs"
                />
                <input
                  type="text"
                  value={settings.postalCode}
                  onChange={(e) => setSettings({ ...settings, postalCode: e.target.value })}
                  className="px-2 py-2 border border-neutral-300 rounded-xs"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Telephone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Inquiry Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Business Hours of Operation</label>
            <input
              type="text"
              value={settings.businessHours}
              onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
            />
          </div>
        </div>

        {/* Global SEO Settings */}
        <div className="space-y-4">
          <div className="border-b border-neutral-200 pb-2">
            <h2 className="text-sm font-bold text-neutral-900">Technical SEO & Meta Defaults</h2>
          </div>

          <div>
            <label className="block font-semibold mb-1">Default Meta Title</label>
            <input
              type="text"
              required
              value={settings.seoGlobalTitle}
              onChange={(e) => setSettings({ ...settings, seoGlobalTitle: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
            />
            <span className="text-[11px] text-neutral-400 mt-0.5 block">
              Optimal length: 50-60 characters
            </span>
          </div>

          <div>
            <label className="block font-semibold mb-1">Default Meta Description</label>
            <textarea
              rows={3}
              required
              value={settings.seoGlobalDescription}
              onChange={(e) => setSettings({ ...settings, seoGlobalDescription: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm leading-relaxed"
            ></textarea>
            <span className="text-[11px] text-neutral-400 mt-0.5 block">
              Optimal length: 140-160 characters
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white rounded-xs font-semibold hover:bg-neutral-800 cursor-pointer disabled:opacity-50 text-xs"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

