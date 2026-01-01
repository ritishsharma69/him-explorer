import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  createPackage,
  listPublishedPackages,
} from "@/server/services/package.service";

const createPackageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  destinationName: z.string().min(1),
  durationDays: z.number().int().min(1),
  startingPricePerPerson: z.number().min(0),
  currencyCode: z.string().min(3).max(3).default("INR"),
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
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET() {
	  const packages = await listPublishedPackages();

	  return NextResponse.json({ packages });
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = createPackageSchema.safeParse(json);

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

	  try {
	    const created = await createPackage(payload);

	    return NextResponse.json({ package: created }, { status: 201 });
	  } catch (error) {
	    if (error instanceof Error && error.message === "PACKAGE_SLUG_EXISTS") {
	      return NextResponse.json(
	        { error: "A package with this slug already exists." },
	        { status: 409 },
	      );
	    }

	    throw error;
	  }
}
