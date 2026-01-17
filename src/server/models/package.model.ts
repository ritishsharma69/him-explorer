import mongoose, { Schema, type Model, type Types } from "mongoose";

export type PackageStatus = "draft" | "published" | "archived";

export interface ItineraryItem {
  dayNumber: number;
  title: string;
  description: string;
}

export interface PackageDocument {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  subtitle?: string;
  destinationName: string;
  durationDays: number;
  startingPricePerPerson: number;
  currencyCode: string;
  shortDescription: string;
  detailedDescription?: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryItem[];
  galleryImageUrls: string[];
  isFeatured: boolean;
  status: PackageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ItineraryItemSchema = new Schema<ItineraryItem>(
  {
    dayNumber: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const PackageSchema = new Schema<PackageDocument>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    destinationName: { type: String, required: true, trim: true },
    durationDays: { type: Number, required: true, min: 1 },
    startingPricePerPerson: { type: Number, required: true, min: 0 },
    currencyCode: { type: String, required: true, default: "INR" },
    shortDescription: { type: String, required: true, trim: true },
    detailedDescription: { type: String, trim: true },
    highlights: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    itinerary: { type: [ItineraryItemSchema], default: [] },
    galleryImageUrls: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

export const PackageModel: Model<PackageDocument> =
  (mongoose.models.Package as Model<PackageDocument>) ||
  mongoose.model<PackageDocument>("Package", PackageSchema);
