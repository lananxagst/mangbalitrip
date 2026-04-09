import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import apiRouter from "./routes/api";
import authRouter from "./routes/authRoutes";
import adminRouter from "./routes/adminRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5100"] }));
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
