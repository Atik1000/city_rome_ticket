import { prisma } from "@iconic/db";
import { serializeCartItem } from "@iconic/db/serialize";
import { json, notFound, computeItemPrice, toInt } from "../../../_lib/helpers";

async function findItem(idStr: string) {
  const id = Number(idStr);
  if (!Number.isFinite(id)) return null;
  return prisma.cartItem.findUnique({ where: { id } });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const item = await findItem((await params).id);
  if (!item) return notFound();
  return json(serializeCartItem(item));
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const item = await findItem((await params).id);
  if (!item) return notFound();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ detail: "Invalid JSON body." }, 400);
  }

  const pick = (key: string, current: number) =>
    body[key] !== undefined ? toInt(body[key]) : current;

  const counts = {
    num_adults: pick("num_adults", item.numAdults),
    num_children: pick("num_children", item.numChildren),
    num_infants: pick("num_infants", item.numInfants),
    num_youth: pick("num_youth", item.numYouth),
    num_student_eu: pick("num_student_eu", item.numStudentEu),
  };
  const totalTravelers = Object.values(counts).reduce((a, b) => a + b, 0);
  if (totalTravelers === 0) {
    return json({ non_field_errors: ["Select at least one traveler."] }, 400);
  }

  let timeSlotId = item.timeSlotId;
  if (body.time_slot !== undefined) {
    const slot = await prisma.timeSlot.findFirst({
      where: { id: Number(body.time_slot), isActive: true },
      include: { tourDate: true },
    });
    if (!slot || slot.tourDate.tourId !== item.tourId) {
      return json({ time_slot: ["Invalid time slot."] }, 400);
    }
    timeSlotId = slot.id;
  }

  const tour = await prisma.tour.findUnique({ where: { id: item.tourId } });
  if (!tour) return notFound();

  const updated = await prisma.cartItem.update({
    where: { id: item.id },
    data: {
      numAdults: counts.num_adults,
      numChildren: counts.num_children,
      numInfants: counts.num_infants,
      numYouth: counts.num_youth,
      numStudentEu: counts.num_student_eu,
      itemPrice: computeItemPrice(tour, counts),
      timeSlotId,
    },
  });
  return json(serializeCartItem(updated));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const item = await findItem((await params).id);
  if (!item) return notFound();
  await prisma.cartItem.delete({ where: { id: item.id } });
  return new Response(null, { status: 204 });
}
