import { NextResponse } from "next/server";

import { listAllConversations } from "@/server/services/chat.service";

export async function GET() {
  const conversations = await listAllConversations();

  return NextResponse.json({ conversations });
}

