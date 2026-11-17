/**
 * Safe MongoDB connectivity check for quote requests.
 * Does not print credentials or connection strings.
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
if (/YOUR_NEW_PASSWORD|YOUR_PASSWORD|<password>|changeme/i.test(uri)) {
  console.log('STATUS: placeholder_password');
  process.exit(2);
}

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const dbName = mongoose.connection.db.databaseName;
  const cols = await mongoose.connection.db.listCollections().toArray();
  const names = cols.map((c) => c.name).sort();
  const quoteCol = names.find((n) => /quote/i.test(n)) || 'quoterequests';
  const count = await mongoose.connection.db.collection(quoteCol).countDocuments();
  const latest = await mongoose.connection.db
    .collection(quoteCol)
    .find({}, { projection: { fullName: 1, businessName: 1, status: 1, createdAt: 1, source: 1 } })
    .sort({ createdAt: -1 })
    .limit(3)
    .toArray();

  console.log('STATUS: connected');
  console.log('DATABASE:', dbName);
  console.log('COLLECTION:', quoteCol);
  console.log('QUOTE_COUNT:', count);
  console.log(
    'LATEST:',
    JSON.stringify(
      latest.map((d) => ({
        id: String(d._id),
        name: d.fullName,
        business: d.businessName,
        status: d.status,
        source: d.source || '',
        createdAt: d.createdAt,
      })),
      null,
      2,
    ),
  );
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.log('STATUS: failed');
  console.log('ERROR:', err instanceof Error ? err.message : String(err));
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
}
