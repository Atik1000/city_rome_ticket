import { prisma } from "@iconic/db";
import { serializeTimeSlot, paginated } from "@iconic/db/serialize";
import { json } from "../../../../../_lib/helpers";

const ALL = 1000;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ dateId: string }> }
) {
  const { dateId } = await params;
  const id = Number(dateId);

  const slots = await prisma.timeSlot.findMany({
    where: { tourDateId: Number.isFinite(id) ? id : -1, isActive: true },
    orderBy: { startTime: "asc" },
    take: ALL,
  });

  return json(paginated(slots.map(serializeTimeSlot), slots.length, 1, ALL));
}
