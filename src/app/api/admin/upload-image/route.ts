import { NextResponse, type NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Simple image upload endpoint for admin panel.
// Saves files under public/uploads and returns a public URL.

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Basic 10 MB limit to avoid huge uploads.
  const maxSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return NextResponse.json(
      { error: "File too large. Max size is 10MB." },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const originalName = file.name || "upload";
  const extFromName = originalName.includes(".")
    ? originalName.split(".").pop() || "bin"
    : "bin";
  const safeExt = extFromName.slice(0, 8); // keep extension short/safe

  const fileName = `${Date.now()}-${randomUUID()}.${safeExt}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  const publicUrl = `/uploads/${fileName}`;

  return NextResponse.json({ url: publicUrl }, { status: 201 });
}

