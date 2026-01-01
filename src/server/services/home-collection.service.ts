import { Types } from "mongoose";

import { connectToDatabase } from "@/server/db";
import {
	  HomeCollectionItemModel,
	  type HomeCollectionCategory,
	  type HomeCollectionItemDocument,
	} from "@/server/models/home-collection.model";

export interface CreateHomeCollectionInput {
  category: HomeCollectionCategory;
  badge: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateHomeCollectionInput {
	  category?: HomeCollectionCategory;
	  badge?: string;
	  title?: string;
	  subtitle?: string;
	  imageUrl?: string;
	  order?: number;
	  isActive?: boolean;
}

export type DeleteHomeCollectionResult =
	  | { ok: true }
	  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export type UpdateHomeCollectionResult =
	  | { ok: true; item: HomeCollectionItemDocument }
	  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function listPublicHomeCollections(): Promise<{
  topCollections: HomeCollectionItemDocument[];
  offbeatCollections: HomeCollectionItemDocument[];
}> {
  await connectToDatabase();

	  const docs = (await HomeCollectionItemModel.find({ isActive: true })
	    .sort({ category: 1, createdAt: 1 })
    .lean()
    .exec()) as HomeCollectionItemDocument[];

  return {
    topCollections: docs.filter((item) => item.category === "top"),
    offbeatCollections: docs.filter((item) => item.category === "offbeat"),
  };
}

export async function listAllHomeCollections(): Promise<
  HomeCollectionItemDocument[]
> {
  await connectToDatabase();

	  const docs = await HomeCollectionItemModel.find()
	    .sort({ category: 1, createdAt: 1 })
    .lean()
    .exec();

  return docs as HomeCollectionItemDocument[];
}

export async function createHomeCollection(
  input: CreateHomeCollectionInput,
): Promise<HomeCollectionItemDocument> {
  await connectToDatabase();

  const created = await HomeCollectionItemModel.create({
    category: input.category,
    badge: input.badge,
    title: input.title,
    subtitle: input.subtitle,
    imageUrl: input.imageUrl,
    order: input.order ?? 0,
    isActive: input.isActive ?? true,
  });

  return created.toObject() as HomeCollectionItemDocument;
}

export async function updateHomeCollectionById(
	  id: string,
	  input: UpdateHomeCollectionInput,
): Promise<UpdateHomeCollectionResult> {
	  await connectToDatabase();

	  if (!Types.ObjectId.isValid(id)) {
	    return { ok: false, reason: "INVALID_ID" } as const;
	  }

	  const updateData: Record<string, unknown> = {};

	  if (input.category !== undefined) updateData.category = input.category;
	  if (input.badge !== undefined) updateData.badge = input.badge;
	  if (input.title !== undefined) updateData.title = input.title;
	  if (input.subtitle !== undefined) updateData.subtitle = input.subtitle;
	  if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
	  if (input.order !== undefined) updateData.order = input.order;
	  if (input.isActive !== undefined) updateData.isActive = input.isActive;

	  const updated = await HomeCollectionItemModel.findByIdAndUpdate(
	    id,
	    updateData,
	    {
	      new: true,
	      runValidators: true,
	    },
	  )
	    .lean()
	    .exec();

	  if (!updated) {
	    return { ok: false, reason: "NOT_FOUND" } as const;
	  }

	  return { ok: true, item: updated as HomeCollectionItemDocument } as const;
	}

export async function deleteHomeCollectionById(
  id: string,
): Promise<DeleteHomeCollectionResult> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return { ok: false, reason: "INVALID_ID" } as const;
  }

  const deleted = await HomeCollectionItemModel.findByIdAndDelete(id).exec();

  if (!deleted) {
    return { ok: false, reason: "NOT_FOUND" } as const;
  }

  return { ok: true } as const;
}

