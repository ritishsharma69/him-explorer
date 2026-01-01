import { Types } from "mongoose";

import { connectToDatabase } from "@/server/db";
import {
  ReviewModel,
  type ReviewDocument,
  type ReviewStatus,
} from "@/server/models/review.model";

export async function listApprovedReviews(): Promise<ReviewDocument[]> {
  await connectToDatabase();

  const docs = await ReviewModel.find({ status: "approved" })
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean()
    .exec();

  return docs as ReviewDocument[];
}

export async function listAllReviews(): Promise<ReviewDocument[]> {
  await connectToDatabase();

  const docs = await ReviewModel.find()
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return docs as ReviewDocument[];
}

export interface CreateReviewInput {
	fullName: string;
	location?: string;
	rating: number;
	comment: string;
	isFeatured?: boolean;
	status?: ReviewStatus;
}

export async function createReview(
	input: CreateReviewInput,
): Promise<ReviewDocument> {
	await connectToDatabase();

	const created = await ReviewModel.create({
		fullName: input.fullName,
		location: input.location,
		rating: input.rating,
		comment: input.comment,
		isFeatured: input.isFeatured ?? false,
		status: input.status ?? "pending",
	});

	return created.toObject() as ReviewDocument;
}

export type ApproveReviewResult =
  | { ok: true; review: ReviewDocument }
  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function approveReview(id: string): Promise<ApproveReviewResult> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return { ok: false, reason: "INVALID_ID" };
  }

  const updated = await ReviewModel.findByIdAndUpdate(
    id,
    { status: "approved" },
    { new: true },
  )
    .lean()
    .exec();

  if (!updated) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  return { ok: true, review: updated as ReviewDocument };
}

export interface UpdateReviewInput {
	fullName?: string;
	location?: string;
	rating?: number;
	comment?: string;
	isFeatured?: boolean;
	status?: ReviewStatus;
}

export type UpdateReviewResult =
	| { ok: true; review: ReviewDocument }
	| { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function updateReviewById(
	id: string,
	input: UpdateReviewInput,
): Promise<UpdateReviewResult> {
	await connectToDatabase();

	if (!Types.ObjectId.isValid(id)) {
		return { ok: false, reason: "INVALID_ID" };
	}

	const updateData: Record<string, unknown> = {};

	if (input.fullName !== undefined) updateData.fullName = input.fullName;
	if (input.location !== undefined) updateData.location = input.location;
	if (input.rating !== undefined) updateData.rating = input.rating;
	if (input.comment !== undefined) updateData.comment = input.comment;
	if (input.isFeatured !== undefined)
		updateData.isFeatured = input.isFeatured;
	if (input.status !== undefined) updateData.status = input.status;

	const updated = await ReviewModel.findByIdAndUpdate(id, updateData, {
		new: true,
		runValidators: true,
	})
		.lean()
		.exec();

	if (!updated) {
		return { ok: false, reason: "NOT_FOUND" };
	}

	return { ok: true, review: updated as ReviewDocument };
}

export type DeleteReviewResult =
	  | { ok: true }
	  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function deleteReviewById(id: string): Promise<DeleteReviewResult> {
	  await connectToDatabase();

	  if (!Types.ObjectId.isValid(id)) {
	    return { ok: false, reason: "INVALID_ID" } as const;
	  }

	  const deleted = await ReviewModel.findByIdAndDelete(id).exec();

	  if (!deleted) {
	    return { ok: false, reason: "NOT_FOUND" } as const;
	  }

	  return { ok: true } as const;
}

