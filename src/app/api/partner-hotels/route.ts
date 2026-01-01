import { NextResponse } from "next/server";

import { listPublicPartnerHotels } from "@/server/services/partner-hotel.service";

export async function GET() {
  const hotels = await listPublicPartnerHotels();

  return NextResponse.json({ hotels });
}

