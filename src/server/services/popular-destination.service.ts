import { Types } from "mongoose";

import { connectToDatabase } from "@/server/db";
import {
  PopularDestinationModel,
  type PopularDestinationDocument,
} from "@/server/models/popular-destination.model";

export interface CreatePopularDestinationInput {
  name: string;
  imageUrl: string;
  order?: number;
  size?: "small" | "medium" | "large";
  position?: string;
  isActive?: boolean;
}

export type DeletePopularDestinationResult =
  | { ok: true }
  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function listPublicPopularDestinations(): Promise<
  PopularDestinationDocument[]
> {
  await connectToDatabase();

  const docs = await PopularDestinationModel.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .lean()
    .exec();

  return docs as PopularDestinationDocument[];
}

export async function listAllPopularDestinations(): Promise<
  PopularDestinationDocument[]
> {
  await connectToDatabase();

  const docs = await PopularDestinationModel.find()
    .sort({ order: 1, createdAt: 1 })
    .lean()
    .exec();

  return docs as PopularDestinationDocument[];
}

export async function createPopularDestination(
  input: CreatePopularDestinationInput,
): Promise<PopularDestinationDocument> {
  await connectToDatabase();

  // If position is provided, delete any existing destination with same position first
  if (input.position) {
    await PopularDestinationModel.deleteMany({ position: input.position }).exec();
  }

  const created = await PopularDestinationModel.create({
    name: input.name,
    imageUrl: input.imageUrl,
    order: input.order ?? 0,
    size: input.size ?? "medium",
    position: input.position,
    isActive: input.isActive ?? true,
  });

  return created.toObject() as PopularDestinationDocument;
}

export async function deletePopularDestinationById(
  id: string,
): Promise<DeletePopularDestinationResult> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return { ok: false, reason: "INVALID_ID" } as const;
  }

  const deleted = await PopularDestinationModel.findByIdAndDelete(id).exec();

  if (!deleted) {
    return { ok: false, reason: "NOT_FOUND" } as const;
  }

  return { ok: true } as const;
}

export interface UpdatePopularDestinationInput {
  name?: string;
  imageUrl?: string;
  order?: number;
  size?: "small" | "medium" | "large";
  isActive?: boolean;
}

export type UpdatePopularDestinationResult =
  | { ok: true; destination: PopularDestinationDocument }
  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function updatePopularDestinationById(
  id: string,
  input: UpdatePopularDestinationInput,
): Promise<UpdatePopularDestinationResult> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return { ok: false, reason: "INVALID_ID" };
  }

  const updateData: Record<string, unknown> = {};

  if (input.name !== undefined) updateData.name = input.name;
  if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
  if (input.order !== undefined) updateData.order = input.order;
  if (input.size !== undefined) updateData.size = input.size;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;

  const updated = await PopularDestinationModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec();

  if (!updated) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  return { ok: true, destination: updated as PopularDestinationDocument };
}

