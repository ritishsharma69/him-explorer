import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
	createReview,
	listAllReviews,
} from "@/server/services/review.service";

const createReviewSchema = z.object({
	fullName: z.string().min(1),
	location: z.string().min(1).optional(),
	rating: z.number().min(1).max(5),
	comment: z.string().min(1),
	isFeatured: z.boolean().optional(),
	status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export async function GET() {
	const reviews = await listAllReviews();

	return NextResponse.json({ reviews });
}

export async function POST(request: NextRequest) {
	const json = await request.json();
	const parsed = createReviewSchema.safeParse(json);

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

	const review = await createReview({
		fullName: payload.fullName.trim(),
		location: payload.location?.trim() || undefined,
		rating: payload.rating,
		comment: payload.comment.trim(),
		isFeatured: payload.isFeatured,
		status: payload.status,
	});

	return NextResponse.json({ review }, { status: 201 });
}
