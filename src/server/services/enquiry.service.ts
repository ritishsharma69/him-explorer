import { Types } from "mongoose";

import { connectToDatabase } from "@/server/db";
import {
	EnquiryModel,
	type EnquiryDocument,
	type EnquiryStatus,
} from "@/server/models/enquiry.model";

export interface CreateEnquiryInput {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  packageId?: string;
  preferredStartDate?: Date;
  numberOfAdults: number;
  numberOfChildren: number;
  budgetPerPersonMin?: number;
  message: string;
  howDidYouHear?: string;
}

export async function createEnquiry(
  input: CreateEnquiryInput,
): Promise<EnquiryDocument> {
  await connectToDatabase();

  const created = await EnquiryModel.create({
    fullName: input.fullName,
    email: input.email,
    phoneCountryCode: input.phoneCountryCode,
    phoneNumber: input.phoneNumber,
    package: input.packageId,
    preferredStartDate: input.preferredStartDate,
    numberOfAdults: input.numberOfAdults,
    numberOfChildren: input.numberOfChildren,
    budgetPerPersonMin: input.budgetPerPersonMin,
    message: input.message,
    howDidYouHear: input.howDidYouHear,
  });

  return created.toObject() as EnquiryDocument;
}

export async function listEnquiries(): Promise<EnquiryDocument[]> {
  await connectToDatabase();

  const docs = await EnquiryModel.find()
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return docs as EnquiryDocument[];
}

export type DeleteEnquiryResult =
	  | { ok: true }
	  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function deleteEnquiryById(id: string): Promise<DeleteEnquiryResult> {
	  await connectToDatabase();

	  if (!Types.ObjectId.isValid(id)) {
	    return { ok: false, reason: "INVALID_ID" } as const;
	  }

	  const deleted = await EnquiryModel.findByIdAndDelete(id).exec();

	  if (!deleted) {
	    return { ok: false, reason: "NOT_FOUND" } as const;
	  }

	  return { ok: true } as const;
}

export type UpdateEnquiryStatusResult =
	  | { ok: true; enquiry: EnquiryDocument }
	  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function updateEnquiryStatus(
	id: string,
	status: EnquiryStatus,
): Promise<UpdateEnquiryStatusResult> {
	await connectToDatabase();

	if (!Types.ObjectId.isValid(id)) {
		return { ok: false, reason: "INVALID_ID" } as const;
	}

	const updated = await EnquiryModel.findByIdAndUpdate(
		id,
		{ status },
		{ new: true },
	).exec();

	if (!updated) {
		return { ok: false, reason: "NOT_FOUND" } as const;
	}

	return { ok: true, enquiry: updated.toObject() as EnquiryDocument } as const;
}

