import { Schema, model, Document } from "mongoose";

export interface IDestination extends Document {
  name: string;
  image: string;
}

const transform = (_doc: unknown, ret: Record<string, unknown>) => {
  ret.id = String(ret._id);
  delete ret._id;
  delete ret.__v;
};

const DestinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  { toJSON: { virtuals: true, transform } }
);

export const DestinationModel = model<IDestination>("Destination", DestinationSchema);
