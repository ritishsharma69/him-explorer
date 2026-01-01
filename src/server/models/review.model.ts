import mongoose, { Schema, type Model, type Types } from "mongoose";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ReviewDocument {
  _id: Types.ObjectId;
  fullName: string;
  location?: string;
  rating: number;
  comment: string;
  package?: Types.ObjectId;
  isFeatured: boolean;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    package: { type: Schema.Types.ObjectId, ref: "Package" },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const ReviewModel: Model<ReviewDocument> =
  (mongoose.models.Review as Model<ReviewDocument>) ||
  mongoose.model<ReviewDocument>("Review", ReviewSchema);
