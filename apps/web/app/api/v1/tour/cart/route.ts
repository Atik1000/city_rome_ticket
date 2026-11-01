import { prisma } from "@iconic/db";
import { getAuthUser } from "@iconic/db/auth";
import { serializeCartItem, paginated } from "@iconic/db/serialize";
import { json, computeItemPrice, toInt } from "../../_lib/helpers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idsParam = url.searchParams.get("cart_ids") || "";
  const ids = idsParam
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n));

  if (ids.length === 0) return json(paginated([], 0, 1, 100));

  const items = await prisma.cartItem.findMany({
    where: { id: { in: ids } },
    orderBy: { id: "asc" },
  });
  return json(paginated(items.map(serializeCartItem), items.length, 1, 100));
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ detail: "Invalid JSON body." }, 400);
  }

  const tourId = Number(body.tour_plan);
  const timeSlotId = Number(body.time_slot);
  if (!Number.isFinite(tourId)) return json({ tour_plan: ["This field is required."] }, 400);
  if (!Number.isFinite(timeSlotId)) return json({ time_slot: ["This field is required."] }, 400);

  const [tour, slot] = await Promise.all([
    prisma.tour.findFirst({ where: { id: tourId, status: "published", isActive: true } }),
    prisma.timeSlot.findFirst({ where: { id: timeSlotId, isActive: true } }),
  ]);
  if (!tour) return json({ tour_plan: ["Invalid tour."] }, 400);
  if (!slot) return json({ time_slot: ["Invalid time slot."] }, 400);
  const tourDate = await prisma.tourDate.findUnique({ where: { id: slot.tourDateId } });
  if (!tourDate || tourDate.tourId !== tour.id) {
    return json({ time_slot: ["Time slot does not belong to this tour."] }, 400);
  }

  const counts = {
    num_adults: toInt(body.num_adults),
    num_children: toInt(body.num_children),
    num_infants: toInt(body.num_infants),
    num_youth: toInt(body.num_youth),
    num_student_eu: toInt(body.num_student_eu),
  };
  const totalTravelers = Object.values(counts).reduce((a, b) => a + b, 0);
  if (totalTravelers === 0) {
    return json({ non_field_errors: ["Select at least one traveler."] }, 400);
  }

  const user = await getAuthUser(req);
  const item = await prisma.cartItem.create({
    data: {
      numAdults: counts.num_adults,
      numChildren: counts.num_children,
      numInfants: counts.num_infants,
      numYouth: counts.num_youth,
      numStudentEu: counts.num_student_eu,
      // Price is always computed server-side; any client value is ignored.
      itemPrice: computeItemPrice(tour, counts),
      tourId: tour.id,
      timeSlotId: slot.id,
      userId: user?.id ?? null,
    },
  });

  return json(serializeCartItem(item), 201);
}
