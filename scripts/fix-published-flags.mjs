import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
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
await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
const col = mongoose.connection.db.collection('projects');
const real = [
  'aurora-motel-pylon-sign',
  'blooming-futures-daycare-channel-letters',
  'vape-smoke-more-storefront',
  'gopal-sweets-backlit-sign',
  'blooming-futures-plaza-storefront',
];
const r = await col.updateMany({ slug: { $in: real } }, { $set: { published: true } });
console.log('updated', r.modifiedCount);
const pub = await col
  .find({ slug: { $in: real } })
  .project({ slug: 1, published: 1, featured: 1, title: 1 })
  .toArray();
console.log(JSON.stringify(pub, null, 2));
await mongoose.disconnect();
