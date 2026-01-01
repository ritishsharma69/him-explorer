import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  deletePackageById,
  getPackageById,
  updatePackageById,
} from "@/server/services/package.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updatePackageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  destinationName: z.string().min(1),
  durationDays: z.number().int().min(1),
  startingPricePerPerson: z.number().min(0),
  currencyCode: z.string().min(3).max(3),
  shortDescription: z.string().min(1),
  detailedDescription: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  itinerary: z
    .array(
      z.object({
        dayNumber: z.number().int().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .optional(),
  heroImageUrl: z.string().url(),
  galleryImageUrls: z.array(z.string().url()).optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const pkg = await getPackageById(id);

  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({ package: pkg });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const json = await request.json();
  const parsed = updatePackageSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid package data",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  const result = await updatePackageById(id, payload);

  if (!result.ok) {
    if (result.reason === "INVALID_ID") {
      return NextResponse.json(
        { error: "Invalid package id" },
        { status: 400 },
      );
    }

    if (result.reason === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 },
      );
    }

    if (result.reason === "SLUG_EXISTS") {
      return NextResponse.json(
        { error: "A package with this slug already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 },
    );
  }

  return NextResponse.json({ package: result.package });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const result = await deletePackageById(id);

  if (!result.ok) {
    if (result.reason === "INVALID_ID") {
      return NextResponse.json({ error: "Invalid package id" }, { status: 400 });
    }

    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
