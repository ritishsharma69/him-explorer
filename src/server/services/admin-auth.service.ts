import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/server/db";
import { AdminUserModel } from "@/server/models/admin-user.model";

export type AdminAuthFailureReason = "INVALID_CREDENTIALS" | "INACTIVE";

export type AdminAuthResult =
  | {
      ok: true;
      admin: {
        id: string;
        fullName: string;
        email: string;
        role: string;
      };
    }
  | {
      ok: false;
      reason: AdminAuthFailureReason;
    };

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminAuthResult> {
  await connectToDatabase();

  const admin = await AdminUserModel.findOne({ email }).exec();

  if (!admin || !admin.isActive) {
    return { ok: false, reason: "INVALID_CREDENTIALS" };
  }

  const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatch) {
    return { ok: false, reason: "INVALID_CREDENTIALS" };
  }

  return {
    ok: true,
    admin: {
      id: admin._id.toString(),
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
  };
}

