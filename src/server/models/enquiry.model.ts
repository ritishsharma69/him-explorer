import mongoose, { Schema, type Model, type Types } from "mongoose";

export type EnquiryStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "closed";

export interface EnquiryDocument {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  package?: Types.ObjectId;
  preferredStartDate?: Date;
  numberOfAdults: number;
  numberOfChildren: number;
  budgetPerPersonMin?: number;
  message: string;
  howDidYouHear?: string;
  status: EnquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<EnquiryDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phoneCountryCode: { type: String, required: true, default: "+91" },
    phoneNumber: { type: String, required: true, trim: true },
    package: { type: Schema.Types.ObjectId, ref: "Package" },
    preferredStartDate: { type: Date },
    numberOfAdults: { type: Number, required: true, min: 1 },
    numberOfChildren: { type: Number, required: true, min: 0, default: 0 },
    budgetPerPersonMin: { type: Number, min: 0 },
    message: { type: String, required: true, trim: true },
    howDidYouHear: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  },
);

export const EnquiryModel: Model<EnquiryDocument> =
  (mongoose.models.Enquiry as Model<EnquiryDocument>) ||
  mongoose.model<EnquiryDocument>("Enquiry", EnquirySchema);
