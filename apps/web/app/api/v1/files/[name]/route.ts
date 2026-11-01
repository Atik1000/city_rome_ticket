import path from "path";
import fs from "fs";
import { uploadsDir } from "@iconic/db";
import { notFound } from "../../_lib/helpers";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
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

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(decoded).toLowerCase();
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
