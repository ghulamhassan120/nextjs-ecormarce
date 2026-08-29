import dns from "dns";
import dotenv from "dotenv";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config({ path: ".env.local" });

console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "LOADED ✅" : "UNDEFINED ❌"
);

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected successfully ✅");

  await mongoose.disconnect();
} catch (error) {
  console.log("MongoDB connection failed ❌");
  console.error(error);
}