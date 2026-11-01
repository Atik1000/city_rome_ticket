import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeBooking, paginated } from "@iconic/db/serialize";
import {
  admin,
  unauthorized,
  badRequest,
  pageParam,
  bookingInclude,
  itemPrice,
} from "../../_lib/helpers";

const PAGE_SIZE = 20; // matches ITEMS_PER_PAGE on the bookings page

export async function GET(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const url = new URL(req.url);
  const page = pageParam(req);
  const search = (url.searchParams.get("search") || "").trim();
  const status = (url.searchParams.get("status") || "").trim();
  const createdFrom = (url.searchParams.get("created_at_from") || "").trim();
  const createdTo = (url.searchParams.get("created_at_to") || "").trim();

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    const or: Record<string, unknown>[] = [
      { fullName: { contains: search } },
      { email: { contains: search } },
    ];
    if (/^\d+$/.test(search)) or.push({ id: Number(search) });
    where.OR = or;
  }
  if (createdFrom || createdTo) {
    const range: Record<string, Date> = {};
    if (createdFrom) range.gte = new Date(`${createdFrom}T00:00:00`);
    if (createdTo) range.lte = new Date(`${createdTo}T23:59:59.999`);
    where.createdAt = range;
  }

  const [count, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      include: bookingInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return NextResponse.json(
    paginated(bookings.map(serializeBooking), count, page, PAGE_SIZE)
  );
}

interface SingleItemPayload {
  num_adults?: number;
  num_children?: number;
  num_infants?: number;
  num_youth?: number;
  num_student_eu?: number;
  tour_plan?: number;
  time_slot?: number;
}

export async function POST(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const payload = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const si = (payload.single_item || {}) as SingleItemPayload;
  if (!si.tour_plan || !si.time_slot) {
    return badRequest({
      single_item: ["tour_plan and time_slot are required."],
    });
  }

  const counts = {
    numAdults: Math.max(0, Number(si.num_adults) || 0),
    numChildren: Math.max(0, Number(si.num_children) || 0),
    numInfants: Math.max(0, Number(si.num_infants) || 0),
    numYouth: Math.max(0, Number(si.num_youth) || 0),
    numStudentEu: Math.max(0, Number(si.num_student_eu) || 0),
  };

  const [tour, slot] = await Promise.all([
    prisma.tour.findUnique({ where: { id: Number(si.tour_plan) } }),
    prisma.timeSlot.findUnique({ where: { id: Number(si.time_slot) } }),
  ]);
  if (!tour) return badRequest({ tour_plan: ["Tour plan not found."] });
  if (!slot) return badRequest({ time_slot: ["Time slot not found."] });

  const shortage: string[] = [];
  if (slot.availableAdults < counts.numAdults) shortage.push("adults");
  if (slot.availableChildren < counts.numChildren) shortage.push("children");
  if (slot.availableInfants < counts.numInfants) shortage.push("infants");
  if (slot.availableYouth < counts.numYouth) shortage.push("youth");
  if (slot.availableStudentEu < counts.numStudentEu) shortage.push("EU students");
  if (shortage.length) {
    return badRequest({
      time_slot: [`Not enough availability for: ${shortage.join(", ")}.`],
    });
  }

  const price = itemPrice(tour, counts);
  const travelers = Array.isArray(payload.traveler_details)
    ? payload.traveler_details
    : [];
  const status = typeof payload.status === "string" ? payload.status : "confirmed";

  const booking = await prisma.$transaction(async (tx) => {
    await tx.timeSlot.update({
      where: { id: slot.id },
      data: {
        availableAdults: { decrement: counts.numAdults },
        availableChildren: { decrement: counts.numChildren },
        availableInfants: { decrement: counts.numInfants },
        availableYouth: { decrement: counts.numYouth },
        availableStudentEu: { decrement: counts.numStudentEu },
      },
    });
    return tx.booking.create({
      data: {
        userType: "admin",
        totalPrice: price,
        travelerDetails: JSON.stringify(travelers),
        status,
        bookedByAdmin: true,
        fullName: typeof payload.full_name === "string" ? payload.full_name : null,
        email: typeof payload.email === "string" ? payload.email : null,
        country: typeof payload.country === "string" ? payload.country : null,
        phone: typeof payload.phone === "string" ? payload.phone : null,
        userId: user.id,
        items: {
          create: {
            ...counts,
            itemPrice: price,
            tourId: tour.id,
            timeSlotId: slot.id,
          },
        },
      },
      include: bookingInclude,
    });
  });

  return NextResponse.json(serializeBooking(booking), { status: 201 });
}
