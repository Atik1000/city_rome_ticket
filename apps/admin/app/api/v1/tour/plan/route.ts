import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeTour, paginated } from "@iconic/db/serialize";
import {
  admin,
  unauthorized,
  badRequest,
  pageParam,
  searchParam,
  tourDataFromPayload,
  tourInclude,
} from "../../_lib/helpers";

const PAGE_SIZE = 100;

export async function GET(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const page = pageParam(req);
  const search = searchParam(req);
  const where = search ? { title: { contains: search } } : {};

  const [count, tours] = await Promise.all([
    prisma.tour.count({ where }),
    prisma.tour.findMany({
      where,
      include: tourInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return NextResponse.json(paginated(tours.map(serializeTour), count, page, PAGE_SIZE));
}

export async function POST(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const payload = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const errors: Record<string, string[]> = {};
  if (!payload.title) errors.title = ["This field is required."];
  if (!payload.description) errors.description = ["This field is required."];
  if (Object.keys(errors).length) return badRequest(errors);

  const data = tourDataFromPayload(payload);
  const imageIds = Array.isArray(payload.image_ids)
    ? (payload.image_ids as number[]).map(Number).filter(Number.isFinite)
    : [];
  const locationIds = Array.isArray(payload.location_ids)
    ? (payload.location_ids as number[]).map(Number).filter(Number.isFinite)
    : [];

  const tour = await prisma.tour.create({
    data: {
      ...(data as object),
      title: String(payload.title),
      description: String(payload.description),
      images: { connect: imageIds.map((id) => ({ id })) },
      locations: { connect: locationIds.map((id) => ({ id })) },
    },
    include: tourInclude,
  });

  return NextResponse.json(serializeTour(tour), { status: 201 });
}
