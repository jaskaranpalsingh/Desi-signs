import {
  ServiceItem,
  ProductItem,
  ProjectItem,
  GalleryItem,
  BlogPostItem,
  TestimonialItem,
  QuoteRequestItem,
  ContactInquiryItem,
  WebsiteSettings,
} from './types';
import {
  initialServices,
  initialProducts,
  initialProjects,
  initialGallery,
  initialBlogs,
  initialTestimonials,
  initialSettings,
} from './data/initial-data';
import { connectToDatabase, DatabaseUnavailableError, getMongoConnectionError } from './db';
import {
  ServiceModel,
  ProductModel,
  ProjectModel,
  GalleryModel,
  BlogPostModel,
  TestimonialModel,
  QuoteRequestModel,
  ContactInquiryModel,
  SettingsModel,
} from './models';
import { sanitizeBlogHtml, looksLikeHtml } from './sanitize';
import { estimateReadTime, normalizeBlogCategory, slugifyBlogTitle } from './blog-constants';

// Fallback in-memory state with deep clone
class MemoryStore {
  services: ServiceItem[] = JSON.parse(JSON.stringify(initialServices));
  products: ProductItem[] = JSON.parse(JSON.stringify(initialProducts));
  projects: ProjectItem[] = JSON.parse(JSON.stringify(initialProjects));
  gallery: GalleryItem[] = JSON.parse(JSON.stringify(initialGallery));
  blogs: BlogPostItem[] = JSON.parse(JSON.stringify(initialBlogs));
  testimonials: TestimonialItem[] = JSON.parse(JSON.stringify(initialTestimonials));
  quotes: QuoteRequestItem[] = [];
  inquiries: ContactInquiryItem[] = [];
  settings: WebsiteSettings = JSON.parse(JSON.stringify(initialSettings));
}

declare global {
  // eslint-disable-next-line no-var
  var memoryStoreInstance: MemoryStore | undefined;
}

const memStore = global.memoryStoreInstance || new MemoryStore();
if (!global.memoryStoreInstance) {
  global.memoryStoreInstance = memStore;
}

function mapDocId<T extends Record<string, any>>(doc: any): T {
  const { _id, __v, ...rest } = doc;
  return { ...rest, id: _id?.toString?.() || doc.id } as T;
}

/** One-time CMS seed marker so empty collections are not re-filled after intentional deletes. */
async function ensureSeedOnce(
  key: string,
  countDocuments: () => Promise<number>,
  seed: () => Promise<void>,
): Promise<void> {
  const db = await connectToDatabase();
  if (!db?.connection?.db) return;
  const markers = db.connection.db.collection('_cms_seeds');
  const existing = await markers.findOne({ key });
  if (existing) return;
  const count = await countDocuments();
  if (count === 0) {
    await seed();
  }
  await markers.updateOne({ key }, { $set: { key, seededAt: new Date() } }, { upsert: true });
}

export async function isDatabaseConnected(): Promise<boolean> {
  const db = await connectToDatabase();
  return Boolean(db);
}

let cmsSeedPromise: Promise<void> | null = null;

export async function ensureCmsContentSeeded(): Promise<void> {
  const db = await connectToDatabase();
  if (!db) return;
  if (!cmsSeedPromise) {
    cmsSeedPromise = (async () => {
      try {
        await ensureSeedOnce(
          'services',
          () => ServiceModel.countDocuments(),
          async () => {
            await ServiceModel.insertMany(
              initialServices.map(({ id: _id, ...rest }) => rest),
              { ordered: false },
            );
          },
        );
        await ensureSeedOnce(
          'products',
          () => ProductModel.countDocuments(),
          async () => {
            await ProductModel.insertMany(
              initialProducts.map(({ id: _id, ...rest }) => rest),
              { ordered: false },
            );
          },
        );
        await ensureSeedOnce(
          'projects',
          () => ProjectModel.countDocuments(),
          async () => {
            await ProjectModel.insertMany(
              initialProjects.map(({ id: _id, ...rest }) => rest),
              { ordered: false },
            );
          },
        );
        await ensureSeedOnce(
          'gallery',
          () => GalleryModel.countDocuments(),
          async () => {
            await GalleryModel.insertMany(
              initialGallery.map(({ id: _id, ...rest }) => rest),
              { ordered: false },
            );
          },
        );
        await ensureSeedOnce(
          'testimonials',
          () => TestimonialModel.countDocuments(),
          async () => {
            await TestimonialModel.insertMany(
              initialTestimonials.map(({ id: _id, ...rest }) => rest),
              { ordered: false },
            );
          },
        );
        await ensureSeedOnce(
          'blogs',
          () => BlogPostModel.countDocuments(),
          async () => {
            await BlogPostModel.insertMany(
              initialBlogs.map(({ id: _id, ...rest }) => rest),
              { ordered: false },
            );
          },
        );
        await ensureSeedOnce(
          'settings',
          () => SettingsModel.countDocuments(),
          async () => {
            await SettingsModel.create(initialSettings);
          },
        );
      } catch (error) {
        console.warn('CMS seed error:', error);
        cmsSeedPromise = null;
      }
    })();
  }
  await cmsSeedPromise;
}

// ----------------- SERVICES -----------------
export async function getServices(): Promise<ServiceItem[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ensureCmsContentSeeded();
      const items = await ServiceModel.find().sort({ order: 1 }).lean();
      return items.map((doc: any) => mapDocId<ServiceItem>(doc));
    } catch (e) {
      console.error('Error querying ServiceModel:', e);
    }
  }
  return [...memStore.services].sort((a, b) => a.order - b.order);
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) || null;
}

export async function saveService(serviceData: Partial<ServiceItem>): Promise<ServiceItem> {
  const db = await connectToDatabase();
  if (db) {
    try {
      if (serviceData.id && serviceData.id.length === 24) {
        const updated = await ServiceModel.findByIdAndUpdate(serviceData.id, serviceData, { new: true }).lean();
        if (updated) return { ...updated, id: updated._id.toString() } as ServiceItem;
      } else {
        const created = await ServiceModel.create(serviceData);
        return { ...created.toObject(), id: created._id.toString() } as ServiceItem;
      }
    } catch (e) {
      console.error('Error saving to ServiceModel:', e);
    }
  }

  // Memory fallback
  if (serviceData.id) {
    const idx = memStore.services.findIndex((s) => s.id === serviceData.id);
    if (idx !== -1) {
      memStore.services[idx] = { ...memStore.services[idx], ...serviceData } as ServiceItem;
      return memStore.services[idx];
    }
  }
  const newItem: ServiceItem = {
    id: 'srv-' + Date.now(),
    slug: serviceData.slug || 'service-' + Date.now(),
    title: serviceData.title || 'New Service',
    subtitle: serviceData.subtitle || '',
    shortDescription: serviceData.shortDescription || '',
    fullDescription: serviceData.fullDescription || '',
    features: serviceData.features || [],
    specifications: serviceData.specifications || [],
    materials: serviceData.materials || [],
    applications: serviceData.applications || [],
    image: serviceData.image || 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: serviceData.galleryImages || [],
    metaTitle: serviceData.metaTitle || '',
    metaDescription: serviceData.metaDescription || '',
    featured: Boolean(serviceData.featured),
    order: serviceData.order ?? memStore.services.length + 1,
  };
  memStore.services.push(newItem);
  return newItem;
}

export async function deleteService(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ServiceModel.findByIdAndDelete(id);
      return true;
    } catch (e) {}
  }
  const idx = memStore.services.findIndex((s) => s.id === id);
  if (idx !== -1) {
    memStore.services.splice(idx, 1);
    return true;
  }
  return false;
}

// ----------------- PRODUCTS -----------------
export async function getProducts(): Promise<ProductItem[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ensureCmsContentSeeded();
      const items = await ProductModel.find().sort({ order: 1 }).lean();
      return items.map((doc: any) => mapDocId<ProductItem>(doc));
    } catch (e) {
      console.error('Error querying ProductModel:', e);
    }
  }
  return [...memStore.products].sort((a, b) => a.order - b.order);
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function saveProduct(productData: Partial<ProductItem>): Promise<ProductItem> {
  const db = await connectToDatabase();
  if (db) {
    try {
      if (productData.id && productData.id.length === 24) {
        const updated = await ProductModel.findByIdAndUpdate(productData.id, productData, { new: true }).lean();
        if (updated) return { ...updated, id: updated._id.toString() } as ProductItem;
      } else {
        const created = await ProductModel.create(productData);
        return { ...created.toObject(), id: created._id.toString() } as ProductItem;
      }
    } catch (e) {}
  }

  if (productData.id) {
    const idx = memStore.products.findIndex((p) => p.id === productData.id);
    if (idx !== -1) {
      memStore.products[idx] = { ...memStore.products[idx], ...productData } as ProductItem;
      return memStore.products[idx];
    }
  }
  const newItem: ProductItem = {
    id: 'prod-' + Date.now(),
    slug: productData.slug || 'product-' + Date.now(),
    title: productData.title || 'New Product',
    category: productData.category || 'Signage',
    shortDescription: productData.shortDescription || '',
    fullDescription: productData.fullDescription || '',
    leadTime: productData.leadTime || '2-3 weeks',
    warranty: productData.warranty || '5 Years',
    customizationOptions: productData.customizationOptions || [],
    materialSpecs: productData.materialSpecs || [],
    image: productData.image || 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: productData.galleryImages || [],
    priceRange: productData.priceRange || 'Custom Quoted',
    featured: Boolean(productData.featured),
    order: productData.order ?? memStore.products.length + 1,
  };
  memStore.products.push(newItem);
  return newItem;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ProductModel.findByIdAndDelete(id);
      return true;
    } catch (e) {}
  }
  const idx = memStore.products.findIndex((p) => p.id === id);
  if (idx !== -1) {
    memStore.products.splice(idx, 1);
    return true;
  }
  return false;
}

const PLACEHOLDER_PROJECT_SLUGS = [
  'the-glasshouse-bistro-south-edmonton',
  'summit-health-wellness-strathcona',
  'apex-commercial-plaza-st-albert-trail',
  'kensington-roasters-downtown-edmonton',
];

function mapProjectDoc(doc: any): ProjectItem {
  return {
    ...mapDocId<ProjectItem>(doc),
    published: doc.published !== false,
    featured: Boolean(doc.featured),
    additionalImages: Array.isArray(doc.additionalImages) ? doc.additionalImages : [],
    materialsUsed: Array.isArray(doc.materialsUsed) ? doc.materialsUsed : [],
  };
}

let portfolioSyncPromise: Promise<void> | null = null;

/** Insert missing real portfolio seeds; never overwrite admin-edited Mongo documents. */
async function ensurePortfolioProjectsSynced(): Promise<void> {
  const db = await connectToDatabase();
  if (!db) return;
  if (!portfolioSyncPromise) {
    portfolioSyncPromise = (async () => {
      try {
        for (const seed of initialProjects) {
          const { id: _id, ...rest } = seed;
          const existing = await ProjectModel.findOne({ slug: seed.slug }).lean();
          if (!existing) {
            await ProjectModel.create({ ...rest, published: rest.published !== false });
          }
        }
        await ProjectModel.updateMany(
          { slug: { $in: PLACEHOLDER_PROJECT_SLUGS } },
          { $set: { published: false } },
        );
      } catch (e) {
        console.error('Portfolio sync failed:', e);
        portfolioSyncPromise = null;
      }
    })();
  }
  await portfolioSyncPromise;
}

function sortProjects(projects: ProjectItem[]): ProjectItem[] {
  return [...projects].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

// ----------------- PROJECTS -----------------
export async function getProjects(): Promise<ProjectItem[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ensureCmsContentSeeded();
      await ensurePortfolioProjectsSynced();
      const items = await ProjectModel.find().sort({ order: 1 }).lean();
      return sortProjects(items.map((doc: any) => mapProjectDoc(doc)));
    } catch (e) {
      console.error('Error querying ProjectModel:', e);
    }
  }
  return sortProjects(
    memStore.projects.map((p) => ({
      ...p,
      published: p.published !== false,
    })),
  );
}

/** Public website listings — published projects only. */
export async function getPublishedProjects(): Promise<ProjectItem[]> {
  const all = await getProjects();
  return all.filter((p) => p.published !== false);
}

export async function getProjectBySlug(
  slug: string,
  options?: { includeUnpublished?: boolean },
): Promise<ProjectItem | null> {
  const projects = await getProjects();
  const found = projects.find((p) => p.slug === slug);
  if (!found) return null;
  if (!options?.includeUnpublished && found.published === false) return null;
  return found;
}

export async function saveProject(projectData: Partial<ProjectItem>): Promise<ProjectItem> {
  const db = await connectToDatabase();
  const payload = {
    ...projectData,
    featured: Boolean(projectData.featured),
    published: projectData.published !== false,
  };

  if (db) {
    try {
      if (payload.featured) {
        const excludeId =
          payload.id && payload.id.length === 24 ? payload.id : undefined;
        await ProjectModel.updateMany(
          excludeId ? { _id: { $ne: excludeId } } : {},
          { $set: { featured: false } },
        );
      }

      if (payload.id && payload.id.length === 24) {
        const updated = await ProjectModel.findByIdAndUpdate(payload.id, payload, {
          new: true,
        }).lean();
        if (updated) return mapProjectDoc(updated);
      } else {
        const created = await ProjectModel.create(payload);
        return mapProjectDoc(created.toObject());
      }
    } catch (e) {
      console.error('Error saving project:', e);
      throw e;
    }
  }

  if (payload.featured) {
    memStore.projects.forEach((p) => {
      if (p.id !== payload.id) p.featured = false;
    });
  }

  if (payload.id) {
    const idx = memStore.projects.findIndex((p) => p.id === payload.id);
    if (idx !== -1) {
      memStore.projects[idx] = { ...memStore.projects[idx], ...payload } as ProjectItem;
      return memStore.projects[idx];
    }
  }
  const newItem: ProjectItem = {
    id: 'proj-' + Date.now(),
    slug: payload.slug || 'project-' + Date.now(),
    title: payload.title || 'New Project',
    client: payload.client || '',
    location: payload.location || 'Edmonton, AB',
    category: payload.category || 'Commercial Signage',
    year: payload.year || '2025',
    summary: payload.summary || '',
    challenge: payload.challenge || '',
    solution: payload.solution || '',
    materialsUsed: payload.materialsUsed || [],
    image: payload.image || '/d0d97e90-4168-44ff-9e37-bdb1211172f3.jpg',
    additionalImages: payload.additionalImages || [],
    featured: Boolean(payload.featured),
    published: payload.published !== false,
    order: payload.order ?? memStore.projects.length + 1,
  };
  memStore.projects.push(newItem);
  return newItem;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ProjectModel.findByIdAndDelete(id);
      return true;
    } catch (e) {}
  }
  const idx = memStore.projects.findIndex((p) => p.id === id);
  if (idx !== -1) {
    memStore.projects.splice(idx, 1);
    return true;
  }
  return false;
}

// ----------------- GALLERY -----------------
export async function getGallery(): Promise<GalleryItem[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ensureCmsContentSeeded();
      const items = await GalleryModel.find().lean();
      return items.map((doc: any) => mapDocId<GalleryItem>(doc));
    } catch (e) {
      console.error('Error querying GalleryModel:', e);
    }
  }
  return [...memStore.gallery];
}

export async function saveGalleryItem(itemData: Partial<GalleryItem>): Promise<GalleryItem> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const { id, ...payload } = itemData;
      if (id && /^[a-f0-9]{24}$/i.test(id)) {
        const updated = await GalleryModel.findByIdAndUpdate(id, { $set: payload }, { new: true }).lean();
        if (updated) return mapDocId<GalleryItem>(updated);
      }
      const created = await GalleryModel.create(payload);
      return mapDocId<GalleryItem>(created.toObject());
    } catch (e) {
      console.error('Error saving GalleryModel:', e);
      throw e;
    }
  }
  if (itemData.id) {
    const idx = memStore.gallery.findIndex((g) => g.id === itemData.id);
    if (idx !== -1) {
      memStore.gallery[idx] = { ...memStore.gallery[idx], ...itemData } as GalleryItem;
      return memStore.gallery[idx];
    }
  }
  const newItem: GalleryItem = {
    id: 'gal-' + Date.now(),
    title: itemData.title || 'Gallery Item',
    category: itemData.category || 'Signage',
    image: itemData.image || 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1200&q=80',
    location: itemData.location || 'Edmonton, AB',
    aspectRatio: itemData.aspectRatio || 'landscape',
    featured: Boolean(itemData.featured),
  };
  memStore.gallery.push(newItem);
  return newItem;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await GalleryModel.findByIdAndDelete(id);
      return true;
    } catch (e) {}
  }
  const idx = memStore.gallery.findIndex((g) => g.id === id);
  if (idx !== -1) {
    memStore.gallery.splice(idx, 1);
    return true;
  }
  return false;
}

// ----------------- BLOGS -----------------
function mapBlogDoc(doc: any): BlogPostItem {
  return {
    id: doc._id?.toString?.() || doc.id,
    slug: doc.slug,
    title: doc.title,
    shortDescription: doc.shortDescription || '',
    content: doc.content || '',
    author: doc.author || '',
    authorRole: doc.authorRole || 'Signage Specialist',
    category: doc.category || '',
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    publishedDate: doc.publishedDate || '',
    readTime: doc.readTime || '5 min read',
    image: doc.image || '',
    imageAlt: doc.imageAlt || '',
    metaTitle: doc.metaTitle || '',
    metaDescription: doc.metaDescription || '',
    focusKeyword: doc.focusKeyword || '',
    canonicalUrl: doc.canonicalUrl || '',
    published: Boolean(doc.published),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
  };
}

function normalizeBlogPayload(blogData: Partial<BlogPostItem>) {
  const title = (blogData.title || '').trim();
  const slug = (blogData.slug || slugifyBlogTitle(title) || `article-${Date.now()}`)
    .toLowerCase()
    .trim();
  const rawContent = blogData.content || '';
  const content = looksLikeHtml(rawContent) ? sanitizeBlogHtml(rawContent) : rawContent.trim();

  return {
    slug,
    title: title || 'Untitled Article',
    shortDescription: (blogData.shortDescription || '').trim(),
    content,
    author: (blogData.author || '').trim(),
    authorRole: (blogData.authorRole || 'Signage Specialist').trim(),
    category: normalizeBlogCategory(blogData.category || ''),
    tags: Array.isArray(blogData.tags)
      ? blogData.tags.map((t) => String(t).trim()).filter(Boolean)
      : [],
    publishedDate:
      blogData.publishedDate || new Date().toISOString().split('T')[0],
    readTime: (blogData.readTime || '').trim() || estimateReadTime(content),
    image: (blogData.image || '').trim(),
    imageAlt: (blogData.imageAlt || '').trim(),
    metaTitle: (blogData.metaTitle || '').trim(),
    metaDescription: (blogData.metaDescription || '').trim(),
    focusKeyword: (blogData.focusKeyword || '').trim(),
    canonicalUrl: (blogData.canonicalUrl || '').trim(),
    published: Boolean(blogData.published),
  };
}

/** Seed starter articles once (does not re-seed after intentional deletes). */
export async function ensureBlogsSeeded(): Promise<void> {
  await ensureCmsContentSeeded();
}

export async function getBlogs(options?: {
  publishedOnly?: boolean;
  category?: string;
  search?: string;
  status?: 'all' | 'published' | 'draft';
}): Promise<BlogPostItem[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ensureBlogsSeeded();
      const filter: Record<string, unknown> = {};

      if (options?.publishedOnly || options?.status === 'published') {
        filter.published = true;
      } else if (options?.status === 'draft') {
        filter.published = false;
      }

      if (options?.category) {
        filter.category = new RegExp(`^${options.category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
      }

      if (options?.search?.trim()) {
        const q = options.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.title = { $regex: q, $options: 'i' };
      }

      const items = await BlogPostModel.find(filter).sort({ publishedDate: -1, createdAt: -1 }).lean();
      return items.map(mapBlogDoc);
    } catch (e) {
      console.warn('getBlogs Mongo error:', e);
    }
  }

  let blogs = [...memStore.blogs];
  if (options?.publishedOnly || options?.status === 'published') {
    blogs = blogs.filter((b) => b.published);
  } else if (options?.status === 'draft') {
    blogs = blogs.filter((b) => !b.published);
  }
  if (options?.category) {
    const cat = options.category.toLowerCase();
    blogs = blogs.filter((b) => b.category.toLowerCase() === cat);
  }
  if (options?.search?.trim()) {
    const q = options.search.trim().toLowerCase();
    blogs = blogs.filter((b) => b.title.toLowerCase().includes(q));
  }
  return blogs;
}

export async function getPublishedBlogsPage(options: {
  page?: number;
  limit?: number;
  category?: string;
}): Promise<{ items: BlogPostItem[]; total: number; page: number; limit: number; totalPages: number }> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, Math.max(1, options.limit || 9));
  const all = await getBlogs({
    publishedOnly: true,
    category: options.category,
  });
  const total = all.length;
  const start = (page - 1) * limit;
  return {
    items: all.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getBlogBySlug(
  slug: string,
  options?: { publishedOnly?: boolean },
): Promise<BlogPostItem | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ensureBlogsSeeded();
      const filter: Record<string, unknown> = { slug: slug.toLowerCase() };
      if (options?.publishedOnly) filter.published = true;
      const doc = await BlogPostModel.findOne(filter).lean();
      if (doc) return mapBlogDoc(doc);
      return null;
    } catch (e) {
      console.warn('getBlogBySlug Mongo error:', e);
    }
  }

  const blogs = await getBlogs({ publishedOnly: options?.publishedOnly });
  return blogs.find((b) => b.slug === slug) || null;
}

export async function saveBlogPost(blogData: Partial<BlogPostItem>): Promise<BlogPostItem> {
  const payload = normalizeBlogPayload(blogData);
  const db = await connectToDatabase();

  if (db) {
    try {
      const existingBySlug = await BlogPostModel.findOne({ slug: payload.slug }).lean();
      const isObjectId = Boolean(blogData.id && /^[a-f0-9]{24}$/i.test(blogData.id));

      if (isObjectId) {
        if (existingBySlug && existingBySlug._id.toString() !== blogData.id) {
          throw new Error('A blog with this slug already exists.');
        }
        const updated = await BlogPostModel.findByIdAndUpdate(
          blogData.id,
          { $set: payload },
          { new: true, runValidators: true },
        ).lean();
        if (!updated) throw new Error('Blog post not found.');
        return mapBlogDoc(updated);
      }

      if (existingBySlug) {
        throw new Error('A blog with this slug already exists.');
      }

      const created = await BlogPostModel.create(payload);
      return mapBlogDoc(created.toObject());
    } catch (e: any) {
      if (e?.code === 11000) {
        throw new Error('A blog with this slug already exists.');
      }
      throw e;
    }
  }

  if (blogData.id) {
    const idx = memStore.blogs.findIndex((b) => b.id === blogData.id);
    if (idx !== -1) {
      const slugTaken = memStore.blogs.some(
        (b) => b.slug === payload.slug && b.id !== blogData.id,
      );
      if (slugTaken) throw new Error('A blog with this slug already exists.');
      memStore.blogs[idx] = { ...memStore.blogs[idx], ...payload, id: blogData.id };
      return memStore.blogs[idx];
    }
  }

  if (memStore.blogs.some((b) => b.slug === payload.slug)) {
    throw new Error('A blog with this slug already exists.');
  }

  const newItem: BlogPostItem = {
    id: 'blog-' + Date.now(),
    ...payload,
  };
  memStore.blogs.unshift(newItem);
  return newItem;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const result = await BlogPostModel.findByIdAndDelete(id);
      return Boolean(result);
    } catch (e) {
      console.warn('deleteBlogPost Mongo error:', e);
      return false;
    }
  }
  const idx = memStore.blogs.findIndex((b) => b.id === id);
  if (idx !== -1) {
    memStore.blogs.splice(idx, 1);
    return true;
  }
  return false;
}

// ----------------- TESTIMONIALS -----------------
export async function getTestimonials(): Promise<TestimonialItem[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ensureCmsContentSeeded();
      const items = await TestimonialModel.find().lean();
      return items.map((doc: any) => mapDocId<TestimonialItem>(doc));
    } catch (e) {
      console.error('Error querying TestimonialModel:', e);
    }
  }
  return [...memStore.testimonials];
}

export async function saveTestimonial(data: Partial<TestimonialItem>): Promise<TestimonialItem> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const { id, ...payload } = data;
      if (id && /^[a-f0-9]{24}$/i.test(id)) {
        const updated = await TestimonialModel.findByIdAndUpdate(
          id,
          { $set: payload },
          { new: true },
        ).lean();
        if (updated) return mapDocId<TestimonialItem>(updated);
      }
      const created = await TestimonialModel.create(payload);
      return mapDocId<TestimonialItem>(created.toObject());
    } catch (e) {
      console.error('Error saving TestimonialModel:', e);
      throw e;
    }
  }
  if (data.id) {
    const idx = memStore.testimonials.findIndex((t) => t.id === data.id);
    if (idx !== -1) {
      memStore.testimonials[idx] = { ...memStore.testimonials[idx], ...data } as TestimonialItem;
      return memStore.testimonials[idx];
    }
  }
  const newItem: TestimonialItem = {
    id: 'test-' + Date.now(),
    clientName: data.clientName || 'Client Name',
    companyName: data.companyName || 'Business',
    role: data.role || 'Business Owner',
    content: data.content || '',
    projectType: data.projectType || 'Commercial Sign',
    location: data.location || 'Edmonton, AB',
    rating: data.rating || 5,
    featured: data.featured !== undefined ? data.featured : true,
  };
  memStore.testimonials.push(newItem);
  return newItem;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await TestimonialModel.findByIdAndDelete(id);
      return true;
    } catch (e) {}
  }
  const idx = memStore.testimonials.findIndex((t) => t.id === id);
  if (idx !== -1) {
    memStore.testimonials.splice(idx, 1);
    return true;
  }
  return false;
}

// ----------------- QUOTE REQUESTS -----------------
export async function getQuoteRequests(): Promise<QuoteRequestItem[]> {
  const db = await connectToDatabase();
  if (!db) {
    throw new DatabaseUnavailableError(
      getMongoConnectionError() ||
        'MongoDB is not connected. Quote requests cannot be loaded until the database is available.',
    );
  }

  try {
    const items = await QuoteRequestModel.find().sort({ createdAt: -1 }).lean();
    return items.map((doc: any) => {
      const id = doc._id.toString();
      return {
        ...doc,
        id,
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: doc.updatedAt?.toISOString?.() || undefined,
        emailNotificationSentAt: doc.emailNotificationSentAt
          ? new Date(doc.emailNotificationSentAt).toISOString()
          : undefined,
        statusHistory: (doc.statusHistory || []).map((h: any) => ({
          ...h,
          changedAt: h.changedAt ? new Date(h.changedAt).toISOString() : new Date().toISOString(),
        })),
        adminNotes: (doc.adminNotes || []).map((n: any) => ({
          ...n,
          createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString(),
        })),
        followUpDate: doc.followUpDate ? new Date(doc.followUpDate).toISOString() : null,
        followUpCompleted: Boolean(doc.followUpCompleted),
        followUpCompletedAt: doc.followUpCompletedAt
          ? new Date(doc.followUpCompletedAt).toISOString()
          : null,
        quotations: (doc.quotations || []).map((q: any) => ({
          ...q,
          quoteRequestId: id,
          createdAt: q.createdAt ? new Date(q.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: q.updatedAt ? new Date(q.updatedAt).toISOString() : new Date().toISOString(),
          sentAt: q.sentAt ? new Date(q.sentAt).toISOString() : undefined,
        })),
        source: doc.source || '',
      };
    }) as QuoteRequestItem[];
  } catch (e) {
    if ((e as Error)?.name === 'DatabaseUnavailableError') throw e;
    console.error('Error loading quote requests from MongoDB:', e);
    throw e;
  }
}

export async function createQuoteRequest(
  data: Omit<QuoteRequestItem, 'id' | 'createdAt' | 'status'>,
): Promise<QuoteRequestItem> {
  const db = await connectToDatabase();
  if (!db) {
    throw new DatabaseUnavailableError(
      getMongoConnectionError() ||
        'MongoDB is not connected. Quote requests are not accepted until the database is available.',
    );
  }

  try {
    const created = await QuoteRequestModel.create({
      ...data,
      status: 'new',
      emailNotificationStatus: data.emailNotificationStatus || 'pending',
      emailNotificationAttempts: data.emailNotificationAttempts || 0,
      source: data.source || '',
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          status: 'new',
          changedAt: new Date(),
          changedBy: 'system',
          note: 'Quote request submitted',
        },
      ],
    });
    return {
      ...created.toObject(),
      id: created._id.toString(),
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt?.toISOString?.(),
      emailNotificationSentAt: created.emailNotificationSentAt
        ? created.emailNotificationSentAt.toISOString()
        : undefined,
      source: created.source || '',
    };
  } catch (e) {
    console.error('Error creating quote request:', e);
    throw e;
  }
}

export async function updateQuoteEmailNotification(
  id: string,
  update: {
    emailNotificationStatus: NonNullable<QuoteRequestItem['emailNotificationStatus']>;
    emailNotificationError?: string;
    emailNotificationAttempts?: number;
    emailNotificationSentAt?: string;
  },
): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await QuoteRequestModel.findByIdAndUpdate(id, {
        emailNotificationStatus: update.emailNotificationStatus,
        emailNotificationError: update.emailNotificationError || '',
        ...(update.emailNotificationAttempts !== undefined
          ? { emailNotificationAttempts: update.emailNotificationAttempts }
          : {}),
        ...(update.emailNotificationSentAt
          ? { emailNotificationSentAt: new Date(update.emailNotificationSentAt) }
          : {}),
      });
      return true;
    } catch (e) {
      console.error('Error updating quote email notification:', e);
      return false;
    }
  }

  const item = memStore.quotes.find((q) => q.id === id);
  if (!item) return false;
  item.emailNotificationStatus = update.emailNotificationStatus;
  item.emailNotificationError = update.emailNotificationError || '';
  if (update.emailNotificationAttempts !== undefined) {
    item.emailNotificationAttempts = update.emailNotificationAttempts;
  }
  if (update.emailNotificationSentAt) {
    item.emailNotificationSentAt = update.emailNotificationSentAt;
  }
  return true;
}

export async function updateQuoteStatus(id: string, status: QuoteRequestItem['status'], notes?: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (!db) {
    throw new DatabaseUnavailableError(
      getMongoConnectionError() || 'MongoDB is not connected. Status updates require the database.',
    );
  }

  try {
    const historyEntry = {
      id: `hist-${Date.now()}`,
      status,
      changedAt: new Date(),
      changedBy: 'admin',
      note: '',
    };
    const updated = await QuoteRequestModel.findByIdAndUpdate(
      id,
      {
        status,
        ...(notes !== undefined ? { notes } : {}),
        $push: { statusHistory: historyEntry },
      },
      { new: true },
    );
    return Boolean(updated);
  } catch (e) {
    console.error('Error updating quote status:', e);
    return false;
  }
}

// ----------------- CONTACT INQUIRIES -----------------
export async function getContactInquiries(): Promise<ContactInquiryItem[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const items = await ContactInquiryModel.find().sort({ createdAt: -1 }).lean();
      return items.map((doc: any) => ({
        ...doc,
        id: doc._id.toString(),
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      })) as ContactInquiryItem[];
    } catch (e) {}
  }
  return [...memStore.inquiries];
}

export async function createContactInquiry(data: Omit<ContactInquiryItem, 'id' | 'createdAt' | 'status'>): Promise<ContactInquiryItem> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await ContactInquiryModel.create({
        ...data,
        status: 'new',
      });
      return {
        ...created.toObject(),
        id: created._id.toString(),
        createdAt: created.createdAt.toISOString(),
      };
    } catch (e) {
      console.error('Error creating contact inquiry:', e);
      throw e;
    }
  }

  const newInquiry: ContactInquiryItem = {
    ...data,
    id: 'inq-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  memStore.inquiries.unshift(newInquiry);
  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: ContactInquiryItem['status']): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ContactInquiryModel.findByIdAndUpdate(id, { status });
      return true;
    } catch (e) {}
  }
  const item = memStore.inquiries.find((i) => i.id === id);
  if (item) {
    item.status = status;
    return true;
  }
  return false;
}

// ----------------- WEBSITE SETTINGS -----------------
export async function getSettings(): Promise<WebsiteSettings> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ensureCmsContentSeeded();
      const doc = await SettingsModel.findOne().lean();
      if (doc) {
        const { _id, __v, ...rest } = doc as any;
        return rest as WebsiteSettings;
      }
      return { ...initialSettings };
    } catch (e) {
      console.error('Error querying SettingsModel:', e);
    }
  }
  return { ...memStore.settings };
}

export async function updateSettings(data: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated = await SettingsModel.findOneAndUpdate({}, data, { upsert: true, new: true }).lean();
      if (updated) {
        const { _id, __v, ...rest } = updated as any;
        return rest as WebsiteSettings;
      }
    } catch (e) {
      console.error('Error updating SettingsModel:', e);
      throw e;
    }
  }
  memStore.settings = { ...memStore.settings, ...data };
  return { ...memStore.settings };
}

export type DashboardOverview = {
  connected: boolean;
  message?: string;
  stats: {
    quoteRequests: number;
    quoteRequestsNew: number;
    contactInquiries: number;
    contactInquiriesUnread: number;
    activeServices: number;
    signProducts: number;
    portfolioProjects: number;
    blogArticlesPublished: number;
    blogArticlesTotal: number;
  };
  recentQuotes: QuoteRequestItem[];
  recentInquiries: ContactInquiryItem[];
};

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const connected = await isDatabaseConnected();
  if (!connected) {
    return {
      connected: false,
      message:
        'MongoDB is not connected. Dashboard counts are unavailable. Check MONGODB_URI and restart the backend.',
      stats: {
        quoteRequests: 0,
        quoteRequestsNew: 0,
        contactInquiries: 0,
        contactInquiriesUnread: 0,
        activeServices: 0,
        signProducts: 0,
        portfolioProjects: 0,
        blogArticlesPublished: 0,
        blogArticlesTotal: 0,
      },
      recentQuotes: [],
      recentInquiries: [],
    };
  }

  await ensureCmsContentSeeded();

  const [quotes, inquiries, services, products, projects, blogs, publishedBlogs] =
    await Promise.all([
      getQuoteRequests(),
      getContactInquiries(),
      getServices(),
      getProducts(),
      getProjects(),
      getBlogs(),
      getBlogs({ publishedOnly: true }),
    ]);

  const publishedProjects = projects.filter((p) => p.published !== false);

  return {
    connected: true,
    stats: {
      quoteRequests: quotes.length,
      quoteRequestsNew: quotes.filter((q) => q.status === 'new').length,
      contactInquiries: inquiries.length,
      contactInquiriesUnread: inquiries.filter((i) => i.status === 'new').length,
      activeServices: services.length,
      signProducts: products.length,
      portfolioProjects: publishedProjects.length,
      blogArticlesPublished: publishedBlogs.length,
      blogArticlesTotal: blogs.length,
    },
    recentQuotes: quotes.slice(0, 5),
    recentInquiries: inquiries.slice(0, 5),
  };
}

