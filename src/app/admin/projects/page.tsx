'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Loader2, X, Star } from 'lucide-react';
import { ProjectItem } from '@/lib/types';

function ProjectThumb({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith('/')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    );
  }
  return <Image src={src} alt={alt} fill className="object-cover" sizes="40px" />;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/projects', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      setSaving(true);
      setError(null);
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingProject),
      });
      const data = await res.json();
      if (data.success) {
        await fetchProjects();
        setEditingProject(null);
      } else {
        setError(data.message || 'Unable to save project.');
      }
    } catch {
      setError('Network error while saving project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Portfolio & Case Studies
          </h1>
          <p className="text-xs text-neutral-500">
            Publish projects to the website. Mark one project as Featured for the homepage banner.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingProject({
              title: '',
              slug: '',
              client: '',
              location: 'Edmonton, AB',
              category: 'Channel Letters',
              year: String(new Date().getFullYear()),
              summary: '',
              challenge: '',
              solution: '',
              materialsUsed: [],
              image: '',
              additionalImages: [],
              featured: false,
              published: true,
              order: projects.length + 1,
            })
          }
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xs bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" /> Add Case Study
        </button>
      </div>

      <div className="overflow-hidden rounded-xs border border-neutral-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-xs text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading case studies...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-500">No projects yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50 font-semibold tracking-wider text-neutral-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {projects.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xs border border-neutral-200 bg-neutral-100">
                          {p.image ? <ProjectThumb src={p.image} alt={p.title} /> : null}
                        </div>
                        <div>
                          <strong className="block font-semibold text-neutral-900">{p.title}</strong>
                          <span className="text-[11px] text-neutral-500">{p.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-xs px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                          p.published !== false
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {p.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DC1421]">
                          <Star className="h-3.5 w-3.5 fill-current" /> Banner
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{p.location}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.year}</td>
                    <td className="space-x-2 px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingProject(p)}
                        className="cursor-pointer p-1.5 text-neutral-600 hover:text-neutral-900"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="cursor-pointer p-1.5 text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingProject ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditingProject(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-xs border border-neutral-200 bg-white p-6 text-xs shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-lg font-bold text-neutral-900">
                {editingProject.id ? 'Edit Case Study' : 'Add Case Study'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="text-neutral-400 hover:text-neutral-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error ? (
              <div className="rounded-xs border border-red-200 bg-red-50 px-3 py-2 text-red-700">{error}</div>
            ) : null}

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block font-semibold">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Location *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.location || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, location: e.target.value })
                    }
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Year</label>
                  <input
                    type="text"
                    value={editingProject.year || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold">Category *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.category || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Display Order</label>
                  <input
                    type="number"
                    value={editingProject.order ?? 0}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        order: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold">Cover Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingProject.image || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  placeholder="/your-image.jpg or https://..."
                  className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.summary || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold">Client Challenge *</label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.challenge || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, challenge: e.target.value })
                  }
                  className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold">Engineered Solution *</label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.solution || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, solution: e.target.value })
                  }
                  className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                />
              </div>

              <div className="flex flex-wrap gap-5 border-t border-neutral-200 pt-3">
                <label className="inline-flex items-center gap-2 font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={editingProject.published !== false}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, published: e.target.checked })
                    }
                  />
                  Published on website
                </label>
                <label className="inline-flex items-center gap-2 font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.featured)}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, featured: e.target.checked })
                    }
                  />
                  Featured homepage banner
                </label>
              </div>
              <p className="text-[11px] text-neutral-500">
                Only one project is used for the homepage featured banner. Selecting Featured here
                clears Featured on other projects.
              </p>

              <div className="flex justify-end gap-3 border-t border-neutral-200 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="rounded-xs border border-neutral-300 px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xs bg-neutral-900 px-5 py-2 font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
