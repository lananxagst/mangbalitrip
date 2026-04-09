import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { protect, AuthRequest } from "../middleware/authMiddleware";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-prod";

const signToken = (id: string, email: string, name: string, role: string) =>
  jwt.sign({ id, email, name, role }, JWT_SECRET, { expiresIn: "7d" });

/* ─── Register ──────────────────────────────────────────────────── */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, whatsapp } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }
  const existing = await UserModel.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409).json({ message: "Email is already registered" });
    return;
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email, password: hashed, whatsapp });
  const token = signToken(user._id.toString(), user.email, user.name, user.role);
  res.status(201).json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  });
});

/* ─── Login ─────────────────────────────────────────────────────── */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Email or password is incorrect" });
    return;
  }
  const token = signToken(user._id.toString(), user.email, user.name, user.role);
  res.json({
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  });
});

/* ─── Get current user ──────────────────────────────────────────── */
router.get("/me", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await UserModel.findById(req.user?.id).select("-password");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    whatsapp: user.whatsapp,
  });
});

export default router;
