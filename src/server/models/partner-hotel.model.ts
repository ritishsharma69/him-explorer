import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface PartnerHotelDocument {
  _id: Types.ObjectId;
  name: string;
  label: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerHotelSchema = new Schema<PartnerHotelDocument>(
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

export const PartnerHotelModel: Model<PartnerHotelDocument> =
  (mongoose.models.PartnerHotel as Model<PartnerHotelDocument>) ||
  mongoose.model<PartnerHotelDocument>("PartnerHotel", PartnerHotelSchema);

