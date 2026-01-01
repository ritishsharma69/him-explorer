import { NextResponse } from "next/server";

import { listPublicAdventureActivities } from "@/server/services/adventure-activity.service";

export async function GET() {
  const activities = await listPublicAdventureActivities();
  return NextResponse.json({ activities });
}

