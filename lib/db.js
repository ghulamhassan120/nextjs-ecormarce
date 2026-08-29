import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8","1.1.1.1" ]);

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("MONGODB_URI is not defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const ConnectDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        dbName: "nextjs-ecommarce",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error.message);

        cached.promise = null;
        cached.conn = null;

        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default ConnectDb;