import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface AdventureActivityDocument {
  _id: Types.ObjectId;
  name: string;
  label: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdventureActivitySchema = new Schema<AdventureActivityDocument>(
  {
    name: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const AdventureActivityModel: Model<AdventureActivityDocument> =
  (mongoose.models.AdventureActivity as Model<AdventureActivityDocument>) ||
  mongoose.model<AdventureActivityDocument>(
    "AdventureActivity",
    AdventureActivitySchema,
  );

