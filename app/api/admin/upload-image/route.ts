import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, or WEBP images are allowed." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const safeExtension = (extension ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const fileName = `${Date.now()}-${randomUUID()}.${safeExtension}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const absolutePath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(absolutePath, buffer);

  return NextResponse.json({ imagePath: `/uploads/${fileName}` });
}
