import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  createPartnerHotel,
  listAllPartnerHotels,
} from "@/server/services/partner-hotel.service";

const createPartnerHotelSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  imageUrl: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const hotels = await listAllPartnerHotels();

  return NextResponse.json({ hotels });
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = createPartnerHotelSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid partner hotel data",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const created = await createPartnerHotel(parsed.data);

  return NextResponse.json({ hotel: created }, { status: 201 });
}

