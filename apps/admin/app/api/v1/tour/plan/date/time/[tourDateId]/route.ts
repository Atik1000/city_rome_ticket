import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeTimeSlot, paginated } from "@iconic/db/serialize";
import { admin, unauthorized, badRequest, notFound } from "../../../../../_lib/helpers";

type Ctx = { params: Promise<{ tourDateId: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { tourDateId } = await params;
  const where = { tourDateId: Number(tourDateId) };

  const [count, slots] = await Promise.all([
    prisma.timeSlot.count({ where }),
    prisma.timeSlot.findMany({
      where,
      include: { tourDate: true },
      orderBy: { startTime: "asc" },
      take: 1000,
    }),
  ]);

  return NextResponse.json(
    paginated(slots.map(serializeTimeSlot), count, 1, 1000)
  );
}

export async function POST(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { tourDateId } = await params;
  const tourDate = await prisma.tourDate.findUnique({
    where: { id: Number(tourDateId) },
  });
  if (!tourDate) return notFound("Tour date not found.");

  const payload = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const startTime = String(payload.start_time || "").trim();
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(startTime)) {
    return badRequest({ start_time: ["Enter a valid time in HH:MM format."] });
  }

  const int = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;
  };

  const slot = await prisma.timeSlot.create({
    data: {
      tourDateId: tourDate.id,
      startTime: startTime.slice(0, 5),
      endTime: typeof payload.end_time === "string" ? payload.end_time : null,
      availableAdults: int(payload.available_adults),
      availableChildren: int(payload.available_children),
      availableInfants: int(payload.available_infants),
      availableYouth: int(payload.available_youth),
      availableStudentEu: int(payload.available_student_eu),
    },
    include: { tourDate: true },
  });

  return NextResponse.json(serializeTimeSlot(slot), { status: 201 });
}
