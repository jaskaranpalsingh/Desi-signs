/**
 * Scan Atlas databases for quote collections without printing secrets.
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
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.log('STATUS: missing_uri');
  process.exit(2);
}

await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
const admin = mongoose.connection.db.admin();
const { databases } = await admin.listDatabases();

for (const dbInfo of databases) {
  const name = dbInfo.name;
  if (['admin', 'local'].includes(name)) continue;
  const db = mongoose.connection.client.db(name);
  const cols = await db.listCollections().toArray();
  for (const col of cols) {
    if (!/quote/i.test(col.name)) continue;
    const count = await db.collection(col.name).countDocuments();
    const sample = await db
      .collection(col.name)
      .find({}, { projection: { fullName: 1, businessName: 1, status: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray();
    console.log(
      JSON.stringify({
        database: name,
        collection: col.name,
        count,
        sample: sample.map((d) => ({
          id: String(d._id),
          name: d.fullName,
          business: d.businessName,
          status: d.status,
          createdAt: d.createdAt,
        })),
      }),
    );
  }
}

await mongoose.disconnect();
console.log('SCAN_COMPLETE');
