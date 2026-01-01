import { NextResponse } from "next/server";

import { listEnquiries } from "@/server/services/enquiry.service";

export async function GET() {
	  const enquiries = await listEnquiries();

	  return NextResponse.json({ enquiries });
}
