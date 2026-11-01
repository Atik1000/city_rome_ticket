import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { uploadsDir } from "@iconic/db";
import { notFound } from "../../_lib/helpers";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  if (decoded.includes("/") || decoded.includes("\\") || decoded.includes("..")) {
    return notFound();
  }

  const filePath = path.join(uploadsDir(), decoded);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return notFound();
  }

  const ext = path.extname(decoded).toLowerCase();
  const data = fs.readFileSync(filePath);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
