import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
	deletePartnerHotelById,
	updatePartnerHotelById,
} from "@/server/services/partner-hotel.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updatePartnerHotelSchema = z.object({
	name: z.string().min(1).optional(),
	label: z.string().min(1).optional(),
	imageUrl: z.string().min(1).optional(),
	order: z.number().int().min(0).optional(),
	isActive: z.boolean().optional(),
});

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const result = await deletePartnerHotelById(id);

  if (!result.ok) {
    if (result.reason === "INVALID_ID") {
      return NextResponse.json(
        { error: "Invalid partner hotel id" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Partner hotel not found" },
      { status: 404 },
    );
  }

	  return NextResponse.json({ ok: true });
	}

	export async function PATCH(request: NextRequest, context: RouteContext) {
		const { id } = await context.params;

		const json = await request.json();
		const parsed = updatePartnerHotelSchema.safeParse(json);

		if (!parsed.success) {
			return NextResponse.json(
				{
					error: "Invalid partner hotel data",
					details: parsed.error.flatten(),
				},
				{ status: 400 },
			);
		}

		const payload = parsed.data;

		const result = await updatePartnerHotelById(id, {
			name: payload.name?.trim(),
			label: payload.label?.trim(),
			imageUrl: payload.imageUrl?.trim(),
			order: payload.order,
			isActive: payload.isActive,
		});

		if (!result.ok) {
			if (result.reason === "INVALID_ID") {
				return NextResponse.json(
					{ error: "Invalid partner hotel id" },
					{ status: 400 },
				);
			}

			return NextResponse.json(
				{ error: "Partner hotel not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({ hotel: result.hotel });
	}

	