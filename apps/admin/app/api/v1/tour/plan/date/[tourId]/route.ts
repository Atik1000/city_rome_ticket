import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeTourDate, paginated } from "@iconic/db/serialize";
import { admin, unauthorized, badRequest, notFound } from "../../../../_lib/helpers";

type Ctx = { params: Promise<{ tourId: string }> };

// Public: the dashboard fetches dates without an Authorization header.
export async function GET(_req: Request, { params }: Ctx) {
  const { tourId } = await params;
  const where = { tourId: Number(tourId) };

  const [count, dates] = await Promise.all([
    prisma.tourDate.count({ where }),
    prisma.tourDate.findMany({ where, orderBy: { date: "asc" }, take: 1000 }),
  ]);

  return NextResponse.json(
    paginated(dates.map(serializeTourDate), count, 1, 1000)
  );
}

export async function POST(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { tourId } = await params;
  const tour = await prisma.tour.findUnique({ where: { id: Number(tourId) } });
  if (!tour) return notFound("Tour not found.");

  const payload = (await req.json().catch(() => null)) as { date?: string } | null;
  const date = (payload?.date || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return badRequest({ date: ["Enter a valid date in YYYY-MM-DD format."] });
  }

  const existing = await prisma.tourDate.findUnique({
    where: { tourId_date: { tourId: tour.id, date } },
  });
  if (existing) {
    return badRequest({ date: ["This date already exists for this tour."] });
  }

  const created = await prisma.tourDate.create({
    data: { tourId: tour.id, date },
  });
  return NextResponse.json(serializeTourDate(created), { status: 201 });
}
