import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('No MONGODB_URI');
  process.exit(1);
}

await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
const cols = await mongoose.connection.db.listCollections().toArray();
console.log(
  'collections',
  cols.map((c) => c.name).sort(),
);
const count = await mongoose.connection.db.collection('blogposts').countDocuments();
console.log('blogposts count', count);
const sample = await mongoose.connection.db
  .collection('blogposts')
  .find({}, { projection: { title: 1, slug: 1, published: 1, category: 1 } })
  .limit(5)
  .toArray();
console.log(JSON.stringify(sample, null, 2));
await mongoose.disconnect();
