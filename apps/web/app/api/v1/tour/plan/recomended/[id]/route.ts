import { prisma } from "@iconic/db";
import { serializeTour, paginated } from "@iconic/db/serialize";
import { json } from "../../../../_lib/helpers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tourId = Number(id);

  const tours = await prisma.tour.findMany({
    where: {
      status: "published",
      isActive: true,
      ...(Number.isFinite(tourId) ? { id: { not: tourId } } : {}),
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      locations: true,
    },
    orderBy: { id: "asc" },
    take: 4,
  });

  return json(paginated(tours.map(serializeTour), tours.length, 1, 4));
}
