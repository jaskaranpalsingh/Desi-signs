import mongoose, { Schema } from 'mongoose';

const ServiceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    features: [{ type: String }],
    specifications: [{ label: String, value: String }],
    materials: [{ type: String }],
    applications: [{ type: String }],
    image: { type: String, required: true },
    galleryImages: [{ type: String }],
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    leadTime: { type: String, default: '' },
    warranty: { type: String, default: '' },
    customizationOptions: [{ type: String }],
    materialSpecs: [{ type: String }],
    image: { type: String, required: true },
    galleryImages: [{ type: String }],
    priceRange: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    client: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    year: { type: String, required: true },
    summary: { type: String, required: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    materialsUsed: [{ type: String }],
    image: { type: String, required: true },
    additionalImages: [{ type: String }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ published: 1, order: 1 });
ProjectSchema.index({ featured: 1, published: 1, order: 1 });

const GallerySchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, default: '' },
    aspectRatio: { type: String, enum: ['landscape', 'portrait', 'square'], default: 'landscape' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const BlogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: '' },
    authorRole: { type: String, default: 'Signage Specialist' },
    category: { type: String, required: true },
    tags: [{ type: String }],
    publishedDate: { type: String, required: true },
    readTime: { type: String, default: '5 min read' },
    image: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    focusKeyword: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BlogPostSchema.index({ published: 1, publishedDate: -1 });
BlogPostSchema.index({ category: 1, published: 1 });

const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true },
    companyName: { type: String, required: true },
    role: { type: String, default: '' },
    content: { type: String, required: true },
    projectType: { type: String, default: '' },
    location: { type: String, default: 'Edmonton, AB' },
    rating: { type: Number, default: 5 },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const QuoteStatusHistorySchema = new Schema(
  {
    id: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'quoted', 'closed', 'declined'],
      required: true,
    },
    changedAt: { type: Date, required: true },
    changedBy: { type: String, default: 'admin' },
    note: { type: String, default: '' },
  },
  { _id: false },
);

const QuoteAdminNoteSchema = new Schema(
  {
    id: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: String, default: 'admin' },
    createdAt: { type: Date, required: true },
  },
  { _id: false },
);

const CustomerQuotationSchema = new Schema(
  {
    id: { type: String, required: true },
    quotationNumber: { type: String, required: true },
    quoteDate: { type: String, default: '' },
    expiryDate: { type: String, default: '' },
    customerName: { type: String, default: '' },
    businessName: { type: String, default: '' },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    customerLocation: { type: String, default: '' },
    signSpecifications: { type: String, default: '' },
    materials: { type: String, default: '' },
    manufacturingCost: { type: Number, default: 0 },
    installationCharges: { type: Number, default: 0 },
    permitCharges: { type: Number, default: 0 },
    otherCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    taxRatePercent: { type: Number, default: 5 },
    taxAmount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    totalCad: { type: Number, default: 0 },
    paymentTerms: { type: String, default: '50% deposit to begin fabrication. Balance due before installation.' },
    estimatedCompletion: { type: String, default: '' },
    additionalNotes: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'sent'], default: 'draft' },
    revision: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    sentAt: { type: Date },
    emailDeliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'skipped'],
    },
    emailDeliveryError: { type: String, default: '' },
    emailMessageId: { type: String, default: '' },
  },
  { _id: false },
);

const QuoteRequestSchema = new Schema(
  {
    fullName: { type: String, required: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    signType: { type: String, required: true },
    estimatedDimensions: { type: String, default: '' },
    illuminationType: { type: String, default: '' },
    installationRequired: { type: Boolean, default: false },
    permitAssistanceRequired: { type: Boolean, default: false },
    targetTimeline: { type: String, default: '' },
    budgetRange: { type: String, default: '' },
    projectDetails: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'quoted', 'closed', 'declined'],
      default: 'new',
    },
    notes: { type: String, default: '' },
    emailNotificationStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'skipped'],
      default: 'pending',
    },
    emailNotificationError: { type: String, default: '' },
    emailNotificationAttempts: { type: Number, default: 0 },
    emailNotificationSentAt: { type: Date },
    statusHistory: { type: [QuoteStatusHistorySchema], default: [] },
    adminNotes: { type: [QuoteAdminNoteSchema], default: [] },
    followUpDate: { type: Date, default: null },
    followUpCompleted: { type: Boolean, default: false },
    followUpCompletedAt: { type: Date, default: null },
    quotations: { type: [CustomerQuotationSchema], default: [] },
    source: {
      type: String,
      enum: ['request-a-quote', 'channel-letter-calculator', ''],
      default: '',
    },
  },
  { timestamps: true }
);

const ContactInquirySchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  },
  { timestamps: true }
);

const SettingsSchema = new Schema(
  {
    companyName: { type: String, default: 'Desi Signs' },
    tagline: { type: String, default: 'Architectural & Commercial Signage Solutions in Edmonton' },
    address: { type: String, default: '9845 62 Ave NW' },
    city: { type: String, default: 'Edmonton' },
    province: { type: String, default: 'Alberta' },
    postalCode: { type: String, default: 'T6E 0E3' },
    country: { type: String, default: 'Canada' },
    phone: { type: String, default: '(780) 555-0192' },
    email: { type: String, default: 'Save@desisigns.com' },
    businessHours: { type: String, default: 'Monday – Friday: 8:00 AM – 5:00 PM' },
    serviceArea: [{ type: String }],
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
      googleMaps: String,
    },
    seoGlobalTitle: String,
    seoGlobalDescription: String,
  },
  { timestamps: true }
);

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Administrator' },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

export const ServiceModel = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const GalleryModel = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
export const BlogPostModel = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
export const TestimonialModel = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
export const QuoteRequestModel = mongoose.models.QuoteRequest || mongoose.model('QuoteRequest', QuoteRequestSchema);
export const ContactInquiryModel = mongoose.models.ContactInquiry || mongoose.model('ContactInquiry', ContactInquirySchema);
export const SettingsModel = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

