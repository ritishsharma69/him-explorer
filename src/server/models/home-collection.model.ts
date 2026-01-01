import mongoose, { Schema, type Model, type Types } from "mongoose";

export type HomeCollectionCategory = "top" | "offbeat";

export interface HomeCollectionItemDocument {
  _id: Types.ObjectId;
  category: HomeCollectionCategory;
  badge: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HomeCollectionItemSchema = new Schema<HomeCollectionItemDocument>(
  {
    category: {
      type: String,
      required: true,
      enum: ["top", "offbeat"],
    },
    badge: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const HomeCollectionItemModel: Model<HomeCollectionItemDocument> =
  (mongoose.models.HomeCollectionItem as Model<HomeCollectionItemDocument>) ||
  mongoose.model<HomeCollectionItemDocument>(
    "HomeCollectionItem",
    HomeCollectionItemSchema,
  );

