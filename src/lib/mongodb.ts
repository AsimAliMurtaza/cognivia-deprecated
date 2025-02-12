import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Use globalThis for better compatibility
let cached = (globalThis as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI || "", opts)
      .then((mongoose) => mongoose)
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        cached.promise = null; // Reset on failure
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

// Ensure caching across hot reloads in Next.js
(globalThis as any).mongoose = cached;

export default dbConnect;
