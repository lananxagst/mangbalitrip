import { Schema, model, Document } from "mongoose";

export interface IPackage extends Document {
  title: string;
  type: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  category: string;
  isTopPick: boolean;
}

const PackageSchema = new Schema<IPackage>(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    image: { type: String, required: true },
    badge: { type: String },
    category: { type: String, required: true },
    isTopPick: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

export const PackageModel = model<IPackage>("Package", PackageSchema);
