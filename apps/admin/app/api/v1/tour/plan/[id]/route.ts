import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeTour } from "@iconic/db/serialize";
import {
  admin,
  unauthorized,
  badRequest,
  notFound,
  tourDataFromPayload,
  tourInclude,
} from "../../../_lib/helpers";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const tour = await prisma.tour.findUnique({
    where: { id: Number(id) },
    include: tourInclude,
  });
  if (!tour) return notFound();
  return NextResponse.json(serializeTour(tour));
}

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.tour.findUnique({ where: { id: Number(id) } });
  if (!existing) return notFound();

  const payload = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const data = tourDataFromPayload(payload);
  if (Array.isArray(payload.image_ids)) {
    data.images = {
      set: (payload.image_ids as number[])
        .map(Number)
        .filter(Number.isFinite)
        .map((imgId) => ({ id: imgId })),
    };
  }
  if (Array.isArray(payload.location_ids)) {
    data.locations = {
      set: (payload.location_ids as number[])
        .map(Number)
        .filter(Number.isFinite)
        .map((locId) => ({ id: locId })),
    };
  }

  const tour = await prisma.tour.update({
    where: { id: existing.id },
    data,
    include: tourInclude,
  });
  return NextResponse.json(serializeTour(tour));
}

export async function DELETE(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.tour.findUnique({ where: { id: Number(id) } });
  if (!existing) return notFound();

  try {
    await prisma.tour.delete({ where: { id: existing.id } });
  } catch {
    return badRequest({
      detail: "This tour cannot be deleted because bookings reference it.",
    });
  }
  return new NextResponse(null, { status: 204 });
}
