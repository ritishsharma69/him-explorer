import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface PopularDestinationDocument {
  _id: Types.ObjectId;
  name: string;
  imageUrl: string;
  order: number;
  size: "small" | "medium" | "large";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PopularDestinationSchema = new Schema<PopularDestinationDocument>(
  {
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    size: { type: String, enum: ["small", "medium", "large"], default: "medium" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const PopularDestinationModel: Model<PopularDestinationDocument> =
  (mongoose.models.PopularDestination as Model<PopularDestinationDocument>) ||
  mongoose.model<PopularDestinationDocument>("PopularDestination", PopularDestinationSchema);

