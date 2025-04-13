import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

// Define an interface for global mongoose caching
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Attach to globalThis (Next.js friendly)
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

// Use global cache or initialize
const cached: MongooseCache = globalWithMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongoose) => mongoose)
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        cached.promise = null; // Reset cache on failure
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    throw error;
  }

  return cached.conn;
}

// Save to global object to persist between hot reloads
globalWithMongoose.mongoose = cached;

export default dbConnect;
