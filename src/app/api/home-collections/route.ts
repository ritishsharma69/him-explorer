import { NextResponse } from "next/server";

import { listPublicHomeCollections } from "@/server/services/home-collection.service";

export async function GET() {
  const data = await listPublicHomeCollections();

  return NextResponse.json(data);
}

