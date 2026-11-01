import { prisma } from "@iconic/db";
import { serializeTour, paginated, PAGE_SIZE } from "@iconic/db/serialize";
import { json, pageParam } from "../../_lib/helpers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = pageParam(url);
  const search = url.searchParams.get("search");
  const num = (key: string) => {
    const raw = url.searchParams.get(key);
    if (raw === null || raw === "") return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };

  const where: Record<string, unknown> = {
    status: "published",
    isActive: true,
  };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }
  const durMin = num("duration_days_min");
  const durMax = num("duration_days_max");
  if (durMin !== undefined || durMax !== undefined) {
    where.durationDays = {
      ...(durMin !== undefined ? { gte: durMin } : {}),
      ...(durMax !== undefined ? { lte: durMax } : {}),
    };
  }
  const priceMin = num("price_adult_min");
  const priceMax = num("price_adult_max");
  if (priceMin !== undefined || priceMax !== undefined) {
    where.priceAdult = {
      ...(priceMin !== undefined ? { gte: priceMin } : {}),
      ...(priceMax !== undefined ? { lte: priceMax } : {}),
    };
  }

  const [count, tours] = await Promise.all([
    prisma.tour.count({ where }),
    prisma.tour.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        locations: true,
      },
      orderBy: { id: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return json(paginated(tours.map(serializeTour), count, page, PAGE_SIZE));
}
