'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Wrench, Plus, Edit2, Trash2, Loader2, X, Check } from 'lucide-react';
import { ServiceItem } from '@/lib/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });
      const data = await res.json();
      if (data.success) {
        fetchServices();
        setEditingService(null);
      }
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this commercial service?')) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Services Management
          </h1>
          <p className="text-xs text-neutral-500">
            Add, update, or reorganize commercial signage offerings and technical specifications.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingService({
              title: '',
              slug: '',
              subtitle: '',
              shortDescription: '',
              fullDescription: '',
              image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
              features: ['CSA / UL Approved', 'Sub-Zero Tested', 'Full Permit Support'],
              specifications: [{ label: 'Warranty', value: '5 Years' }],
              materials: ['Aluminum', 'Cast Acrylic'],
              applications: ['Retail', 'Corporate'],
              featured: false,
              order: services.length + 1,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xs text-xs font-semibold hover:bg-neutral-800 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Services List Table */}
      <div className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading services...
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Slug / URL</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-xs overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        <Image src={s.image} alt={s.title} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <strong className="text-neutral-900 font-semibold block">{s.title}</strong>
                        <span className="text-[11px] text-neutral-500 line-clamp-1">{s.shortDescription}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-500">/services/{s.slug}</td>
                  <td className="py-3 px-4">
                    {s.featured ? (
                      <span className="text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded-xs font-semibold">
                        Featured
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">{s.order}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingService(s)}
                      className="p-1.5 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {editingService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditingService(null)}
        >
          <div
            className="bg-white rounded-xs border border-neutral-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-lg font-bold text-neutral-900">
                {editingService.id ? 'Edit Commercial Service' : 'Add New Commercial Service'}
              </h2>
              <button onClick={() => setEditingService(null)} className="text-neutral-400 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingService.slug || ''}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingService.subtitle || ''}
                  onChange={(e) => setEditingService({ ...editingService, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingService.image || ''}
                  onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDescription || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Full Engineering Description *</label>
                <textarea
                  rows={4}
                  required
                  value={editingService.fullDescription || ''}
                  onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
                  <input
                    type="checkbox"
                    checked={Boolean(editingService.featured)}
                    onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                    className="rounded-xs"
                  />
                  Featured on Homepage
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-700">Display Order:</span>
                  <input
                    type="number"
                    value={editingService.order ?? 0}
                    onChange={(e) => setEditingService({ ...editingService, order: Number(e.target.value) })}
                    className="w-20 px-2 py-1 border border-neutral-300 rounded-xs text-center"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 border border-neutral-300 rounded-xs font-semibold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xs font-semibold hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

