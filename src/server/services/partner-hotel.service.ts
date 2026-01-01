import { Types } from "mongoose";

import { connectToDatabase } from "@/server/db";
import {
	  PartnerHotelModel,
	  type PartnerHotelDocument,
	} from "@/server/models/partner-hotel.model";

export interface CreatePartnerHotelInput {
  name: string;
  label: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}

export type DeletePartnerHotelResult =
  | { ok: true }
  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function listPublicPartnerHotels(): Promise<
  PartnerHotelDocument[]
> {
  await connectToDatabase();

	  const docs = await PartnerHotelModel.find({ isActive: true })
	    .sort({ createdAt: 1 })
    .lean()
    .exec();

  return docs as PartnerHotelDocument[];
}

export async function listAllPartnerHotels(): Promise<
  PartnerHotelDocument[]
> {
  await connectToDatabase();

	  const docs = await PartnerHotelModel.find()
	    .sort({ createdAt: 1 })
    .lean()
    .exec();

  return docs as PartnerHotelDocument[];
}

export async function createPartnerHotel(
  input: CreatePartnerHotelInput,
): Promise<PartnerHotelDocument> {
  await connectToDatabase();

  const created = await PartnerHotelModel.create({
    name: input.name,
    label: input.label,
    imageUrl: input.imageUrl,
    order: input.order ?? 0,
    isActive: input.isActive ?? true,
  });

  return created.toObject() as PartnerHotelDocument;
}

export async function deletePartnerHotelById(
  id: string,
): Promise<DeletePartnerHotelResult> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return { ok: false, reason: "INVALID_ID" } as const;
  }

  const deleted = await PartnerHotelModel.findByIdAndDelete(id).exec();

  if (!deleted) {
    return { ok: false, reason: "NOT_FOUND" } as const;
  }

	  return { ok: true } as const;
	}

	export interface UpdatePartnerHotelInput {
		name?: string;
		label?: string;
		imageUrl?: string;
		order?: number;
		isActive?: boolean;
	}

	export type UpdatePartnerHotelResult =
		| { ok: true; hotel: PartnerHotelDocument }
		| { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

	export async function updatePartnerHotelById(
		id: string,
		input: UpdatePartnerHotelInput,
	): Promise<UpdatePartnerHotelResult> {
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

		const updated = await PartnerHotelModel.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		})
			.lean()
			.exec();

		if (!updated) {
			return { ok: false, reason: "NOT_FOUND" };
		}

		return { ok: true, hotel: updated as PartnerHotelDocument };
	}

	