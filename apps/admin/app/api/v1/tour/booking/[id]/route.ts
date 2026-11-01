import { NextResponse } from "next/server";
import { prisma, type Prisma } from "@iconic/db";
import { serializeBooking } from "@iconic/db/serialize";
import {
  admin,
  unauthorized,
  badRequest,
  notFound,
  bookingInclude,
  itemPrice,
} from "../../../_lib/helpers";

type Ctx = { params: Promise<{ id: string }> };
type Tx = Prisma.TransactionClient;

const slotAdjust = (
  counts: {
    numAdults: number;
    numChildren: number;
    numInfants: number;
    numYouth: number;
    numStudentEu: number;
  },
  direction: 1 | -1
) => ({
  availableAdults: { increment: direction * counts.numAdults },
  availableChildren: { increment: direction * counts.numChildren },
  availableInfants: { increment: direction * counts.numInfants },
  availableYouth: { increment: direction * counts.numYouth },
  availableStudentEu: { increment: direction * counts.numStudentEu },
});

async function adjustAllSlots(tx: Tx, bookingId: number, direction: 1 | -1) {
  const items = await tx.bookingItem.findMany({ where: { bookingId } });
  for (const item of items) {
    await tx.timeSlot.update({
      where: { id: item.timeSlotId },
      data: slotAdjust(item, direction),
    });
  }
}

export async function GET(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: bookingInclude,
  });
  if (!booking) return notFound();
  return NextResponse.json(serializeBooking(booking));
}

interface ItemPatch {
  id?: number;
  time_slot?: number | { id?: number };
  num_adults?: number;
  num_children?: number;
  num_infants?: number;
  num_youth?: number;
  num_student_eu?: number;
}

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: { items: { include: { tour: true } } },
  });
  if (!booking) return notFound();

  const payload = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const data: Record<string, unknown> = {};
  if (typeof payload.status === "string") data.status = payload.status;
  if ("cancelled_reason" in payload) {
    data.cancelledReason =
      typeof payload.cancelled_reason === "string" ? payload.cancelled_reason : null;
  }
  if (Array.isArray(payload.traveler_details)) {
    data.travelerDetails = JSON.stringify(payload.traveler_details);
  }
  if (typeof payload.full_name === "string") data.fullName = payload.full_name;
  if (typeof payload.email === "string") data.email = payload.email;
  if (typeof payload.country === "string") data.country = payload.country;
  if (typeof payload.phone === "string") data.phone = payload.phone;

  const newStatus = typeof payload.status === "string" ? payload.status : booking.status;
  const becameCancelled = booking.status !== "cancelled" && newStatus === "cancelled";
  const becameActive = booking.status === "cancelled" && newStatus !== "cancelled";

  const itemPatches: ItemPatch[] = Array.isArray(payload.items)
    ? (payload.items as ItemPatch[])
    : [];

  const updated = await prisma.$transaction(async (tx) => {
    // Apply item changes (time slot moves and count changes) first, so that
    // availability math and totals use the final state.
    for (const patch of itemPatches) {
      if (!patch.id) continue;
      const item = booking.items.find((i) => i.id === Number(patch.id));
      if (!item) continue;

      const newCounts = {
        numAdults: patch.num_adults !== undefined ? Math.max(0, Number(patch.num_adults) || 0) : item.numAdults,
        numChildren: patch.num_children !== undefined ? Math.max(0, Number(patch.num_children) || 0) : item.numChildren,
        numInfants: patch.num_infants !== undefined ? Math.max(0, Number(patch.num_infants) || 0) : item.numInfants,
        numYouth: patch.num_youth !== undefined ? Math.max(0, Number(patch.num_youth) || 0) : item.numYouth,
        numStudentEu: patch.num_student_eu !== undefined ? Math.max(0, Number(patch.num_student_eu) || 0) : item.numStudentEu,
      };
      const rawSlot = patch.time_slot;
      const newSlotId =
        typeof rawSlot === "number"
          ? rawSlot
          : typeof rawSlot === "object" && rawSlot?.id
            ? Number(rawSlot.id)
            : item.timeSlotId;

      const changedSlot = newSlotId !== item.timeSlotId;
      const changedCounts =
        newCounts.numAdults !== item.numAdults ||
        newCounts.numChildren !== item.numChildren ||
        newCounts.numInfants !== item.numInfants ||
        newCounts.numYouth !== item.numYouth ||
        newCounts.numStudentEu !== item.numStudentEu;
      if (!changedSlot && !changedCounts) continue;

      // Only adjust availability while the booking actually holds seats.
      if (booking.status !== "cancelled") {
        await tx.timeSlot.update({
          where: { id: item.timeSlotId },
          data: slotAdjust(item, 1),
        });
        await tx.timeSlot.update({
          where: { id: newSlotId },
          data: slotAdjust(newCounts, -1),
        });
      }

      await tx.bookingItem.update({
        where: { id: item.id },
        data: {
          ...newCounts,
          timeSlotId: newSlotId,
          itemPrice: itemPrice(item.tour, newCounts),
        },
      });
    }

    if (itemPatches.length) {
      const items = await tx.bookingItem.findMany({
        where: { bookingId: booking.id },
      });
      data.totalPrice = items.reduce((sum, i) => sum + i.itemPrice, 0);
    }

    if (becameCancelled) await adjustAllSlots(tx, booking.id, 1);
    if (becameActive) await adjustAllSlots(tx, booking.id, -1);

    return tx.booking.update({
      where: { id: booking.id },
      data,
      include: bookingInclude,
    });
  });

  return NextResponse.json(serializeBooking(updated));
}

export async function DELETE(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });
  if (!booking) return notFound();

  await prisma.$transaction(async (tx) => {
    // Deleting an active booking releases its seats.
    if (booking.status !== "cancelled") {
      await adjustAllSlots(tx, booking.id, 1);
    }
    await tx.booking.delete({ where: { id: booking.id } });
  });

  return new NextResponse(null, { status: 204 });
}
