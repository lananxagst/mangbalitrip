import { Schema, model, Document } from "mongoose";

export interface ITravelGuide extends Document {
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  views: number;
  image: string;
}

const transform = (_doc: unknown, ret: Record<string, unknown>) => {
  ret.id = String(ret._id);
  delete ret._id;
  delete ret.__v;
};

const TravelGuideSchema = new Schema<ITravelGuide>(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    readTime: { type: String, required: true },
    views: { type: Number, default: 0 },
    image: { type: String, required: true },
  },
  { toJSON: { virtuals: true, transform } }
);

export const TravelGuideModel = model<ITravelGuide>("TravelGuide", TravelGuideSchema);
