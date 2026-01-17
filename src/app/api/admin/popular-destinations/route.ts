import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  createPopularDestination,
  listAllPopularDestinations,
} from "@/server/services/popular-destination.service";

const createPopularDestinationSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().min(1),
  order: z.number().int().min(0).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const destinations = await listAllPopularDestinations();

  return NextResponse.json({ destinations });
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = createPopularDestinationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid destination data",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const created = await createPopularDestination(parsed.data);

  return NextResponse.json({ destination: created }, { status: 201 });
}

