import { NextResponse } from "next/server";

import { listApprovedReviews } from "@/server/services/review.service";

export async function GET() {
	  const reviews = await listApprovedReviews();

	  return NextResponse.json({ reviews });
}
