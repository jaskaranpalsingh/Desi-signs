import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const quoteRequestSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Location in Alberta is required'),
  signType: z.string().min(2, 'Please select or describe a signage type'),
  estimatedDimensions: z.string().optional(),
  illuminationType: z.string().optional(),
  installationRequired: z.boolean().default(false),
  permitAssistanceRequired: z.boolean().default(false),
  targetTimeline: z.string().optional(),
  budgetRange: z.string().optional(),
  projectDetails: z.string().min(10, 'Please describe your project in at least 10 characters'),
  source: z.enum(['request-a-quote', 'channel-letter-calculator']).optional(),
});

export const contactInquirySchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(120),
  email: z.string().email('Valid email is required').max(160),
  phone: z.string().max(40).optional(),
  subject: z.string().min(3, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  /** Honeypot — bots that fill this are accepted without sending email. */
  website: z.string().max(200).optional(),
});

export const serviceSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  subtitle: z.string().optional(),
  shortDescription: z.string().min(5),
  fullDescription: z.string().min(20),
  features: z.array(z.string()).default([]),
  specifications: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  materials: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  image: z.string().url('Must be a valid image URL'),
  galleryImages: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const productSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  category: z.string().min(2),
  shortDescription: z.string().min(5),
  fullDescription: z.string().min(20),
  leadTime: z.string().optional(),
  warranty: z.string().optional(),
  customizationOptions: z.array(z.string()).default([]),
  materialSpecs: z.array(z.string()).default([]),
  image: z.string().url(),
  galleryImages: z.array(z.string()).default([]),
  priceRange: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const projectSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  client: z.string().min(2),
  location: z.string().min(2),
  category: z.string().min(2),
  year: z.string().min(4),
  summary: z.string().min(10),
  challenge: z.string().min(10),
  solution: z.string().min(10),
  materialsUsed: z.array(z.string()).default([]),
  image: z.string().url(),
  additionalImages: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const blogPostSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  shortDescription: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  author: z.string().optional().default(''),
  authorRole: z.string().optional().default('Signage Specialist'),
  category: z.string().min(2, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  publishedDate: z.string().min(4, 'Publish date is required'),
  readTime: z.string().optional().default('5 min read'),
  image: z
    .string()
    .optional()
    .default('')
    .refine((v) => !v || v.startsWith('/') || /^https?:\/\//i.test(v), {
      message: 'Image must be a URL or /uploads path',
    }),
  imageAlt: z.string().optional().default(''),
  metaTitle: z.string().optional().default(''),
  metaDescription: z.string().optional().default(''),
  focusKeyword: z.string().optional().default(''),
  canonicalUrl: z.string().optional().default(''),
  published: z.boolean().optional().default(false),
});

