# Desi Signs – Premium Commercial Signage Platform & Admin Console

An agency-grade, production-ready website and administration platform for **Desi Signs**, an architectural and commercial signage manufacturing company based in Edmonton, Alberta, Canada.

Built with a predominantly **clean white, minimal, and sophisticated design language** engineered to reflect authentic Canadian signage craftsmanship.

---

## 🏗 Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router with Server Components by default)
- **Language**: TypeScript (Strict typing across schemas, APIs, and components)
- **Styling**: Tailwind CSS (Tailwind v4 with crisp geometry, architectural spacing, and neutral color variables)
- **Database & Storage**: MongoDB with Mongoose + automatic memory/local fallback store (zero-configuration development and immediate persistence)
- **Security & Authentication**: Custom JWT authentication with HTTP-only cookies and bcryptjs password verification
- **Validation**: Zod server-side validation for quote requests, contact inquiries, and content models
- **Typography & Icons**: Geist font family, Lucide React icons
- **SEO**: Next.js Metadata API, dynamic XML Sitemap, dynamic `robots.txt`, and Google JSON-LD structured schemas (`LocalBusiness`, `Service`, `Article`, `BreadcrumbList`)

---

## 🎨 Design Philosophy

- **Predominantly White Aesthetics**: Primary background is crisp `#ffffff` with subtle off-white `#f8fafc` sectioning.
- **Editorial Typography**: Dark charcoal primary typography (`#0f172a`), neutral slate secondary typography (`#64748b`), and structured visual hierarchy.
- **No AI Clichés**: Avoids excessive rounded cards, floating random blobs, gratuitous gradients, and repetitive 3-card copycat sections.
- **Authentic Edmonton Context**: Real-world locations (South Edmonton Common, Whyte Ave / Strathcona, 104th Street Downtown, St. Albert Trail, Anthony Henday) and compliance with **City of Edmonton Zoning Bylaw 12800**.

---

## 📄 Public Pages

1. **Home (`/`)**:
   - Hero section with authentic commercial signage photography, primary & secondary CTAs, and trust indicators.
   - Craftsmanship introduction and Edmonton manufacturing heritage.
   - Editorial services showcase with asymmetric layout.
   - Featured projects showcase with varied proportions.
   - Why Choose Us (Alberta winter engineering, CSA/UL certification, in-house bending).
   - 4-step turnkey process timeline (Consultation → Design → In-house fabrication → Certified installation).
   - Verified business testimonials.
   - Final minimal CTA and comprehensive commercial footer.

2. **About Us (`/about`)**: Company heritage, local Edmonton manufacturing machinery, and principles.
3. **Services (`/services`)**: Turnkey capabilities with technical breakdowns.
4. **Individual Service (`/services/[slug]`)**: Detailed specifications, materials, applications, sub-galleries, and JSON-LD schema.
   - `/services/channel-letters`
   - `/services/3d-architectural-letters`
   - `/services/storefront-commercial-signs`
   - `/services/pylon-monument-signs`
   - `/services/interior-reception-signs`
   - `/services/custom-led-neon`
5. **Products Catalogue (`/products`)**: Commercial signage systems listing.
6. **Individual Product (`/products/[slug]`)**: Lead times, warranties, specs, and price ranges.
   - `/products/front-lit-channel-letters`
   - `/products/reverse-halo-channel-letters`
   - `/products/push-through-acrylic-lightbox`
   - `/products/brushed-metal-lobby-logo`
   - `/products/double-sided-blade-sign`
   - `/products/custom-led-neon-signboard`
7. **Projects / Case Studies (`/projects`)**: Detailed Edmonton installations.
8. **Individual Project (`/projects/[slug]`)**: Full case study with client challenge, engineered solution, and materials.
   - `/projects/the-glasshouse-bistro-south-edmonton`
   - `/projects/summit-health-wellness-strathcona`
   - `/projects/apex-commercial-plaza-st-albert-trail`
   - `/projects/kensington-roasters-downtown-edmonton`
9. **Visual Gallery (`/gallery`)**: Interactive category filtering and high-definition image lightbox.
10. **Blog & Guides (`/blog`)**: SEO-rich articles on Edmonton permits, channel letters ROI, and winter durability.
11. **Individual Blog (`/blog/[slug]`)**: Full article reading experience with schema markup and related reading.
12. **Request a Quote (`/quote`)**: Comprehensive interactive multi-step estimate request form with Zod validation.
13. **Contact Us (`/contact`)**: Direct contact info, operating hours, and interactive inquiry form.
14. **Privacy Policy (`/privacy-policy`)**
15. **Terms & Conditions (`/terms`)**
16. **Custom 404 (`/not-found`)**

---

## 🔐 Administrative Console (`/admin`)

A separate management dashboard sharing the same clean white aesthetic.

### Default Admin Credentials:
- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@desisigns.ca`
- **Password**: `AdminDesiSigns2026!`

### Admin Modules:
- **Dashboard Overview (`/admin`)**: Real-time counters, new quote highlights, unread messages.
- **Quote Requests (`/admin/quotes`)**: Inspect full sign specs, update statuses (`new` → `reviewed` → `quoted` → `closed`), add internal notes.
- **Contact Inquiries (`/admin/inquiries`)**: Message inbox, read status, and sender details.
- **Services Management (`/admin/services`)**: Add, edit, and delete commercial services.
- **Products Management (`/admin/products`)**: Add, edit, and delete products, warranties, and lead times.
- **Portfolio Management (`/admin/projects`)**: Add, edit, and delete case studies.
- **Gallery Management (`/admin/gallery`)**: Add photos by URL and category; 1-click removal.
- **Blog Management (`/admin/blog`)**: Create, edit, publish/unpublish articles.
- **Testimonials Management (`/admin/testimonials`)**: Add and manage verified reviews.
- **Website Settings & SEO (`/admin/settings`)**: Update verified phone, address, hours, default meta title, and meta description.

---

## 🚀 Running the Project

### 1. Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
```bash
npm run build
npm run start
```

### 3. Environment Variables (`.env.local`)
```env
# Optional MongoDB connection (uses high-speed local store if omitted)
# MONGODB_URI=mongodb://localhost:27017/desi_signs

# Authentication Secret
JWT_SECRET=desi_signs_super_secure_jwt_secret_key_2026_edmonton

# Default Admin Credentials
ADMIN_EMAIL=admin@desisigns.ca
ADMIN_PASSWORD=AdminDesiSigns2026!

# Public Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
