import { prisma } from "@iconic/db";
import { getAuthUser } from "@iconic/db/auth";
import { serializeBooking, paginated } from "@iconic/db/serialize";
import { json, computeItemPrice, toInt, type PartyCounts } from "../../_lib/helpers";

interface PendingItem extends Required<PartyCounts> {
  tourId: number;
  timeSlotId: number;
  cartItemId?: number;
}

const bookingInclude = {
  items: {
    include: {
      tour: { include: { images: { orderBy: { sortOrder: "asc" as const } }, locations: true } },
      timeSlot: { include: { tourDate: true } },
    },
  },
};

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return json({ detail: "Authentication credentials were not provided." }, 401);
  }
  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: bookingInclude,
    orderBy: { id: "desc" },
  });
  return json(paginated(bookings.map(serializeBooking), bookings.length, 1, Math.max(bookings.length, 1)));
}

export async function POST(req: Request) {
  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return json({ detail: "Invalid JSON body." }, 400);
  }

  const user = await getAuthUser(req);
  const pending: PendingItem[] = [];

  if (body.book_now === "true" || body.book_now === true) {
    const single = body.single_item;
    if (!single || typeof single !== "object") {
      return json({ single_item: ["This field is required when book_now is true."] }, 400);
    }
    pending.push({
      tourId: Number(single.tour_plan),
      timeSlotId: Number(single.time_slot),
      num_adults: toInt(single.num_adults),
      num_children: toInt(single.num_children),
      num_infants: toInt(single.num_infants),
      num_youth: toInt(single.num_youth),
      num_student_eu: toInt(single.num_student_eu),
    });
  } else {
    const ids: number[] = Array.isArray(body.cart_item_ids)
      ? body.cart_item_ids.map((n: unknown) => Number(n)).filter((n: number) => Number.isFinite(n))
      : [];
    if (ids.length === 0) {
      return json({ non_field_errors: ["Provide cart_item_ids or book_now with single_item."] }, 400);
    }
    const cartItems = await prisma.cartItem.findMany({ where: { id: { in: ids } } });
    if (cartItems.length !== ids.length) {
      return json({ non_field_errors: ["One or more cart items were not found."] }, 400);
    }
    for (const c of cartItems) {
      pending.push({
        tourId: c.tourId,
        timeSlotId: c.timeSlotId,
        num_adults: c.numAdults,
        num_children: c.numChildren,
        num_infants: c.numInfants,
        num_youth: c.numYouth,
        num_student_eu: c.numStudentEu,
        cartItemId: c.id,
      });
    }
  }

  for (const p of pending) {
    const total = p.num_adults + p.num_children + p.num_infants + p.num_youth + p.num_student_eu;
    if (!Number.isFinite(p.tourId) || !Number.isFinite(p.timeSlotId) || total === 0) {
      return json({ non_field_errors: ["Invalid booking item."] }, 400);
    }
  }

  const travelerDetails = Array.isArray(body.traveler_details) ? body.traveler_details : [];

  try {
    const booking = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const itemsData: {
        tourId: number;
        timeSlotId: number;
        numAdults: number;
        numChildren: number;
        numInfants: number;
        numYouth: number;
        numStudentEu: number;
        itemPrice: number;
      }[] = [];

      for (const p of pending) {
        const tour = await tx.tour.findFirst({
          where: { id: p.tourId, status: "published", isActive: true },
        });
        if (!tour) throw new Error("Invalid tour.");

        const slot = await tx.timeSlot.findFirst({
          where: { id: p.timeSlotId, isActive: true },
          include: { tourDate: true },
        });
        if (!slot || slot.tourDate.tourId !== tour.id) {
          throw new Error("Invalid time slot.");
        }
        if (
          slot.availableAdults < p.num_adults ||
          slot.availableChildren < p.num_children ||
          slot.availableInfants < p.num_infants ||
          slot.availableYouth < p.num_youth ||
          slot.availableStudentEu < p.num_student_eu
        ) {
          throw new Error(`Not enough availability for "${tour.title}" at ${slot.startTime}.`);
        }

        // Guard against concurrent bookings: only decrement while counts still cover the request.
        const updated = await tx.timeSlot.updateMany({
          where: {
            id: slot.id,
            availableAdults: { gte: p.num_adults },
            availableChildren: { gte: p.num_children },
            availableInfants: { gte: p.num_infants },
            availableYouth: { gte: p.num_youth },
            availableStudentEu: { gte: p.num_student_eu },
          },
          data: {
            availableAdults: { decrement: p.num_adults },
            availableChildren: { decrement: p.num_children },
            availableInfants: { decrement: p.num_infants },
            availableYouth: { decrement: p.num_youth },
            availableStudentEu: { decrement: p.num_student_eu },
          },
        });
        if (updated.count === 0) {
          throw new Error(`Not enough availability for "${tour.title}" at ${slot.startTime}.`);
        }

        const itemPrice = computeItemPrice(tour, p);
        totalPrice += itemPrice;
        itemsData.push({
          tourId: tour.id,
          timeSlotId: slot.id,
          numAdults: p.num_adults,
          numChildren: p.num_children,
          numInfants: p.num_infants,
          numYouth: p.num_youth,
          numStudentEu: p.num_student_eu,
          itemPrice,
        });
      }

      const created = await tx.booking.create({
        data: {
          userType: user ? "registered" : "guest",
          userId: user?.id ?? null,
          totalPrice,
          travelerDetails: JSON.stringify(travelerDetails),
          status: "pending",
          fullName: body.full_name ?? null,
          email: body.email ?? null,
          country: body.country ?? null,
          phone: body.phone ?? null,
          items: { create: itemsData },
        },
      });

      const consumed = pending
        .map((p) => p.cartItemId)
        .filter((id): id is number => id !== undefined);
      if (consumed.length > 0) {
        await tx.cartItem.deleteMany({ where: { id: { in: consumed } } });
      }

      return tx.booking.findUniqueOrThrow({
        where: { id: created.id },
        include: bookingInclude,
      });
    });

    return json(serializeBooking(booking), 201);
  } catch (e: any) {
    return json({ non_field_errors: [e?.message || "Failed to create booking."] }, 400);
  }
}
