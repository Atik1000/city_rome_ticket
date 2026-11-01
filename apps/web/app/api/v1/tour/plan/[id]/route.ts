import { prisma } from "@iconic/db";
import { serializeTour } from "@iconic/db/serialize";
import { json, notFound } from "../../../_lib/helpers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tourId = Number(id);
  if (!Number.isFinite(tourId)) return notFound();

  const tour = await prisma.tour.findFirst({
    where: { id: tourId, status: "published", isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      locations: true,
    },
  });
  if (!tour) return notFound();
  return json(serializeTour(tour));
}
