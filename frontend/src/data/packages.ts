// Types only — data is served from MongoDB via /api endpoints

export interface Package {
  id: string;
  title: string;
  type: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  category: string;
  isTopPick?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  image: string;
}

export interface TravelGuide {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  views: number;
  image: string;
}

export interface DriverPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  features: string[];
  isHighlighted: boolean;
  order: number;
}

export const categories = [
  "All",
  "Trekking",
  "Sightseeing Tours",
  "Outdoor Activities",
  "Cultural Tours",
  "Water Sports",
  "Food & Dining",
  "Tickets",
];
