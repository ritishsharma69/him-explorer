import { NextResponse } from "next/server";

import { listAllPackages } from "@/server/services/package.service";

export async function GET() {
	  const packages = await listAllPackages();

	  return NextResponse.json({ packages });
}
