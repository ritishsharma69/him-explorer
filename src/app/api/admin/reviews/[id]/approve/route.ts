import { NextResponse, type NextRequest } from "next/server";

import { approveReview } from "@/server/services/review.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

	  const result = await approveReview(id);

	  if (!result.ok) {
	    if (result.reason === "INVALID_ID") {
	      return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
	    }

	    return NextResponse.json({ error: "Review not found" }, { status: 404 });
	  }

	  return NextResponse.json({ review: result.review });
}
