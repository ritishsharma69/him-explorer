import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  createHomeCollection,
  listAllHomeCollections,
} from "@/server/services/home-collection.service";

const createHomeCollectionSchema = z.object({
  category: z.enum(["top", "offbeat"]),
  badge: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  imageUrl: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const items = await listAllHomeCollections();

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = createHomeCollectionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid home collection data",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const created = await createHomeCollection(parsed.data);

  return NextResponse.json({ item: created }, { status: 201 });
}

