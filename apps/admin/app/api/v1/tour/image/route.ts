import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { prisma, uploadsDir } from "@iconic/db";
import { admin, unauthorized, badRequest } from "../../_lib/helpers";

export async function POST(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return badRequest({ file: ["No file was submitted."] });
  }

  const original = path.basename(file.name || "upload");
  const ext = path.extname(original).toLowerCase() || ".jpg";
  const base = path
    .basename(original, path.extname(original))
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 60);
  const name = `${base}-${crypto.randomBytes(6).toString("hex")}${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(uploadsDir(), name), buffer);

  const image = await prisma.tourImage.create({
    data: { file: `/api/v1/files/${name}`, status: "active" },
  });

  return NextResponse.json(
    { id: image.id, file: image.file, status: image.status },
    { status: 201 }
  );
}
