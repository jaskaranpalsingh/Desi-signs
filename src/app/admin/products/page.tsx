'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Package, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { ProductItem } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        setEditingProduct(null);
      }
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Products Management
          </h1>
          <p className="text-xs text-neutral-500">
            Maintain your catalogue of fabricated signage systems, warranties, and lead times.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingProduct({
              title: '',
              slug: '',
              category: 'Channel Letters',
              shortDescription: '',
              fullDescription: '',
              leadTime: '2 to 3 weeks',
              warranty: '5 Years',
              priceRange: 'Custom Quoted',
              image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
              customizationOptions: ['Font styling', 'Custom return paint'],
              materialSpecs: ['Marine Aluminum', 'Cast Acrylic'],
              featured: false,
              order: products.length + 1,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xs text-xs font-semibold hover:bg-neutral-800 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading products...
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Lead Time</th>
                <th className="py-3 px-4">Warranty</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-xs overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        <Image src={p.image} alt={p.title} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <strong className="text-neutral-900 font-semibold block">{p.title}</strong>
                        <span className="text-[11px] text-neutral-400 font-mono">/products/{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{p.category}</td>
                  <td className="py-3 px-4 text-neutral-600">{p.leadTime}</td>
                  <td className="py-3 px-4 text-neutral-600">{p.warranty}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-1.5 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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

      {editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-white rounded-xs border border-neutral-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 shadow-xl text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-lg font-bold text-neutral-900">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setEditingProduct(null)} className="text-neutral-400 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Lead Time</label>
                  <input
                    type="text"
                    value={editingProduct.leadTime || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, leadTime: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Warranty</label>
                  <input
                    type="text"
                    value={editingProduct.warranty || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Technical Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.fullDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-neutral-300 rounded-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xs font-semibold hover:bg-neutral-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

