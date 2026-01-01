import { Types } from "mongoose";

import { connectToDatabase } from "@/server/db";
import {
  AdventureActivityModel,
  type AdventureActivityDocument,
} from "@/server/models/adventure-activity.model";

export interface CreateAdventureActivityInput {
  name: string;
  label: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateAdventureActivityInput {
  name?: string;
  label?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}

export type DeleteAdventureActivityResult =
  | { ok: true }
  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export type UpdateAdventureActivityResult =
  | { ok: true; activity: AdventureActivityDocument }
  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function listPublicAdventureActivities(): Promise<
  AdventureActivityDocument[]
> {
  await connectToDatabase();

  const docs = await AdventureActivityModel.find({ isActive: true })
	    .sort({ createdAt: 1 })
    .lean()
    .exec();

  return docs as AdventureActivityDocument[];
}

export async function listAllAdventureActivities(): Promise<
  AdventureActivityDocument[]
> {
  await connectToDatabase();

  const docs = await AdventureActivityModel.find()
	    .sort({ createdAt: 1 })
    .lean()
    .exec();

  return docs as AdventureActivityDocument[];
}

export async function createAdventureActivity(
  input: CreateAdventureActivityInput,
): Promise<AdventureActivityDocument> {
  await connectToDatabase();

  const created = await AdventureActivityModel.create({
    name: input.name,
    label: input.label,
    imageUrl: input.imageUrl,
    order: input.order ?? 0,
    isActive: input.isActive ?? true,
  });

  return created.toObject() as AdventureActivityDocument;
}

export async function deleteAdventureActivityById(
  id: string,
): Promise<DeleteAdventureActivityResult> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return { ok: false, reason: "INVALID_ID" } as const;
  }

  const deleted = await AdventureActivityModel.findByIdAndDelete(id).exec();

  if (!deleted) {
    return { ok: false, reason: "NOT_FOUND" } as const;
  }

  return { ok: true } as const;
}

export async function updateAdventureActivityById(
  id: string,
  input: UpdateAdventureActivityInput,
): Promise<UpdateAdventureActivityResult> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return { ok: false, reason: "INVALID_ID" };
  }

  const updateData: Record<string, unknown> = {};

  if (input.name !== undefined) updateData.name = input.name;
  if (input.label !== undefined) updateData.label = input.label;
  if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
  if (input.order !== undefined) updateData.order = input.order;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;

  const updated = await AdventureActivityModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true },
  )
    .lean()
    .exec();

  if (!updated) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  return { ok: true, activity: updated as AdventureActivityDocument };
}

