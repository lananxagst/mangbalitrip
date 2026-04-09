import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in .env");
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
};
