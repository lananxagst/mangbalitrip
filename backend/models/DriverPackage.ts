import { Schema, model, Document } from "mongoose";

export interface IDriverPackage extends Document {
  title: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  features: string[];
  isHighlighted: boolean;
  order: number;
}

const transform = (_doc: unknown, ret: Record<string, unknown>) => {
  ret.id = String(ret._id);
  delete ret._id;
  delete ret.__v;
};

const DriverPackageSchema = new Schema<IDriverPackage>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    icon: { type: String, required: true },
    features: [{ type: String }],
    isHighlighted: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { toJSON: { virtuals: true, transform } }
);

export const DriverPackageModel = model<IDriverPackage>("DriverPackage", DriverPackageSchema);
