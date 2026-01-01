import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  deleteAdventureActivityById,
  updateAdventureActivityById,
} from "@/server/services/adventure-activity.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateAdventureActivitySchema = z.object({
  name: z.string().min(1).optional(),
  label: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const result = await deleteAdventureActivityById(id);

  if (!result.ok) {
    if (result.reason === "INVALID_ID") {
      return NextResponse.json(
        { error: "Invalid adventure activity id" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Adventure activity not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const json = await request.json();
  const parsed = updateAdventureActivitySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid adventure activity data",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  const result = await updateAdventureActivityById(id, {
    name: payload.name?.trim(),
    label: payload.label?.trim(),
    imageUrl: payload.imageUrl?.trim(),
    order: payload.order,
    isActive: payload.isActive,
  });

  if (!result.ok) {
    if (result.reason === "INVALID_ID") {
      return NextResponse.json(
        { error: "Invalid adventure activity id" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Adventure activity not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ activity: result.activity });
}

