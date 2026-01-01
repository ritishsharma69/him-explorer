import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
	  deleteHomeCollectionById,
	  updateHomeCollectionById,
} from "@/server/services/home-collection.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateHomeCollectionSchema = z.object({
	  category: z.enum(["top", "offbeat"]).optional(),
	  badge: z.string().min(1).optional(),
	  title: z.string().min(1).optional(),
	  subtitle: z.string().min(1).optional(),
	  imageUrl: z.string().min(1).optional(),
	  order: z.number().int().min(0).optional(),
	  isActive: z.boolean().optional(),
});

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const result = await deleteHomeCollectionById(id);

  if (!result.ok) {
    if (result.reason === "INVALID_ID") {
      return NextResponse.json(
        { error: "Invalid collection id" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
	  const { id } = await context.params;

	  const json = await request.json();
	  const parsed = updateHomeCollectionSchema.safeParse(json);

	  if (!parsed.success) {
	    return NextResponse.json(
	      {
	        error: "Invalid home collection data",
	        details: parsed.error.flatten(),
	      },
	      { status: 400 },
	    );
	  }

	  const payload = parsed.data;

	  const result = await updateHomeCollectionById(id, {
	    category: payload.category,
	    badge: payload.badge?.trim(),
	    title: payload.title?.trim(),
	    subtitle: payload.subtitle?.trim(),
	    imageUrl: payload.imageUrl,
	    order: payload.order,
	    isActive: payload.isActive,
	  });

	  if (!result.ok) {
	    if (result.reason === "INVALID_ID") {
	      return NextResponse.json(
	        { error: "Invalid collection id" },
	        { status: 400 },
	      );
	    }

	    return NextResponse.json(
	      { error: "Collection not found" },
	      { status: 404 },
	    );
	  }

	  return NextResponse.json({ item: result.item });
}

