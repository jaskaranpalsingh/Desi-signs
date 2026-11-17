import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

import {
  verifyAdminCredentials,
  signAdminToken,
  getAdminSessionFromCookieHeader,
} from '../../src/lib/auth';
import {
  adminLoginSchema,
  quoteRequestSchema,
  contactInquirySchema,
  blogPostSchema,
} from '../../src/lib/validations';
import {
  getQuoteRequests,
  updateQuoteStatus,
  updateQuoteEmailNotification,
  createContactInquiry,
  getContactInquiries,
  updateInquiryStatus,
  getServices,
  saveService,
  deleteService,
  getProducts,
  saveProduct,
  deleteProduct,
  getProjects,
  saveProject,
  deleteProject,
  getGallery,
  saveGalleryItem,
  deleteGalleryItem,
  getBlogs,
  getBlogBySlug,
  getPublishedBlogsPage,
  saveBlogPost,
  deleteBlogPost,
  ensureBlogsSeeded,
  ensureCmsContentSeeded,
  getDashboardOverview,
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  getSettings,
  updateSettings,
} from '../../src/lib/data-store';
import { sanitizePlainText } from '../../src/lib/sanitize';
import {
  sendQuoteNotificationEmail,
  isEmailConfigured as isQuoteEmailConfigured,
} from '../../src/lib/email/quote-notification';
import { sendContactNotificationEmail } from '../../src/lib/email/contact-notification';
import {
  sendQuoteNotificationWhatsApp,
  isWhatsAppConfigured,
} from '../../src/lib/whatsapp/quote-notification';
import { sendQuotationEmail, isEmailConfigured } from '../../src/lib/email/quotation-email';
import type { ContactInquiryItem, QuoteRequestItem } from '../../src/lib/types';
import { buildQuotationPdfBuffer } from '../../src/lib/pdf/quotation-pdf';
import {
  addQuoteAdminNote,
  getManagedQuoteById,
  getQuoteDashboardCounts,
  markQuotationSent,
  saveQuotation,
  updateQuoteFollowUp,
  updateQuoteStatusManaged,
} from '../../src/lib/quote-management-store';
import type { QuoteStatus } from '../../src/lib/quote-management-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const PORT = Number(process.env.BACKEND_PORT || 4000);

const app = express();

/** Simple in-memory rate limit for public form posts (per IP). */
const quoteRateBuckets = new Map<string, { count: number; resetAt: number }>();
const contactRateBuckets = new Map<string, { count: number; resetAt: number }>();

function allowRateLimited(
  buckets: Map<string, { count: number; resetAt: number }>,
  ip: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

function allowQuoteSubmission(ip: string, limit = 8, windowMs = 15 * 60 * 1000): boolean {
  return allowRateLimited(quoteRateBuckets, ip, limit, windowMs);
}

function allowContactSubmission(ip: string, limit = 5, windowMs = 15 * 60 * 1000): boolean {
  return allowRateLimited(contactRateBuckets, ip, limit, windowMs);
}

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = getAdminSessionFromCookieHeader(req.headers.cookie);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

/** Express 5 types params as string | string[]; normalize to a single string. */
function routeParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

function setAuthCookie(res: Response, token: string, req: Request) {
  const proto = req.headers['x-forwarded-proto'];
  const isHttps = proto === 'https' || req.protocol === 'https';
  res.cookie('desi_admin_token', token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });
}

// ── Auth ─────────────────────────────────────────────────────────────────────

app.post('/api/auth/login', async (req, res) => {
  try {
    const parsed = adminLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: 'Invalid credentials format.' });
    }
    const user = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }
    const token = signAdminToken(user);
    setAuthCookie(res, token, req);
    return res.json({ success: true, message: 'Authentication successful.', user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('desi_admin_token', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ── Public forms ─────────────────────────────────────────────────────────────

app.post('/api/quotes', async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!allowQuoteSubmission(ip)) {
      return res.status(429).json({
        success: false,
        message: 'Too many quote requests. Please wait a few minutes and try again.',
      });
    }

    const result = quoteRequestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Please check your form entries.',
        errors: result.error.flatten().fieldErrors,
      });
    }

    const emailReady = isQuoteEmailConfigured();
    const whatsappReady = isWhatsAppConfigured();
    if (!emailReady && !whatsappReady) {
      console.error('[quotes] No notification channel configured (SMTP / WhatsApp).');
      return res.status(503).json({
        success: false,
        message:
          'Quote notifications are temporarily unavailable. Please call us or email save@desisigns.com.',
      });
    }

    const d = result.data;
    const now = new Date().toISOString();
    const quote: QuoteRequestItem = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      fullName: sanitizePlainText(d.fullName, 120),
      businessName: sanitizePlainText(d.businessName, 160),
      email: sanitizePlainText(d.email, 160).toLowerCase(),
      phone: sanitizePlainText(d.phone, 40),
      location: sanitizePlainText(d.location, 200),
      signType: sanitizePlainText(d.signType, 160),
      estimatedDimensions: sanitizePlainText(d.estimatedDimensions || '', 120),
      illuminationType: sanitizePlainText(d.illuminationType || '', 120),
      targetTimeline: sanitizePlainText(d.targetTimeline || '', 120),
      budgetRange: sanitizePlainText(d.budgetRange || '', 80),
      projectDetails: sanitizePlainText(d.projectDetails, 5000, true),
      installationRequired: Boolean(d.installationRequired),
      permitAssistanceRequired: Boolean(d.permitAssistanceRequired),
      source: d.source || 'request-a-quote',
      status: 'new',
    };

    const [emailDelivery, whatsappDelivery] = await Promise.all([
      sendQuoteNotificationEmail(quote),
      sendQuoteNotificationWhatsApp(quote),
    ]);

    const emailStatus = emailDelivery.ok
      ? 'sent'
      : emailDelivery.skipped
        ? 'skipped'
        : 'failed';
    const whatsappStatus = whatsappDelivery.ok
      ? 'sent'
      : whatsappDelivery.skipped
        ? 'skipped'
        : 'failed';

    if (emailDelivery.ok) {
      console.log('[quotes] Email notification sent', { attempts: emailDelivery.attempts });
    } else if (emailDelivery.skipped) {
      console.warn('[quotes] Email notification skipped:', emailDelivery.error);
    } else {
      console.error('[quotes] Email notification failed:', emailDelivery.error);
    }

    if (whatsappDelivery.ok) {
      console.log('[quotes] WhatsApp notification sent', { attempts: whatsappDelivery.attempts });
    } else if (whatsappDelivery.skipped) {
      console.warn('[quotes] WhatsApp notification skipped:', whatsappDelivery.error);
    } else {
      console.error('[quotes] WhatsApp notification failed:', whatsappDelivery.error);
    }

    const anySent = emailDelivery.ok || whatsappDelivery.ok;
    if (!anySent) {
      return res.status(502).json({
        success: false,
        message:
          'We could not deliver your request right now. Please try again or contact us by phone or email.',
        data: {
          id: quote.id,
          createdAt: quote.createdAt,
          emailNotificationStatus: emailStatus,
          whatsappNotificationStatus: whatsappStatus,
        },
      });
    }

    return res.json({
      success: true,
      message: 'Thank you! We have received your request and will contact you soon.',
      data: {
        id: quote.id,
        createdAt: quote.createdAt,
        emailNotificationStatus: emailStatus,
        whatsappNotificationStatus: whatsappStatus,
        ...(emailDelivery.ok ? {} : { emailNotificationError: emailDelivery.error }),
        ...(whatsappDelivery.ok ? {} : { whatsappNotificationError: whatsappDelivery.error }),
      },
    });
  } catch (error: unknown) {
    console.error('Error submitting quote request:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal error occurred. Please try again or contact us by phone.',
    });
  }
});

app.get('/api/quotes', requireAdmin, async (_req, res) => {
  try {
    const quotes = await getQuoteRequests();
    return res.json({ success: true, data: quotes });
  } catch (error: any) {
    return res.status(503).json({
      success: false,
      message: error?.message || 'Unable to load quote requests from MongoDB.',
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!allowContactSubmission(ip)) {
      return res.status(429).json({
        success: false,
        message: 'Too many messages from this connection. Please try again in a few minutes.',
      });
    }

    const result = contactInquirySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Please check your form entries.',
        errors: result.error.flatten().fieldErrors,
      });
    }

    // Honeypot: pretend success so bots do not retry or learn the trap.
    if (result.data.website && result.data.website.trim().length > 0) {
      return res.json({
        success: true,
        message:
          "Thank you for contacting DESI SIGNS! We've received your message and will get back to you soon.",
      });
    }

    if (!isQuoteEmailConfigured()) {
      console.error('[contact] SMTP is not configured — cannot deliver enquiry email.');
      return res.status(503).json({
        success: false,
        message:
          "Sorry, we couldn't send your message. Please try again or contact us directly.",
      });
    }

    const d = result.data;
    const now = new Date().toISOString();
    const inquiry: ContactInquiryItem = {
      id: randomUUID(),
      createdAt: now,
      fullName: sanitizePlainText(d.fullName, 120),
      email: sanitizePlainText(d.email, 160).toLowerCase(),
      phone: d.phone ? sanitizePlainText(d.phone, 40) : undefined,
      subject: sanitizePlainText(d.subject, 200),
      message: sanitizePlainText(d.message, 5000, true),
      status: 'new',
    };

    const emailDelivery = await sendContactNotificationEmail(inquiry);

    if (emailDelivery.ok) {
      console.log('[contact] Enquiry email sent', { attempts: emailDelivery.attempts });
    } else if (emailDelivery.skipped) {
      console.warn('[contact] Enquiry email skipped:', emailDelivery.error);
    } else {
      console.error('[contact] Enquiry email failed:', emailDelivery.error);
    }

    if (!emailDelivery.ok) {
      return res.status(502).json({
        success: false,
        message:
          "Sorry, we couldn't send your message. Please try again or contact us directly.",
      });
    }

    // Best-effort archive only — email delivery already succeeded.
    try {
      await createContactInquiry({
        fullName: inquiry.fullName,
        email: inquiry.email,
        phone: inquiry.phone,
        subject: inquiry.subject,
        message: inquiry.message,
      });
    } catch (archiveError) {
      console.error('[contact] Email sent but archive failed:', archiveError);
    }

    return res.json({
      success: true,
      message:
        "Thank you for contacting DESI SIGNS! We've received your message and will get back to you soon.",
      data: { id: inquiry.id, createdAt: inquiry.createdAt },
    });
  } catch (error) {
    console.error('Error submitting contact inquiry:', error);
    return res.status(500).json({
      success: false,
      message:
        "Sorry, we couldn't send your message. Please try again or contact us directly.",
    });
  }
});

app.get('/api/contact', requireAdmin, async (_req, res) => {
  const inquiries = await getContactInquiries();
  return res.json({ success: true, data: inquiries });
});

// ── Upload ───────────────────────────────────────────────────────────────────

const uploadDir = path.join(PROJECT_ROOT, 'public', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_UPLOAD_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/postscript',
  'application/illustrator',
  'application/octet-stream',
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      cb(null, `${Date.now()}_${safeName}`);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = file.originalname.split('.').pop()?.toLowerCase() || '';
    const allowedExt = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'ai', 'eps']);
    if (!ALLOWED_UPLOAD_TYPES.has(file.mimetype) && !allowedExt.has(ext)) {
      cb(new Error('Unsupported file type'));
      return;
    }
    cb(null, true);
  },
});

async function uploadToCloudinaryIfConfigured(
  filePath: string,
  originalName: string,
  mimeType: string,
): Promise<string | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  if (!mimeType.startsWith('image/')) return null;

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'desi-signs/blogs';
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const { createHash } = await import('crypto');
  const signature = createHash('sha1').update(paramsToSign).digest('hex');

  const form = new FormData();
  const fileBuffer = fs.readFileSync(filePath);
  form.append('file', new Blob([new Uint8Array(fileBuffer)]), originalName);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  const data = (await response.json()) as { secure_url?: string };
  return data.secure_url || null;
}

function validateUploadMagicBytes(filePath: string, originalName: string): boolean {
  const ext = originalName.split('.').pop()?.toLowerCase() || '';
  const fd = fs.openSync(filePath, 'r');
  const header = Buffer.alloc(16);
  try {
    fs.readSync(fd, header, 0, 16, 0);
  } finally {
    fs.closeSync(fd);
  }

  const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
  const isJpg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isGif = header.slice(0, 3).toString('ascii') === 'GIF';
  const isPdf = header.slice(0, 4).toString('ascii') === '%PDF';
  const isWebp =
    header.slice(0, 4).toString('ascii') === 'RIFF' && header.slice(8, 12).toString('ascii') === 'WEBP';
  const isSvgOrXml =
    header.toString('utf8').includes('<?xml') || header.toString('utf8').includes('<svg');
  // AI/EPS are PostScript-based; allow when extension matches and content looks textual/binary PS
  const looksLikePs =
    header.slice(0, 2).toString('ascii') === '%!' ||
    header.slice(0, 4).toString('ascii') === '%PDF' || // some AI files are PDF-based
    header[0] === 0xc5; // binary EPS marker

  if (['png'].includes(ext)) return isPng;
  if (['jpg', 'jpeg'].includes(ext)) return isJpg;
  if (['gif'].includes(ext)) return isGif;
  if (['webp'].includes(ext)) return isWebp;
  if (['pdf'].includes(ext)) return isPdf;
  if (['svg'].includes(ext)) return isSvgOrXml;
  if (['ai', 'eps'].includes(ext)) return looksLikePs || isPdf;
  return false;
}

app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      const message =
        err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'
          ? 'File exceeds 15MB limit'
          : err.message || 'File upload failed';
      return res.status(400).json({ success: false, message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    try {
      if (!validateUploadMagicBytes(req.file.path, req.file.originalname)) {
        fs.unlink(req.file.path, () => undefined);
        return res.status(400).json({
          success: false,
          message: 'File content does not match an allowed type.',
        });
      }

      const cloudUrl = await uploadToCloudinaryIfConfigured(
        req.file.path,
        req.file.originalname,
        req.file.mimetype,
      );
      if (cloudUrl) {
        fs.unlink(req.file.path, () => undefined);
        return res.json({
          success: true,
          url: cloudUrl,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          storage: 'cloudinary',
        });
      }

      return res.json({
        success: true,
        url: `/uploads/${req.file.filename}`,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        storage: 'local',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Upload failed',
      });
    }
  });
});

// ── Public blogs ─────────────────────────────────────────────────────────────

app.get('/api/blogs', async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 9);
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const data = await getPublishedBlogsPage({ page, limit, category });
    return res.json({ success: true, ...data, data: data.items });
  } catch (error: any) {
    console.error('Public blogs list error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load blogs' });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const blog = await getBlogBySlug(routeParam(req.params.slug), { publishedOnly: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    return res.json({ success: true, data: blog });
  } catch (error: any) {
    console.error('Public blog detail error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load blog' });
  }
});

// ── Admin CRUD helpers ───────────────────────────────────────────────────────

function adminCrud(opts: {
  path: string;
  getAll: () => Promise<unknown>;
  save?: (body: any) => Promise<unknown>;
  remove?: (id: string) => Promise<unknown>;
}) {
  app.get(opts.path, requireAdmin, async (_req, res) => {
    const data = await opts.getAll();
    return res.json({ success: true, data });
  });

  if (opts.save) {
    app.post(opts.path, requireAdmin, async (req, res) => {
      try {
        const saved = await opts.save!(req.body);
        return res.json({ success: true, data: saved });
      } catch (e: any) {
        return res.status(500).json({ success: false, message: e.message });
      }
    });
  }

  if (opts.remove) {
    app.delete(opts.path, requireAdmin, async (req, res) => {
      const id = typeof req.query.id === 'string' ? req.query.id : null;
      if (!id) return res.status(400).json({ success: false, message: 'ID is required' });
      await opts.remove!(id);
      return res.json({ success: true });
    });
  }
}

adminCrud({ path: '/api/admin/services', getAll: getServices, save: saveService, remove: deleteService });
adminCrud({ path: '/api/admin/products', getAll: getProducts, save: saveProduct, remove: deleteProduct });
adminCrud({ path: '/api/admin/projects', getAll: getProjects, save: saveProject, remove: deleteProject });
adminCrud({ path: '/api/admin/gallery', getAll: getGallery, save: saveGalleryItem, remove: deleteGalleryItem });
adminCrud({
  path: '/api/admin/testimonials',
  getAll: getTestimonials,
  save: saveTestimonial,
  remove: deleteTestimonial,
});

// ── Admin dashboard (real MongoDB aggregates) ────────────────────────────────

app.get('/api/admin/dashboard', requireAdmin, async (_req, res) => {
  try {
    const overview = await getDashboardOverview();
    if (!overview.connected) {
      return res.status(503).json({
        success: false,
        connected: false,
        message: overview.message,
        data: overview,
      });
    }
    return res.json({ success: true, connected: true, data: overview });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    return res.status(500).json({
      success: false,
      connected: false,
      message: error.message || 'Failed to load dashboard data from MongoDB.',
    });
  }
});

// ── Admin blogs (validated CRUD) ─────────────────────────────────────────────

app.get('/api/admin/blogs', requireAdmin, async (req, res) => {
  try {
    const search = typeof req.query.q === 'string' ? req.query.q : undefined;
    const statusRaw = typeof req.query.status === 'string' ? req.query.status : 'all';
    const status =
      statusRaw === 'published' || statusRaw === 'draft' || statusRaw === 'all'
        ? statusRaw
        : 'all';
    const data = await getBlogs({ search, status });
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to load blogs' });
  }
});

app.post('/api/admin/blogs', requireAdmin, async (req, res) => {
  try {
    const parsed = blogPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const saved = await saveBlogPost({ ...parsed.data, id: req.body.id });
    return res.json({ success: true, data: saved });
  } catch (error: any) {
    const status = /already exists|not found/i.test(error.message || '') ? 400 : 500;
    return res.status(status).json({ success: false, message: error.message || 'Failed to save blog' });
  }
});

app.patch('/api/admin/blogs/:id', requireAdmin, async (req, res) => {
  try {
    const id = routeParam(req.params.id);
    const parsed = blogPostSchema.safeParse({ ...req.body, id });
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const saved = await saveBlogPost({ ...parsed.data, id });
    return res.json({ success: true, data: saved });
  } catch (error: any) {
    const status = /already exists|not found/i.test(error.message || '') ? 400 : 500;
    return res.status(status).json({ success: false, message: error.message || 'Failed to update blog' });
  }
});

app.delete('/api/admin/blogs/:id', requireAdmin, async (req, res) => {
  try {
    const ok = await deleteBlogPost(routeParam(req.params.id));
    if (!ok) return res.status(404).json({ success: false, message: 'Blog not found' });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete blog' });
  }
});

app.delete('/api/admin/blogs', requireAdmin, async (req, res) => {
  const id = typeof req.query.id === 'string' ? req.query.id : null;
  if (!id) return res.status(400).json({ success: false, message: 'ID is required' });
  try {
    const ok = await deleteBlogPost(id);
    if (!ok) return res.status(404).json({ success: false, message: 'Blog not found' });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete blog' });
  }
});

app.get('/api/admin/settings', requireAdmin, async (_req, res) => {
  const data = await getSettings();
  return res.json({ success: true, data });
});

app.post('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    const updated = await updateSettings(req.body);
    return res.json({ success: true, data: updated });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/admin/quotes', requireAdmin, async (_req, res) => {
  try {
    const { connectToDatabase, getMongoConnectionError, getMongoDbName } = await import('../../src/lib/db');
    const db = await connectToDatabase();
    if (!db) {
      return res.status(503).json({
        success: false,
        connected: false,
        message:
          getMongoConnectionError() ||
          'MongoDB is not connected. Quote requests cannot be loaded.',
        data: [],
        counts: {
          new: 0,
          reviewed: 0,
          quoted: 0,
          closed: 0,
          declined: 0,
          overdueFollowUps: 0,
        },
        emailConfigured: isEmailConfigured(),
      });
    }

    const [data, counts] = await Promise.all([getQuoteRequests(), getQuoteDashboardCounts()]);
    return res.json({
      success: true,
      connected: true,
      database: getMongoDbName(),
      collection: 'quoterequests',
      data,
      counts,
      emailConfigured: isEmailConfigured(),
    });
  } catch (error: any) {
    console.error('Admin quotes list error:', error);
    return res.status(503).json({
      success: false,
      connected: false,
      message: error?.message || 'Unable to load quote requests from MongoDB.',
      data: [],
      counts: {
        new: 0,
        reviewed: 0,
        quoted: 0,
        closed: 0,
        declined: 0,
        overdueFollowUps: 0,
      },
      emailConfigured: isEmailConfigured(),
    });
  }
});

app.patch('/api/admin/quotes', requireAdmin, async (req, res) => {
  try {
    const { id, status, notes, changedBy } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    const allowed: QuoteStatus[] = ['new', 'reviewed', 'quoted', 'closed', 'declined'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const managed = await updateQuoteStatusManaged(id, status, {
      changedBy: changedBy || 'admin',
      note: typeof notes === 'string' ? notes : '',
    });
    if (!managed) {
      const updated = await updateQuoteStatus(id, status, notes);
      return res.json({ success: updated });
    }
    const counts = await getQuoteDashboardCounts();
    return res.json({ success: true, data: managed, counts });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/admin/quotes/:id', requireAdmin, async (req, res) => {
  const quote = await getManagedQuoteById(routeParam(req.params.id));
  if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
  return res.json({ success: true, data: quote, emailConfigured: isEmailConfigured() });
});

app.patch('/api/admin/quotes/:id', requireAdmin, async (req, res) => {
  try {
    const id = routeParam(req.params.id);
    const { status, notes, followUpDate, followUpCompleted } = req.body;

    if (status) {
      const allowed: QuoteStatus[] = ['new', 'reviewed', 'quoted', 'closed', 'declined'];
      if (!allowed.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      const managed = await updateQuoteStatusManaged(id, status, {
        note: typeof notes === 'string' ? notes : '',
      });
      if (!managed) {
        return res.status(404).json({ success: false, message: 'Quote not found or update failed' });
      }
      const counts = await getQuoteDashboardCounts();
      return res.json({ success: true, data: managed, counts });
    }

    if (followUpDate !== undefined || followUpCompleted !== undefined) {
      const managed = await updateQuoteFollowUp(id, { followUpDate, followUpCompleted });
      if (!managed) {
        return res.status(404).json({ success: false, message: 'Quote not found or update failed' });
      }
      return res.json({ success: true, data: managed });
    }

    return res.status(400).json({ success: false, message: 'No valid update fields provided' });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/admin/quotes/:id/notes', requireAdmin, async (req, res) => {
  try {
    const id = routeParam(req.params.id);
    const body = sanitizePlainText(String(req.body?.body || ''), 2000, true);
    if (body.length < 2) {
      return res.status(400).json({ success: false, message: 'Note is required.' });
    }
    const note = await addQuoteAdminNote(id, body, String(req.body?.author || 'admin'));
    if (!note) {
      return res.status(404).json({ success: false, message: 'Quote not found or note failed.' });
    }
    const quote = await getManagedQuoteById(id);
    return res.json({ success: true, data: note, quote });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/admin/quotes/:id/quotations', requireAdmin, async (req, res) => {
  try {
    const id = routeParam(req.params.id);
    const quotation = await saveQuotation(id, req.body || {});
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quote request not found.' });
    }
    const quote = await getManagedQuoteById(id);
    return res.json({ success: true, data: quotation, quote });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.patch('/api/admin/quotes/:id/quotations/:quotationId', requireAdmin, async (req, res) => {
  try {
    const id = routeParam(req.params.id);
    const quotationId = routeParam(req.params.quotationId);
    const quotation = await saveQuotation(id, req.body || {}, quotationId);
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found.' });
    }
    const quote = await getManagedQuoteById(id);
    return res.json({ success: true, data: quotation, quote });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/admin/quotes/:id/quotations/:quotationId/pdf', requireAdmin, async (req, res) => {
  try {
    const id = routeParam(req.params.id);
    const quotationId = routeParam(req.params.quotationId);
    const quote = await getManagedQuoteById(id);
    const quotation = quote?.quotations?.find((q) => q.id === quotationId);
    if (!quote || !quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found.' });
    }
    const settings = await getSettings();
    const pdf = await buildQuotationPdfBuffer({ quotation, request: quote, settings });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${quotation.quotationNumber || 'quotation'}.pdf"`,
    );
    return res.send(pdf);
  } catch (e: any) {
    console.error('PDF generation failed:', e);
    return res.status(500).json({ success: false, message: e.message || 'PDF generation failed' });
  }
});

app.post('/api/admin/quotes/:id/quotations/:quotationId/email', requireAdmin, async (req, res) => {
  try {
    const id = routeParam(req.params.id);
    const quotationId = routeParam(req.params.quotationId);
    const confirm = Boolean(req.body?.confirm);
    if (!confirm) {
      return res.status(400).json({
        success: false,
        message: 'Confirmation required before sending a customer quotation email.',
      });
    }

    const quote = await getManagedQuoteById(id);
    const quotation = quote?.quotations?.find((q) => q.id === quotationId);
    if (!quote || !quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found.' });
    }

    const to = sanitizePlainText(String(req.body?.to || quotation.customerEmail || quote.email), 160);
    const subject = sanitizePlainText(
      String(req.body?.subject || `Quotation ${quotation.quotationNumber} – Desi Signs`),
      200,
    );
    const messageBody = sanitizePlainText(
      String(
        req.body?.message ||
          `Hello ${quotation.customerName || quote.fullName},\n\nPlease find your Desi Signs quotation attached.\n\nThank you,\nDesi Signs`,
      ),
      5000,
      true,
    );

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return res.status(400).json({ success: false, message: 'A valid recipient email is required.' });
    }

    const settings = await getSettings();
    const pdf = await buildQuotationPdfBuffer({ quotation, request: quote, settings });
    const delivery = await sendQuotationEmail({
      to,
      subject,
      messageBody,
      quotation,
      request: quote,
      settings,
      pdfBuffer: pdf,
    });

    const updatedQuotation = await markQuotationSent(id, quotationId, delivery);
    const updatedQuote = await getManagedQuoteById(id);
    const counts = await getQuoteDashboardCounts();

    if (!delivery.ok) {
      return res.status(delivery.skipped ? 503 : 502).json({
        success: false,
        message: delivery.error,
        data: { quotation: updatedQuotation, quote: updatedQuote, counts },
        emailConfigured: isEmailConfigured(),
      });
    }

    return res.json({
      success: true,
      message: 'Quotation email accepted by the email provider.',
      data: { quotation: updatedQuotation, quote: updatedQuote, counts },
    });
  } catch (e: any) {
    console.error('Quotation email failed:', e);
    return res.status(500).json({ success: false, message: e.message || 'Email send failed' });
  }
});

app.post('/api/admin/quotes/:id/resend-email', requireAdmin, async (req, res) => {
  try {
    const id = routeParam(req.params.id);
    const all = await getQuoteRequests();
    const quote = all.find((q) => q.id === id);
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    const delivery = await sendQuoteNotificationEmail(quote);
    if (delivery.ok) {
      await updateQuoteEmailNotification(id, {
        emailNotificationStatus: 'sent',
        emailNotificationError: '',
        emailNotificationAttempts: (quote.emailNotificationAttempts || 0) + delivery.attempts,
        emailNotificationSentAt: new Date().toISOString(),
      });
      return res.json({ success: true, message: 'Notification email sent.', data: { status: 'sent' } });
    }

    await updateQuoteEmailNotification(id, {
      emailNotificationStatus: delivery.skipped ? 'skipped' : 'failed',
      emailNotificationError: delivery.error,
      emailNotificationAttempts: (quote.emailNotificationAttempts || 0) + delivery.attempts,
    });

    return res.status(delivery.skipped ? 503 : 502).json({
      success: false,
      message: delivery.error,
      data: { status: delivery.skipped ? 'skipped' : 'failed' },
    });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/admin/inquiries', requireAdmin, async (_req, res) => {
  const data = await getContactInquiries();
  return res.json({ success: true, data });
});

app.patch('/api/admin/inquiries', requireAdmin, async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    const updated = await updateInquiryStatus(id, status);
    return res.json({ success: updated });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/health', async (_req, res) => {
  const { connectToDatabase, getMongoConnectionError, getMongoDbName } = await import('../../src/lib/db');
  const db = await connectToDatabase();
  res.json({
    success: true,
    service: 'desi-signs-backend',
    port: PORT,
    mongodb: {
      connected: Boolean(db),
      database: db ? getMongoDbName() : null,
      error: db ? null : getMongoConnectionError(),
    },
  });
});

app.listen(PORT, async () => {
  console.log(`Desi Signs backend running on http://localhost:${PORT}`);
  console.log('Frontend should be started separately with: npm run dev');
  try {
    const { connectToDatabase, getMongoConnectionError } = await import('../../src/lib/db');
    const db = await connectToDatabase();
    if (db) {
      await ensureCmsContentSeeded();
      await ensureBlogsSeeded();
      console.log('CMS content synced with MongoDB.');
    } else {
      console.warn(
        'MongoDB unavailable — quote requests will reject until connection succeeds:',
        getMongoConnectionError() || 'unknown error',
      );
    }
  } catch (error) {
    console.warn('CMS seed on startup failed:', error);
  }
});
