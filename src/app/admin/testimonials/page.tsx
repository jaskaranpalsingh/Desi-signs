'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Plus, Trash2, Loader2, X, Star } from 'lucide-react';
import { TestimonialItem } from '@/lib/types';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    clientName: '',
    companyName: '',
    role: 'Owner',
    content: '',
    projectType: 'Channel Letters',
    location: 'Edmonton, AB',
    rating: 5,
    featured: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (data.success) {
        fetchTestimonials();
        setIsAdding(false);
        setNewItem({
          clientName: '',
          companyName: '',
          role: 'Owner',
          content: '',
          projectType: 'Channel Letters',
          location: 'Edmonton, AB',
          rating: 5,
          featured: true,
        });
      }
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Testimonials Management
          </h1>
          <p className="text-xs text-neutral-500">
            Maintain verified customer endorsements and commercial reviews.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xs text-xs font-semibold hover:bg-neutral-800 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading testimonials...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-5 border border-neutral-200 rounded-xs bg-neutral-50/50 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-neutral-900">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-neutral-900" />
                      ))}
                    </div>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-200 text-xs">
                  <strong className="text-neutral-900 font-semibold block">{t.clientName}</strong>
                  <span className="text-neutral-500">
                    {t.role}, {t.companyName} • {t.location}
                  </span>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Project: {t.projectType}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAdding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsAdding(false)}
        >
          <div
            className="bg-white rounded-xs border border-neutral-200 max-w-md w-full p-6 space-y-4 shadow-xl text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-base font-bold text-neutral-900">Add Testimonial</h2>
              <button onClick={() => setIsAdding(false)} className="text-neutral-400 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newItem.clientName}
                    onChange={(e) => setNewItem({ ...newItem, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={newItem.companyName}
                    onChange={(e) => setNewItem({ ...newItem, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Client Role</label>
                  <input
                    type="text"
                    value={newItem.role}
                    onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Signage Project Type</label>
                  <input
                    type="text"
                    value={newItem.projectType}
                    onChange={(e) => setNewItem({ ...newItem, projectType: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Review Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xs font-semibold hover:bg-neutral-800 disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

