import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeTimeSlot } from "@iconic/db/serialize";
import { admin, unauthorized, badRequest, notFound } from "../../../../../../_lib/helpers";

type Ctx = { params: Promise<{ tourDateId: string; timeId: string }> };

async function findSlot(tourDateId: string, timeId: string) {
  const slot = await prisma.timeSlot.findUnique({
    where: { id: Number(timeId) },
  });
  if (!slot || slot.tourDateId !== Number(tourDateId)) return null;
  return slot;
}

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { tourDateId, timeId } = await params;
  const slot = await findSlot(tourDateId, timeId);
  if (!slot) return notFound();

  const payload = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const data: Record<string, unknown> = {};
  if (typeof payload.start_time === "string") {
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(payload.start_time)) {
      return badRequest({ start_time: ["Enter a valid time in HH:MM format."] });
    }
    data.startTime = payload.start_time.slice(0, 5);
  }
  if ("end_time" in payload) {
    data.endTime = typeof payload.end_time === "string" ? payload.end_time : null;
  }
  const int = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : undefined;
  };
  const counts: Record<string, string> = {
    available_adults: "availableAdults",
    available_children: "availableChildren",
    available_infants: "availableInfants",
    available_youth: "availableYouth",
    available_student_eu: "availableStudentEu",
  };
  for (const [key, field] of Object.entries(counts)) {
    if (key in payload) {
      const v = int(payload[key]);
      if (v !== undefined) data[field] = v;
    }
  }
  if (typeof payload.is_active === "boolean") data.isActive = payload.is_active;

  const updated = await prisma.timeSlot.update({
    where: { id: slot.id },
    data,
    include: { tourDate: true },
  });
  return NextResponse.json(serializeTimeSlot(updated));
}

export async function DELETE(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { tourDateId, timeId } = await params;
  const slot = await findSlot(tourDateId, timeId);
  if (!slot) return notFound();

  try {
    await prisma.timeSlot.delete({ where: { id: slot.id } });
  } catch {
    return badRequest({
      detail: "This time slot cannot be deleted because bookings reference it.",
    });
  }
  return new NextResponse(null, { status: 204 });
}
