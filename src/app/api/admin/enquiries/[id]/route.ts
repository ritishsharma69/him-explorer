import { NextResponse, type NextRequest } from "next/server";

import {
	deleteEnquiryById,
	updateEnquiryStatus,
} from "@/server/services/enquiry.service";
import type { EnquiryStatus } from "@/server/models/enquiry.model";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const ALLOWED_STATUS: EnquiryStatus[] = [
	"new",
	"contacted",
	"in_progress",
	"closed",
];

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const result = await deleteEnquiryById(id);

  if (!result.ok) {
    if (result.reason === "INVALID_ID") {
      return NextResponse.json(
        { error: "Invalid enquiry id" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Enquiry not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
	const { id } = await context.params;

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "Invalid JSON body" },
			{ status: 400 },
		);
	}

	const { status } = body as { status?: EnquiryStatus };

	if (!status || !ALLOWED_STATUS.includes(status)) {
		return NextResponse.json(
			{ error: "Invalid status value" },
			{ status: 400 },
		);
	}

	const result = await updateEnquiryStatus(id, status);

	if (!result.ok) {
		if (result.reason === "INVALID_ID") {
			return NextResponse.json(
				{ error: "Invalid enquiry id" },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Enquiry not found" },
			{ status: 404 },
		);
	}

	return NextResponse.json({ ok: true, enquiry: result.enquiry });
}

