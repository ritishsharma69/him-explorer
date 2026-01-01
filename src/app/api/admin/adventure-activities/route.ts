import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  createAdventureActivity,
  listAllAdventureActivities,
} from "@/server/services/adventure-activity.service";

const createAdventureActivitySchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  imageUrl: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const activities = await listAllAdventureActivities();
  return NextResponse.json({ activities });
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = createAdventureActivitySchema.safeParse(json);

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

  const activity = await createAdventureActivity({
    name: payload.name.trim(),
    label: payload.label.trim(),
    imageUrl: payload.imageUrl?.trim(),
    order: payload.order,
    isActive: payload.isActive,
  });

  return NextResponse.json({ activity }, { status: 201 });
}

