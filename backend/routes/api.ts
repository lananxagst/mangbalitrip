import { Router, Request, Response } from "express";
import { PackageModel } from "../models/Package";
import { DestinationModel } from "../models/Destination";
import { TravelGuideModel } from "../models/TravelGuide";
import { DriverPackageModel } from "../models/DriverPackage";

const router = Router();

/* ─── Packages ─────────────────────────────────────────────────── */
router.get("/packages", async (req: Request, res: Response) => {
  try {
    const { topPick, category } = req.query;
    const filter: Record<string, unknown> = {};
    if (topPick === "true") filter.isTopPick = true;
    if (category && category !== "All") filter.category = category;
    const packages = await PackageModel.find(filter);
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

/* ─── Categories (derived) ──────────────────────────────────────── */
router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const cats = await PackageModel.distinct("category");
    res.json(["All", ...cats.sort()]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

/* ─── Destinations ──────────────────────────────────────────────── */
router.get("/destinations", async (_req: Request, res: Response) => {
  try {
    const destinations = await DestinationModel.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

/* ─── Travel Guides ─────────────────────────────────────────────── */
router.get("/guides", async (_req: Request, res: Response) => {
  try {
    const guides = await TravelGuideModel.find();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

/* ─── Driver Packages ───────────────────────────────────────────── */
router.get("/driver-packages", async (_req: Request, res: Response) => {
  try {
    const packages = await DriverPackageModel.find().sort({ order: 1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

export default router;
