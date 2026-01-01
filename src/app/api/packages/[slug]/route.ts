import { NextResponse, type NextRequest } from "next/server";

import { getPublishedPackageBySlug } from "@/server/services/package.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
	  const pkg = await getPublishedPackageBySlug(slug);

  if (!pkg) {
    return NextResponse.json(
      { error: "Package not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ package: pkg });
}
