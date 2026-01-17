import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  deletePopularDestinationById,
  updatePopularDestinationById,
} from "@/server/services/popular-destination.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updatePopularDestinationSchema = z.object({
  name: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  isActive: z.boolean().optional(),
});

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const result = await deletePopularDestinationById(id);

  if (!result.ok) {
    if (result.reason === "INVALID_ID") {
      return NextResponse.json(
        { error: "Invalid destination id" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Destination not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const json = await request.json();
  const parsed = updatePopularDestinationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid destination data",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  const result = await updatePopularDestinationById(id, {
    name: payload.name?.trim(),
    imageUrl: payload.imageUrl?.trim(),
    order: payload.order,
    size: payload.size,
    isActive: payload.isActive,
  });

  if (!result.ok) {
    if (result.reason === "INVALID_ID") {
      return NextResponse.json(
        { error: "Invalid destination id" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Destination not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ destination: result.destination });
}

