/**
 * Upsert real portfolio projects into MongoDB and unpublish placeholder Unsplash seeds.
 * Does not overwrite existing documents that already match seed slugs.
 */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#') || !line.includes('=')) continue;
    const idx = line.indexOf('=');
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvLocal();

const seeds = [
  {
    slug: 'aurora-motel-pylon-sign',
    title: 'Aurora Motel – Illuminated Pylon Sign',
    client: 'Aurora Motel',
    location: 'Edmonton, AB',
    category: 'Pylon & Monument Signs',
    year: '2025',
    summary:
      'Night-ready multi-panel pylon with illuminated brand header, vacancy lightbox, and rate messaging for strong roadside visibility.',
    challenge:
      'The property needed brighter roadside presence after dark while keeping service messaging clear for weekly and monthly guests.',
    solution:
      'We fabricated a multi-cabinet illuminated pylon with high-contrast brand panels, vacancy lightbox, and durable weather-sealed LED internals for Alberta nights.',
    materialsUsed: [
      'Aluminum lightbox cabinets',
      'Polycarbonate faces',
      'High-output LED modules',
      'Powder-coated steel posts',
    ],
    image: '/d0d97e90-4168-44ff-9e37-bdb1211172f3.jpg',
    additionalImages: [],
    featured: true,
    published: true,
    order: 1,
  },
  {
    slug: 'blooming-futures-daycare-channel-letters',
    title: 'Blooming Futures Foundation Daycare',
    client: 'Blooming Futures Foundation Daycare',
    location: '9807 71 St, Edmonton, AB',
    category: 'Channel Letters & Window Graphics',
    year: '2025',
    summary:
      'Illuminated channel letters with brand logo mark, daycare capsule sign, and full-color window graphics for a welcoming storefront.',
    challenge:
      'The daycare needed a friendly, highly readable identity that worked on a modern commercial facade and large glass frontage.',
    solution:
      'We installed illuminated channel letters with logo identity, a complementary capsule sign, matching address lettering, and colorful window graphics.',
    materialsUsed: [
      'LED channel letters',
      'ACM / aluminum returns',
      'Vinyl window graphics',
      'Dimensional logo fabrication',
    ],
    image: '/9675c0a4-66ed-48ff-ab92-9fb93437264a.jpg',
    additionalImages: [
      '/165498e9-07b3-4c02-a542-578931d13005.jpg',
      '/d98870d3-1cb1-4e0a-a9e5-8da48131250f.jpg',
    ],
    featured: false,
    published: true,
    order: 2,
  },
  {
    slug: 'vape-smoke-more-storefront',
    title: 'Vape Smoke & More – Storefront Package',
    client: 'Vape Smoke & More',
    location: 'Edmonton, AB',
    category: 'Channel Letters & Window Graphics',
    year: '2025',
    summary:
      'Bold dimensional lettering paired with high-impact window wraps and entrance wayfinding for a complete retail exterior identity.',
    challenge:
      'The retailer needed strong street visibility plus clear entrance direction for customers approaching from the parking lot.',
    solution:
      'We combined stacked channel letters with full-color window graphics and directional messaging for a complete storefront package.',
    materialsUsed: [
      'Dimensional channel letters',
      'Printed vinyl window wraps',
      'Exterior LED flood accent',
    ],
    image: '/1943da0a-ee2e-42f6-86e9-5f85f68c9959.jpg',
    additionalImages: [],
    featured: false,
    published: true,
    order: 3,
  },
  {
    slug: 'gopal-sweets-backlit-sign',
    title: 'Gopal Sweets – Custom Backlit Sign',
    client: 'Gopal Sweets',
    location: 'Edmonton, AB',
    category: 'Custom Fabrication & Halo Lighting',
    year: '2025',
    summary:
      'Laser-cut rose-gold face with mirrored detail and warm LED backlighting for a distinctive sweets-shop brand mark.',
    challenge:
      'The brand required a custom illustrated mark that felt premium and cultural while remaining durable for commercial use.',
    solution:
      'We laser-cut a rose-gold faceplate with mirrored internal detail and warm LED halo lighting for a standout backlit identity piece.',
    materialsUsed: [
      'Laser-cut metal face',
      'Mirrored acrylic detail',
      'Warm white LED backlighting',
    ],
    image: '/9e85633c-bfd7-4011-85a1-866453712a7b.jpg',
    additionalImages: [],
    featured: false,
    published: true,
    order: 4,
  },
  {
    slug: 'blooming-futures-plaza-storefront',
    title: 'Blooming Futures – Plaza Storefront View',
    client: 'Blooming Futures Foundation Daycare',
    location: '9807 71 St, Edmonton, AB',
    category: 'Commercial Storefront Branding',
    year: '2025',
    summary:
      'Full plaza view of the daycare storefront package with channel letters, logo mark, and window branding in context.',
    challenge:
      'The client needed a complete exterior identity that read clearly from the parking lot and neighboring units.',
    solution:
      'We delivered a coordinated storefront package with dimensional channel letters, logo mark, capsule sign, and window graphics visible across the plaza.',
    materialsUsed: ['LED channel letters', 'Dimensional logo', 'Window vinyl graphics'],
    image: '/d98870d3-1cb1-4e0a-a9e5-8da48131250f.jpg',
    additionalImages: [
      '/165498e9-07b3-4c02-a542-578931d13005.jpg',
      '/9675c0a4-66ed-48ff-ab92-9fb93437264a.jpg',
    ],
    featured: false,
    published: true,
    order: 5,
  },
];

const placeholders = [
  'the-glasshouse-bistro-south-edmonton',
  'summit-health-wellness-strathcona',
  'apex-commercial-plaza-st-albert-trail',
  'kensington-roasters-downtown-edmonton',
];

await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
const col = mongoose.connection.db.collection('projects');

let inserted = 0;
for (const seed of seeds) {
  const existing = await col.findOne({ slug: seed.slug });
  if (!existing) {
    await col.insertOne({ ...seed, createdAt: new Date(), updatedAt: new Date() });
    inserted += 1;
  } else if (seed.featured) {
    await col.updateOne({ slug: seed.slug }, { $set: { featured: true, published: true } });
    await col.updateMany({ slug: { $ne: seed.slug } }, { $set: { featured: false } });
  }
}

const unpub = await col.updateMany(
  { slug: { $in: placeholders } },
  { $set: { published: false } },
);

const published = await col.countDocuments({ published: { $ne: false } });
const featured = await col.find({ featured: true, published: { $ne: false } }).toArray();

console.log(
  JSON.stringify(
    {
      inserted,
      placeholdersUnpublished: unpub.modifiedCount,
      publishedCount: published,
      featured: featured.map((f) => f.slug),
    },
    null,
    2,
  ),
);

await mongoose.disconnect();
