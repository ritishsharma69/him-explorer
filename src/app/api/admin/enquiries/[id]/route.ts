import { NextResponse, type NextRequest } from "next/server";

import { deleteEnquiryById } from "@/server/services/enquiry.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

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

