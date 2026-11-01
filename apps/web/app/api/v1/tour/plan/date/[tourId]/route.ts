import { prisma } from "@iconic/db";
import { serializeTourDate, paginated } from "@iconic/db/serialize";
import { json } from "../../../../_lib/helpers";

// The availability calendar needs every upcoming date, so the envelope
// is kept but the page holds all results.
const ALL = 1000;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await params;
  const id = Number(tourId);
  const today = new Date().toISOString().slice(0, 10);

  const dates = await prisma.tourDate.findMany({
    where: {
      tourId: Number.isFinite(id) ? id : -1,
      isActive: true,
      date: { gte: today },
    },
    orderBy: { date: "asc" },
    take: ALL,
  });

  return json(paginated(dates.map(serializeTourDate), dates.length, 1, ALL));
}
