import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
	  deleteReviewById,
	  updateReviewById,
} from "@/server/services/review.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateReviewSchema = z.object({
  fullName: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(1).optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const json = await request.json();
  const parsed = updateReviewSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid review data",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  const result = await updateReviewById(id, {
    fullName: payload.fullName?.trim(),
    location: payload.location?.trim(),
    rating: payload.rating,
    comment: payload.comment?.trim(),
    isFeatured: payload.isFeatured,
    status: payload.status,
  });

  if (!result.ok) {
    if (result.reason === "INVALID_ID") {
      return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
    }

    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({ review: result.review });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
	  const { id } = await context.params;

	  const result = await deleteReviewById(id);

	  if (!result.ok) {
	    if (result.reason === "INVALID_ID") {
	      return NextResponse.json(
	        { error: "Invalid review id" },
	        { status: 400 },
	      );
	    }

	    return NextResponse.json(
	      { error: "Review not found" },
	      { status: 404 },
	    );
	  }

	  return NextResponse.json({ ok: true });
}

