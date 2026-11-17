import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
  lastError: string | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  lastError: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

function hasPlaceholderCredentials(uri: string): boolean {
  return /YOUR_NEW_PASSWORD|YOUR_PASSWORD|<password>|changeme/i.test(uri);
}

export function getMongoConnectionError(): string | null {
  return cached.lastError;
}

export function getMongoDbName(): string | null {
  if (cached.conn?.connection?.db?.databaseName) {
    return cached.conn.connection.db.databaseName;
  }
  if (!MONGODB_URI) return null;
  try {
    const path = MONGODB_URI.split('@')[1] || '';
    const dbPart = path.split('/')[1]?.split('?')[0];
    return dbPart || null;
  } catch {
    return null;
  }
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    cached.lastError = 'MONGODB_URI is not set';
    console.warn('MONGODB_URI is not set. Using local in-memory data store.');
    return null;
  }

  if (hasPlaceholderCredentials(MONGODB_URI)) {
    cached.lastError =
      'MONGODB_URI still has a placeholder password. Update .env.local with your real Atlas password, then restart the backend.';
    console.warn(cached.lastError);
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        cached.lastError = null;
        const dbName = mongooseInstance.connection.db?.databaseName || 'unknown';
        console.log(`MongoDB connected successfully (database: ${dbName})`);
        return mongooseInstance;
      })
      .catch((err: Error) => {
        cached.lastError = err.message || 'MongoDB connection failed';
        console.warn('MongoDB connection failed, falling back to local data store:', err.message);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    cached.lastError = e instanceof Error ? e.message : 'MongoDB connection failed';
    return null;
  }

  // Allow a later retry after a failed attempt (e.g. password fixed + process still running).
  if (!cached.conn) {
    cached.promise = null;
  }

  return cached.conn;
}

export class DatabaseUnavailableError extends Error {
  constructor(message = 'MongoDB is not available') {
    super(message);
    this.name = 'DatabaseUnavailableError';
  }
}
