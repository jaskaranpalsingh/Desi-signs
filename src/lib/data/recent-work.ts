export type RecentWorkItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  image: string;
  video?: string;
};

/** Homepage “Our Recent Work” — real Desi Signs project media from /public. */
export const RECENT_WORK: RecentWorkItem[] = [
  {
    id: 'rw-aurora',
    slug: 'aurora-motel-pylon-sign',
    title: 'Aurora Motel – Illuminated Pylon Sign',
    category: 'Pylon & Monument Signs',
    location: 'Edmonton, AB',
    year: '2025',
    summary:
      'Night-ready multi-panel pylon with illuminated brand header, vacancy lightbox, and rate messaging for strong roadside visibility.',
    image: '/d0d97e90-4168-44ff-9e37-bdb1211172f3.jpg',
    video: '/portfolio/install-1.mp4',
  },
  {
    id: 'rw-blooming',
    slug: 'blooming-futures-daycare-channel-letters',
    title: 'Blooming Futures Foundation Daycare',
    category: 'Channel Letters & Window Graphics',
    location: '9807 71 St, Edmonton, AB',
    year: '2025',
    summary:
      'Illuminated channel letters with brand logo mark, daycare capsule sign, and full-color window graphics for a welcoming storefront.',
    image: '/9675c0a4-66ed-48ff-ab92-9fb93437264a.jpg',
    video: '/portfolio/install-3.mp4',
  },
  {
    id: 'rw-vape',
    slug: 'vape-smoke-more-storefront',
    title: 'Vape Smoke & More – Storefront Package',
    category: 'Channel Letters & Window Graphics',
    location: 'Edmonton, AB',
    year: '2025',
    summary:
      'Bold dimensional lettering paired with high-impact window wraps and entrance wayfinding for a complete retail exterior identity.',
    image: '/1943da0a-ee2e-42f6-86e9-5f85f68c9959.jpg',
    video: '/portfolio/install-2.mp4',
  },
  {
    id: 'rw-gopal',
    slug: 'gopal-sweets-backlit-sign',
    title: 'Gopal Sweets – Custom Backlit Sign',
    category: 'Custom Fabrication & Halo Lighting',
    location: 'Edmonton, AB',
    year: '2025',
    summary:
      'Laser-cut rose-gold face with mirrored detail and warm LED backlighting for a distinctive sweets-shop brand mark.',
    image: '/9e85633c-bfd7-4011-85a1-866453712a7b.jpg',
  },
  {
    id: 'rw-blooming-plaza',
    slug: 'blooming-futures-plaza-storefront',
    title: 'Blooming Futures – Plaza Storefront View',
    category: 'Commercial Storefront Branding',
    location: '9807 71 St, Edmonton, AB',
    year: '2025',
    summary:
      'Full plaza view of the daycare storefront package with channel letters, logo mark, and window branding in context.',
    image: '/d98870d3-1cb1-4e0a-a9e5-8da48131250f.jpg',
  },
];
