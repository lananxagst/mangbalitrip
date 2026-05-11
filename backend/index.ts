import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import apiRouter from "./routes/api";
import authRouter from "./routes/authRoutes";
import adminRouter from "./routes/adminRoutes";
import paymentRouter from "./routes/payment";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);

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
