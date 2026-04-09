import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  whatsapp?: string;
  role: "user" | "admin";
}

const transform = (_doc: unknown, ret: Record<string, unknown>) => {
  ret.id = String(ret._id);
  delete ret._id;
  delete ret.__v;
  delete ret.password;
};

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    whatsapp: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true, toJSON: { virtuals: true, transform } }
);

export const UserModel = model<IUser>("User", UserSchema);
