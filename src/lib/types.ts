export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  specifications: { label: string; value: string }[];
  materials: string[];
  applications: string[];
  image: string;
  galleryImages: string[];
  metaTitle: string;
  metaDescription: string;
  featured: boolean;
  order: number;
}

export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  leadTime: string;
  warranty: string;
  customizationOptions: string[];
  materialSpecs: string[];
  image: string;
  galleryImages: string[];
  priceRange?: string;
  featured: boolean;
  order: number;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  location: string;
  category: string;
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  materialsUsed: string[];
  image: string;
  additionalImages: string[];
  /** When true, eligible for the homepage featured banner (one primary selection preferred). */
  featured: boolean;
  /** Public visibility. Unpublished projects stay in admin but leave public listings. */
  published: boolean;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  location?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  featured?: boolean;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  content: string;
  author: string;
  authorRole: string;
  category: string;
  tags: string[];
  publishedDate: string;
  readTime: string;
  /** Featured image URL; empty string when no image is set. */
  image: string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  companyName: string;
  role: string;
  content: string;
  projectType: string;
  location: string;
  rating: number;
  featured: boolean;
}

export interface QuoteStatusHistoryEntry {
  id: string;
  status: 'new' | 'reviewed' | 'quoted' | 'closed' | 'declined';
  changedAt: string;
  changedBy: string;
  note?: string;
}

export interface QuoteAdminNote {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface CustomerQuotationItem {
  id: string;
  quoteRequestId: string;
  quotationNumber: string;
  quoteDate: string;
  expiryDate: string;
  customerName: string;
  businessName: string;
  customerEmail: string;
  customerPhone: string;
  customerLocation: string;
  signSpecifications: string;
  materials: string;
  manufacturingCost: number;
  installationCharges: number;
  permitCharges: number;
  otherCharges: number;
  discount: number;
  taxRatePercent: number;
  taxAmount: number;
  subtotal: number;
  totalCad: number;
  paymentTerms: string;
  estimatedCompletion: string;
  additionalNotes: string;
  status: 'draft' | 'sent';
  revision: number;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  emailDeliveryStatus?: 'pending' | 'sent' | 'failed' | 'skipped';
  emailDeliveryError?: string;
  emailMessageId?: string;
}

export interface QuoteRequestItem {
  id: string;
  createdAt: string;
  updatedAt?: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  location: string;
  signType: string;
  estimatedDimensions?: string;
  illuminationType?: string;
  installationRequired: boolean;
  permitAssistanceRequired: boolean;
  targetTimeline?: string;
  budgetRange?: string;
  projectDetails: string;
  /** Where the request was submitted from. */
  source?: 'request-a-quote' | 'channel-letter-calculator' | '';
  status: 'new' | 'reviewed' | 'quoted' | 'closed' | 'declined';
  notes?: string;
  emailNotificationStatus?: 'pending' | 'sent' | 'failed' | 'skipped';
  emailNotificationError?: string;
  emailNotificationAttempts?: number;
  emailNotificationSentAt?: string;
  statusHistory?: QuoteStatusHistoryEntry[];
  adminNotes?: QuoteAdminNote[];
  followUpDate?: string | null;
  followUpCompleted?: boolean;
  followUpCompletedAt?: string | null;
  quotations?: CustomerQuotationItem[];
}

export interface ContactInquiryItem {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
}

export interface WebsiteSettings {
  companyName: string;
  tagline: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  businessHours: string;
  serviceArea: string[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    googleMaps?: string;
  };
  seoGlobalTitle: string;
  seoGlobalDescription: string;
}

