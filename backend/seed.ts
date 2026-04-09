import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db";
import { PackageModel } from "./models/Package";
import { DestinationModel } from "./models/Destination";
import { TravelGuideModel } from "./models/TravelGuide";
import { DriverPackageModel } from "./models/DriverPackage";

const packages = [
  /* ── Top Picks ─────────────────────────────────────────────────── */
  {
    title: "Best of Bali Waterfalls: Tibumana, Tukad Cepung",
    type: "Day Trip", duration: "6 - 8 hours", price: 756000,
    rating: 4.99, reviews: 2500,
    image: "https://images.unsplash.com/photo-1582583088753-afb19907963a?q=80&w=688&auto=format&fit=crop",
    badge: "Top Pick", category: "Trekking", isTopPick: true,
  },
  {
    title: "Bali Full-Day Water Temples and UNESCO Heritage",
    type: "Day Trip", duration: "8 - 10 hours", price: 924000,
    rating: 4.98, reviews: 2154,
    image: "https://images.unsplash.com/photo-1552301726-570d51466ae2?q=80&w=1471&auto=format&fit=crop",
    badge: "Top Pick", category: "Cultural Tours", isTopPick: true,
  },
  {
    title: "Ubud Top Attractions: Waterfalls, Temples and Rice Terraces",
    type: "Day Trip", duration: "8 - 9 hours", price: 840000,
    rating: 4.99, reviews: 662,
    image: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=800&q=80",
    badge: "Top Pick", category: "Sightseeing Tours", isTopPick: true,
  },
  {
    title: "ATV Bali Ubud Adventure: Gorilla Face Track",
    type: "Outdoor Activity", duration: "2 - 3 hours", price: 588000,
    rating: 5.0, reviews: 19,
    image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80",
    badge: "Top Pick", category: "Outdoor Activities", isTopPick: true,
  },
  /* ── All Activities ─────────────────────────────────────────────── */
  {
    title: "Private Tour: Full-Day Mount Batur Sunrise Trek",
    type: "Outdoor Activity", duration: "8 - 10 hours", price: 1092000,
    rating: 5.0, reviews: 181,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    badge: "Popular", category: "Trekking", isTopPick: false,
  },
  {
    title: "Private Tour: Uluwatu Temple Sunset & Kecak Dance",
    type: "Outdoor Activity", duration: "6 - 8 hours", price: 672000,
    rating: 4.99, reviews: 399,
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    badge: "Popular", category: "Cultural Tours", isTopPick: false,
  },
  {
    title: "Volcano Jeep Adventure and Hot Spring",
    type: "Outdoor Activity", duration: "8 - 10 hours", price: 1092000,
    rating: 5.0, reviews: 6,
    image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&q=80",
    badge: undefined, category: "Outdoor Activities", isTopPick: false,
  },
  {
    title: "Private Tour: Ubud and Tanah Lot Day Tour",
    type: "Day Trip", duration: "8 - 10 hours", price: 840000,
    rating: 5.0, reviews: 49,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    badge: undefined, category: "Sightseeing Tours", isTopPick: false,
  },
  {
    title: "Half Day Tanah Lot Sunset Tour",
    type: "Day Trip", duration: "5 - 6 hours", price: 504000,
    rating: 4.97, reviews: 320,
    image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800&q=80",
    badge: undefined, category: "Sightseeing Tours", isTopPick: false,
  },
  {
    title: "Ubud Cooking Class, Rice Terrace & Temple Tour",
    type: "Day Trip", duration: "8 - 10 hours", price: 756000,
    rating: 4.96, reviews: 512,
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
    badge: undefined, category: "Food & Dining", isTopPick: false,
  },
  {
    title: "Full-Day Ayung River White Water Rafting",
    type: "Outdoor Activity", duration: "8 - 10 hours", price: 630000,
    rating: 4.95, reviews: 743,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    badge: "Popular", category: "Water Sports", isTopPick: false,
  },
  {
    title: "Best of Bali Waterfalls: Tibumana & Tukad Cepung",
    type: "Day Trip", duration: "6 - 8 hours", price: 756000,
    rating: 4.99, reviews: 2500,
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    badge: "Popular", category: "Trekking", isTopPick: false,
  },
  {
    title: "White Water Rafting & Elephant Safari Package",
    type: "Outdoor Activity", duration: "8 - 10 hours", price: 1176000,
    rating: 4.94, reviews: 89,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    badge: undefined, category: "Water Sports", isTopPick: false,
  },
];

const destinations = [
  { name: "Ubud", image: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=600&q=80" },
  { name: "Bedugul Bali", image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf4?w=600&q=80" },
  { name: "Seminyak", image: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80" },
  { name: "Uluwatu", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80" },
  { name: "Kuta", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80" },
  { name: "Canggu", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { name: "Bangli Regency", image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=80" },
  { name: "Penida Island", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
];

const travelGuides = [
  {
    category: "Island News",
    title: "Lebaran in Bali: What to Expect During Eid al-Fitr",
    excerpt: "Lebaran in Bali is a peaceful and respectful time, with many locals returning home to celebrate with family...",
    readTime: "2 min read", views: 101,
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&q=80",
  },
  {
    category: "Travel Tips & Guides",
    title: "How to Respect and Experience Nyepi in Bali",
    excerpt: "Experience the unique atmosphere of Nyepi, Bali's Day of Silence, and learn how to respectfully enjoy this sacred day...",
    readTime: "3 min read", views: 27,
    image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=400&q=80",
  },
  {
    category: "Travel Tips & Guides",
    title: "Best Time to Visit Bali: A Month-by-Month Guide",
    excerpt: "Planning your Bali trip? Discover the best months to visit based on weather, festivals, and crowd levels...",
    readTime: "4 min read", views: 245,
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80",
  },
  {
    category: "Island News",
    title: "Top 10 Hidden Gems in Bali You Must Visit",
    excerpt: "Beyond the tourist trail, Bali hides breathtaking spots that few travelers discover. Here are our top picks...",
    readTime: "5 min read", views: 189,
    image: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=400&q=80",
  },
];

const driverPackages = [
  {
    title: "Airport Transfer",
    description: "Comfortable & reliable airport pickup and drop-off service anywhere in Bali",
    price: 250000, duration: "1-way", icon: "✈️",
    features: ["Meet & Greet", "Door to Door", "AC Vehicle", "Free Water"],
    isHighlighted: false, order: 1,
  },
  {
    title: "Half Day Tour",
    description: "Explore Bali's top attractions in a relaxed half-day private tour",
    price: 450000, duration: "4-5 hours", icon: "🌅",
    features: ["Personal Driver", "AC Vehicle", "Fuel Included", "Flexible Route"],
    isHighlighted: false, order: 2,
  },
  {
    title: "Full Day Tour",
    description: "A complete Bali experience with a dedicated private driver guiding you all day",
    price: 700000, duration: "8-10 hours", icon: "🏝️",
    features: ["Personal Driver", "AC Vehicle", "Fuel Included", "Custom Itinerary", "Free Water"],
    isHighlighted: true, order: 3,
  },
  {
    title: "Multi-Day Package",
    description: "The ultimate Bali adventure with a private driver for multiple days",
    price: 600000, duration: "per day", icon: "📅",
    features: ["Dedicated Driver", "AC Vehicle", "Fuel Included", "Hotel Pickup", "Custom Route", "24/7 Support"],
    isHighlighted: false, order: 4,
  },
];

async function seed() {
  await connectDB();

  console.log("🗑️  Clearing existing data...");
  await Promise.all([
    PackageModel.deleteMany({}),
    DestinationModel.deleteMany({}),
    TravelGuideModel.deleteMany({}),
    DriverPackageModel.deleteMany({}),
  ]);

  console.log("🌱 Seeding database...");
  await Promise.all([
    PackageModel.insertMany(packages),
    DestinationModel.insertMany(destinations),
    TravelGuideModel.insertMany(travelGuides),
    DriverPackageModel.insertMany(driverPackages),
  ]);

  console.log(`✅ Seeded: ${packages.length} packages, ${destinations.length} destinations, ${travelGuides.length} guides, ${driverPackages.length} driver packages`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
