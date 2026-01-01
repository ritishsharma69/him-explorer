import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { createEnquiry } from "@/server/services/enquiry.service";
import { sendEnquiryNotificationEmail } from "@/server/enquiry-email";

const createEnquirySchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phoneCountryCode: z.string().min(1).default("+91"),
  phoneNumber: z.string().min(5),
  packageId: z.string().optional(),
  preferredStartDate: z.string().datetime().optional(),
  numberOfAdults: z.number().int().min(1),
  numberOfChildren: z.number().int().min(0).default(0),
  budgetPerPersonMin: z.number().min(0).optional(),
  message: z.string().min(1),
  howDidYouHear: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = createEnquirySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid enquiry data",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

	  const payload = parsed.data;

	  const created = await createEnquiry({
	    fullName: payload.fullName,
	    email: payload.email,
	    phoneCountryCode: payload.phoneCountryCode,
	    phoneNumber: payload.phoneNumber,
	    packageId: payload.packageId,
	    preferredStartDate: payload.preferredStartDate
	      ? new Date(payload.preferredStartDate)
	      : undefined,
	    numberOfAdults: payload.numberOfAdults,
	    numberOfChildren: payload.numberOfChildren,
	    budgetPerPersonMin: payload.budgetPerPersonMin,
	    message: payload.message,
	    howDidYouHear: payload.howDidYouHear,
	  });

	  try {
	    await sendEnquiryNotificationEmail(created);
	  } catch (error) {
	    console.error("Failed to send enquiry notification email", error);
	  }

	  return NextResponse.json({ enquiry: created }, { status: 201 });
	}
