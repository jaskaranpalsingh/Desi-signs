'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { BlogPostItem } from '@/lib/types';
import { BLOG_CATEGORIES, slugifyBlogTitle } from '@/lib/blog-constants';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

type StatusFilter = 'all' | 'published' | 'draft';

const emptyBlog = (): Partial<BlogPostItem> => ({
  title: '',
  slug: '',
  shortDescription: '',
  content: '<p></p>',
  author: 'Harpreet Singh',
  authorRole: 'Senior Signage Engineer',
  category: BLOG_CATEGORIES[0],
  tags: ['Edmonton', 'Signage'],
  publishedDate: new Date().toISOString().split('T')[0],
  readTime: '5 min read',
  image: '',
  imageAlt: '',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  canonicalUrl: '',
  published: false,
});

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPostItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [slugTouched, setSlugTouched] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/admin/blogs?${params.toString()}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
      } else {
        setError(data.message || 'Failed to load blogs');
      }
    } catch {
      setError('Failed to load blogs. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchBlogs]);

  const openCreate = () => {
    setError('');
    setSuccess('');
    setSlugTouched(false);
    setEditingBlog(emptyBlog());
  };

  const openEdit = (blog: BlogPostItem) => {
    setError('');
    setSuccess('');
    setSlugTouched(true);
    setEditingBlog({ ...blog });
  };

  const handleTitleChange = (title: string) => {
    if (!editingBlog) return;
    const next: Partial<BlogPostItem> = { ...editingBlog, title };
    if (!slugTouched) {
      next.slug = slugifyBlogTitle(title);
    }
    if (!editingBlog.metaTitle) {
      next.metaTitle = title;
    }
    setEditingBlog(next);
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file || !editingBlog) return;
    try {
      setUploading(true);
      setError('');
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }
      setEditingBlog({
        ...editingBlog,
        image: data.url,
        imageAlt: editingBlog.imageAlt || editingBlog.title || file.name,
      });
    } catch (e: any) {
      setError(e.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const saveBlog = async (published: boolean) => {
    if (!editingBlog) return;
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        ...editingBlog,
        published,
        tags: Array.isArray(editingBlog.tags)
          ? editingBlog.tags
          : String(editingBlog.tags || '')
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean),
      };

      const isUpdate = Boolean(editingBlog.id);
      const res = await fetch(
        isUpdate ? `/api/admin/blogs/${editingBlog.id}` : '/api/admin/blogs',
        {
          method: isUpdate ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        const fieldErrors = data.errors
          ? Object.values(data.errors as Record<string, string[]>)
              .flat()
              .join(' ')
          : '';
        throw new Error(data.message || fieldErrors || 'Save failed');
      }

      setSuccess(
        published
          ? 'Blog published. It is now live on the public Blog page.'
          : 'Draft saved. It will not appear on the public website.',
      );
      setEditingBlog(null);
      await fetchBlogs();
    } catch (e: any) {
      setError(e.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post permanently? This cannot be undone.')) return;
    try {
      setError('');
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Delete failed');
      }
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      setSuccess('Blog deleted.');
    } catch (e: any) {
      setError(e.message || 'Failed to delete blog');
    }
  };

  const togglePublish = async (blog: BlogPostItem) => {
    try {
      setError('');
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...blog, published: !blog.published }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Update failed');
      }
      await fetchBlogs();
      setSuccess(
        !blog.published
          ? 'Blog published and now visible on the website.'
          : 'Blog unpublished and removed from the public website.',
      );
    } catch (e: any) {
      setError(e.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Blog Management</h1>
          <p className="text-xs text-neutral-500">
            Create, draft, publish, and manage articles that appear on the public DESI SIGNS Blog.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xs bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" /> Create Article
        </button>
      </div>

      {(error || success) && (
        <div
          className={`rounded-xs border px-4 py-3 text-xs ${
            error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {error || success}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xs border border-neutral-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs by title…"
            className="w-full rounded-xs border border-neutral-300 py-2 pr-3 pl-9 text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['all', 'All'],
              ['published', 'Published'],
              ['draft', 'Draft'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`cursor-pointer rounded-xs border px-3 py-1.5 text-[11px] font-semibold ${
                statusFilter === value
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xs border border-neutral-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-xs text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading articles…
          </div>
        ) : blogs.length === 0 ? (
          <div className="space-y-2 px-6 py-16 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="text-sm font-semibold text-neutral-800">No blog posts found</p>
            <p className="text-xs text-neutral-500">
              Create your first article, or adjust the search / status filters.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-50 font-semibold tracking-wider text-neutral-500 uppercase">
              <tr>
                <th className="px-4 py-3">Article</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {blogs.map((b) => (
                <tr key={b.id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xs border border-neutral-200 bg-neutral-100">
                        {b.image ? (
                          <Image
                            src={b.image}
                            alt={b.imageAlt || b.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-neutral-400">
                            TXT
                          </div>
                        )}
                      </div>
                      <div>
                        <strong className="block font-semibold text-neutral-900">{b.title}</strong>
                        <span className="font-mono text-[11px] text-neutral-400">/blog/{b.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{b.category}</td>
                  <td className="px-4 py-3 text-neutral-600">{b.publishedDate}</td>
                  <td className="px-4 py-3">
                    {b.published ? (
                      <span className="rounded-xs border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-xs bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="space-x-1 px-4 py-3 text-right">
                    {b.published && (
                      <Link
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        className="inline-flex p-1.5 text-neutral-600 hover:text-neutral-900"
                        title="View live"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => togglePublish(b)}
                      className="inline-flex cursor-pointer p-1.5 text-neutral-600 hover:text-neutral-900"
                      title={b.published ? 'Unpublish' : 'Publish'}
                    >
                      {b.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => openEdit(b)}
                      className="inline-flex cursor-pointer p-1.5 text-neutral-600 hover:text-neutral-900"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="inline-flex cursor-pointer p-1.5 text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editingBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditingBlog(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-xs border border-neutral-200 bg-white p-6 text-xs shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-lg font-bold text-neutral-900">
                {editingBlog.id ? 'Edit Blog Article' : 'Compose Blog Article'}
              </h2>
              <button
                onClick={() => setEditingBlog(null)}
                className="cursor-pointer text-neutral-400 hover:text-neutral-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="rounded-xs border border-red-200 bg-red-50 px-3 py-2 text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold">Blog Title *</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.slug || ''}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setEditingBlog({
                        ...editingBlog,
                        slug: slugifyBlogTitle(e.target.value) || e.target.value,
                      });
                    }}
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block font-semibold">Category *</label>
                  <select
                    required
                    value={editingBlog.category || BLOG_CATEGORIES[0]}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  >
                    {BLOG_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Author</label>
                  <input
                    type="text"
                    value={editingBlog.author || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Publish Date *</label>
                  <input
                    type="date"
                    required
                    value={editingBlog.publishedDate || ''}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, publishedDate: e.target.value })
                    }
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold">Read Time</label>
                  <input
                    type="text"
                    value={editingBlog.readTime || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={
                      Array.isArray(editingBlog.tags)
                        ? editingBlog.tags.join(', ')
                        : editingBlog.tags || ''
                    }
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold">Featured Image (optional)</label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="url"
                    value={editingBlog.image || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                    placeholder="https://… or /uploads/…"
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                  <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xs border border-neutral-300 px-3 py-2 font-semibold hover:bg-neutral-50">
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? 'Uploading…' : 'Upload'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                {editingBlog.image && (
                  <div className="relative mt-2 h-28 w-full overflow-hidden rounded-xs border border-neutral-200 bg-neutral-50 sm:w-56">
                    <Image
                      src={editingBlog.image}
                      alt={editingBlog.imageAlt || editingBlog.title || 'Featured'}
                      fill
                      className="object-cover"
                      sizes="224px"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block font-semibold">Image Alt Text</label>
                <input
                  type="text"
                  value={editingBlog.imageAlt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, imageAlt: e.target.value })}
                  className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={editingBlog.shortDescription || ''}
                  onChange={(e) =>
                    setEditingBlog({ ...editingBlog, shortDescription: e.target.value })
                  }
                  className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold">Full Blog Content *</label>
                <RichTextEditor
                  value={editingBlog.content || ''}
                  onChange={(content) => setEditingBlog({ ...editingBlog, content })}
                />
              </div>

              <div className="rounded-xs border border-neutral-200 bg-neutral-50 p-3">
                <p className="mb-2 font-semibold text-neutral-800">SEO Details</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-semibold">Meta Title</label>
                    <input
                      type="text"
                      value={editingBlog.metaTitle || ''}
                      onChange={(e) =>
                        setEditingBlog({ ...editingBlog, metaTitle: e.target.value })
                      }
                      className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold">Focus Keyword</label>
                    <input
                      type="text"
                      value={editingBlog.focusKeyword || ''}
                      onChange={(e) =>
                        setEditingBlog({ ...editingBlog, focusKeyword: e.target.value })
                      }
                      className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="mb-1 block font-semibold">Meta Description</label>
                  <textarea
                    rows={2}
                    value={editingBlog.metaDescription || ''}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, metaDescription: e.target.value })
                    }
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
                <div className="mt-3">
                  <label className="mb-1 block font-semibold">Canonical URL (optional)</label>
                  <input
                    type="url"
                    value={editingBlog.canonicalUrl || ''}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, canonicalUrl: e.target.value })
                    }
                    placeholder="Leave blank to use /blog/your-slug"
                    className="w-full rounded-xs border border-neutral-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse justify-end gap-2 border-t border-neutral-200 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="cursor-pointer rounded-xs border border-neutral-300 px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => saveBlog(false)}
                  className="cursor-pointer rounded-xs border border-neutral-300 px-4 py-2 font-semibold hover:bg-neutral-50 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Draft'}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => saveBlog(true)}
                  className="cursor-pointer rounded-xs bg-neutral-900 px-5 py-2 font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
                >
                  {saving ? 'Publishing…' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
