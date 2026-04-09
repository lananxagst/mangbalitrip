import { Router, Request, Response } from "express";
import { protect, requireAdmin, AuthRequest } from "../middleware/authMiddleware";
import { PackageModel } from "../models/Package";
import { DestinationModel } from "../models/Destination";
import { TravelGuideModel } from "../models/TravelGuide";
import { DriverPackageModel } from "../models/DriverPackage";
import { UserModel } from "../models/User";

const router = Router();

router.use(protect as (req: Request, res: Response, next: () => void) => void);
router.use(requireAdmin as (req: Request, res: Response, next: () => void) => void);

/* ─── Dashboard stats ───────────────────────────────────────────── */
router.get("/stats", async (_req: AuthRequest, res: Response) => {
  const [packages, destinations, guides, driverPkgs, users] = await Promise.all([
    PackageModel.countDocuments(),
    DestinationModel.countDocuments(),
    TravelGuideModel.countDocuments(),
    DriverPackageModel.countDocuments(),
    UserModel.countDocuments({ role: "user" }),
  ]);
  res.json({ packages, destinations, guides, driverPackages: driverPkgs, users });
});

/* ─── Packages CRUD ─────────────────────────────────────────────── */
router.get("/packages", async (_req, res: Response) => {
  const data = await PackageModel.find().sort({ createdAt: -1 });
  res.json(data);
});
router.post("/packages", async (req: Request, res: Response) => {
  const doc = await PackageModel.create(req.body);
  res.status(201).json(doc);
});
router.put("/packages/:id", async (req: Request, res: Response) => {
  const doc = await PackageModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) { res.status(404).json({ message: "Not found" }); return; }
  res.json(doc);
});
router.delete("/packages/:id", async (req: Request, res: Response) => {
  await PackageModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ─── Destinations CRUD ─────────────────────────────────────────── */
router.get("/destinations", async (_req, res: Response) => {
  const data = await DestinationModel.find();
  res.json(data);
});
router.post("/destinations", async (req: Request, res: Response) => {
  const doc = await DestinationModel.create(req.body);
  res.status(201).json(doc);
});
router.put("/destinations/:id", async (req: Request, res: Response) => {
  const doc = await DestinationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) { res.status(404).json({ message: "Not found" }); return; }
  res.json(doc);
});
router.delete("/destinations/:id", async (req: Request, res: Response) => {
  await DestinationModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ─── Travel Guides CRUD ────────────────────────────────────────── */
router.get("/guides", async (_req, res: Response) => {
  const data = await TravelGuideModel.find();
  res.json(data);
});
router.post("/guides", async (req: Request, res: Response) => {
  const doc = await TravelGuideModel.create(req.body);
  res.status(201).json(doc);
});
router.put("/guides/:id", async (req: Request, res: Response) => {
  const doc = await TravelGuideModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) { res.status(404).json({ message: "Not found" }); return; }
  res.json(doc);
});
router.delete("/guides/:id", async (req: Request, res: Response) => {
  await TravelGuideModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ─── Driver Packages CRUD ──────────────────────────────────────── */
router.get("/driver-packages", async (_req, res: Response) => {
  const data = await DriverPackageModel.find().sort({ order: 1 });
  res.json(data);
});
router.post("/driver-packages", async (req: Request, res: Response) => {
  const doc = await DriverPackageModel.create(req.body);
  res.status(201).json(doc);
});
router.put("/driver-packages/:id", async (req: Request, res: Response) => {
  const doc = await DriverPackageModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) { res.status(404).json({ message: "Not found" }); return; }
  res.json(doc);
});
router.delete("/driver-packages/:id", async (req: Request, res: Response) => {
  await DriverPackageModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ─── Users list ────────────────────────────────────────────────── */
router.get("/users", async (_req, res: Response) => {
  const users = await UserModel.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export default router;
