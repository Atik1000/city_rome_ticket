import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { prisma, uploadsDir } from "@iconic/db";
import { admin, unauthorized, notFound } from "../../../_lib/helpers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const image = await prisma.tourImage.findUnique({ where: { id: Number(id) } });
  if (!image) return notFound();

  await prisma.tourImage.delete({ where: { id: image.id } });

  // Remove the file from disk when it lives in our uploads directory.
  const prefix = "/api/v1/files/";
  if (image.file.startsWith(prefix)) {
    const name = image.file.slice(prefix.length);
    if (name && !name.includes("/") && !name.includes("..")) {
      const filePath = path.join(uploadsDir(), name);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {}
      }
    }
  }

  return new NextResponse(null, { status: 204 });
}
