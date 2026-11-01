import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeBookingItem } from "@iconic/db/serialize";
import {
  admin,
  unauthorized,
  badRequest,
  notFound,
  itemPrice,
} from "../../../../_lib/helpers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const item = await prisma.bookingItem.findUnique({
    where: { id: Number(id) },
    include: { tour: true, booking: true },
  });
  if (!item) return notFound();

  const payload = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const next = (key: string, current: number) =>
    payload[key] !== undefined ? Math.max(0, Number(payload[key]) || 0) : current;

  const newCounts = {
    numAdults: next("num_adults", item.numAdults),
    numChildren: next("num_children", item.numChildren),
    numInfants: next("num_infants", item.numInfants),
    numYouth: next("num_youth", item.numYouth),
    numStudentEu: next("num_student_eu", item.numStudentEu),
  };

  const price = itemPrice(item.tour, newCounts);

  const updated = await prisma.$transaction(async (tx) => {
    // Adjust the slot by the delta while the booking holds seats.
    if (item.booking.status !== "cancelled") {
      await tx.timeSlot.update({
        where: { id: item.timeSlotId },
        data: {
          availableAdults: { increment: item.numAdults - newCounts.numAdults },
          availableChildren: { increment: item.numChildren - newCounts.numChildren },
          availableInfants: { increment: item.numInfants - newCounts.numInfants },
          availableYouth: { increment: item.numYouth - newCounts.numYouth },
          availableStudentEu: { increment: item.numStudentEu - newCounts.numStudentEu },
        },
      });
    }

    const saved = await tx.bookingItem.update({
      where: { id: item.id },
      data: { ...newCounts, itemPrice: price },
      include: {
        tour: { include: { images: true, locations: true } },
        timeSlot: { include: { tourDate: true } },
      },
    });

    const items = await tx.bookingItem.findMany({
      where: { bookingId: item.bookingId },
    });
    await tx.booking.update({
      where: { id: item.bookingId },
      data: { totalPrice: items.reduce((sum, i) => sum + i.itemPrice, 0) },
    });

    return saved;
  });

  return NextResponse.json(serializeBookingItem(updated));
}
