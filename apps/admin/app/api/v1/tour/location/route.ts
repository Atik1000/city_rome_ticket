import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeLocation, paginated } from "@iconic/db/serialize";
import { admin, unauthorized, badRequest, pageParam } from "../../_lib/helpers";

const PAGE_SIZE = 100;

export async function GET(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const page = pageParam(req);
  const [count, locations] = await Promise.all([
    prisma.location.count(),
    prisma.location.findMany({
      orderBy: { id: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  return NextResponse.json(
    paginated(locations.map(serializeLocation), count, page, PAGE_SIZE)
  );
}

export async function POST(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const payload = (await req.json().catch(() => null)) as {
    name?: string;
    description?: string;
  } | null;
  if (!payload?.name) return badRequest({ name: ["This field is required."] });

  const location = await prisma.location.create({
    data: { name: payload.name, description: payload.description || "" },
  });
  return NextResponse.json(serializeLocation(location), { status: 201 });
}
