import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

export async function GET() {
  try {
    console.log("DNS:", dns.getServers());

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "nextjs-ecommarce",
      serverSelectionTimeoutMS: 10000,
    });

    return Response.json({
      success: true,
      message: "MongoDB connected from Next.js",
    });
  } catch (error) {
    console.error("NEXT DB ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}