import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not set. Please add it to your environment (e.g. .env.local).",
  );
}

type MongooseConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongoose: MongooseConnection | undefined;
}

const globalForMongoose = globalThis as typeof globalThis & {
  _mongoose?: MongooseConnection;
};

const cached: MongooseConnection =
  globalForMongoose._mongoose ?? {
    conn: null,
    promise: null,
  };

if (!globalForMongoose._mongoose) {
  globalForMongoose._mongoose = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
