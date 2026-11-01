import { prisma } from "@iconic/db";
import { serializeNotice, paginated, PAGE_SIZE } from "@iconic/db/serialize";
import { json, pageParam } from "../../_lib/helpers";

export async function GET(req: Request) {
  const page = pageParam(new URL(req.url));
  const where = { isActive: true };
  const [count, notices] = await Promise.all([
    prisma.notice.count({ where }),
    prisma.notice.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  return json(paginated(notices.map(serializeNotice), count, page, PAGE_SIZE));
}
