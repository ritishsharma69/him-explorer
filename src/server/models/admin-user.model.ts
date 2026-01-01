import mongoose, { Schema, type Model, type Types } from "mongoose";

export type AdminRole = "superadmin" | "admin";

export interface AdminUserDocument {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<AdminUserDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const AdminUserModel: Model<AdminUserDocument> =
  (mongoose.models.AdminUser as Model<AdminUserDocument>) ||
  mongoose.model<AdminUserDocument>("AdminUser", AdminUserSchema);
