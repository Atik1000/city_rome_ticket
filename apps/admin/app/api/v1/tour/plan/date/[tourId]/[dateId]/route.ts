import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { admin, unauthorized, notFound, badRequest } from "../../../../../_lib/helpers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ tourId: string; dateId: string }> }
) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { tourId, dateId } = await params;
  const date = await prisma.tourDate.findUnique({ where: { id: Number(dateId) } });
  if (!date || date.tourId !== Number(tourId)) return notFound();

  try {
    await prisma.tourDate.delete({ where: { id: date.id } });
  } catch {
    return badRequest({
      detail: "This date cannot be deleted because bookings reference its time slots.",
    });
  }
  return new NextResponse(null, { status: 204 });
}
