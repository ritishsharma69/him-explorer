import { Types } from "mongoose";

import { connectToDatabase } from "@/server/db";
import { PackageModel, type PackageDocument } from "@/server/models/package.model";

export interface CreatePackageInput {
  slug: string;
  title: string;
  subtitle?: string;
  destinationName: string;
  durationDays: number;
  startingPricePerPerson: number;
  currencyCode: string;
  shortDescription: string;
  detailedDescription?: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: PackageDocument["itinerary"];
  heroImageUrl: string;
  galleryImageUrls?: string[];
  isFeatured?: boolean;
  status?: PackageDocument["status"];
}

export type UpdatePackageInput = Partial<CreatePackageInput>;

export async function listPublishedPackages(): Promise<PackageDocument[]> {
  await connectToDatabase();

  const docs = await PackageModel.find({ status: "published" })
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean()
    .exec();

  return docs as PackageDocument[];
}

export async function listAllPackages(): Promise<PackageDocument[]> {
  await connectToDatabase();

  const docs = await PackageModel.find()
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return docs as PackageDocument[];
}

export type DeletePackageResult =
  | { ok: true }
  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" };

export async function deletePackageById(id: string): Promise<DeletePackageResult> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return { ok: false, reason: "INVALID_ID" };
  }

  const deleted = await PackageModel.findByIdAndDelete(id).exec();

  if (!deleted) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  return { ok: true };
}

export async function getPublishedPackageBySlug(
  slug: string,
): Promise<PackageDocument | null> {
  await connectToDatabase();

  const pkg = await PackageModel.findOne({ slug, status: "published" })
    .lean()
    .exec();

  return (pkg as PackageDocument | null) ?? null;
}

export async function createPackage(
  input: CreatePackageInput,
): Promise<PackageDocument> {
  await connectToDatabase();

  const existing = await PackageModel.findOne({ slug: input.slug }).exec();
  if (existing) {
    throw new Error("PACKAGE_SLUG_EXISTS");
  }

  const created = await PackageModel.create({
    ...input,
    highlights: input.highlights ?? [],
    inclusions: input.inclusions ?? [],
    exclusions: input.exclusions ?? [],
    itinerary: input.itinerary ?? [],
    galleryImageUrls: input.galleryImageUrls ?? [],
    status: input.status ?? "draft",
  });

  return created.toObject() as PackageDocument;
}

export type UpdatePackageResult =
  | { ok: true; package: PackageDocument }
  | { ok: false; reason: "INVALID_ID" | "NOT_FOUND" | "SLUG_EXISTS" };

export async function getPackageById(
  id: string,
): Promise<PackageDocument | null> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const pkg = await PackageModel.findById(id).lean().exec();

  return (pkg as PackageDocument | null) ?? null;
}

export async function updatePackageById(
  id: string,
  input: UpdatePackageInput,
): Promise<UpdatePackageResult> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return { ok: false, reason: "INVALID_ID" };
  }

  // If slug is being changed/updated, ensure uniqueness.
  if (input.slug !== undefined) {
    const existingWithSlug = await PackageModel.findOne({
      _id: { $ne: id },
      slug: input.slug,
    })
      .select({ _id: 1 })
      .lean()
      .exec();

    if (existingWithSlug) {
      return { ok: false, reason: "SLUG_EXISTS" };
    }
  }

		  const updateData: UpdatePackageInput = {};

		  const entries = Object.entries(input) as [
		    keyof UpdatePackageInput,
		    UpdatePackageInput[keyof UpdatePackageInput],
		  ][];

		  for (const [key, value] of entries) {
		    if (value !== undefined) {
		      (updateData as Record<string, unknown>)[key as string] = value;
		    }
		  }

  const updated = await PackageModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec();

  if (!updated) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  return { ok: true, package: updated as PackageDocument };
}
