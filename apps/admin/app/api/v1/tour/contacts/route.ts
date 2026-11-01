import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeContact, paginated } from "@iconic/db/serialize";
import { admin, unauthorized, pageParam } from "../../_lib/helpers";

const PAGE_SIZE = 100;

export async function GET(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const url = new URL(req.url);
  const page = pageParam(req);
  const search = (url.searchParams.get("search") || "").trim();
  const status = (url.searchParams.get("status") || "").trim();

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
      { subject: { contains: search } },
      { message: { contains: search } },
    ];
  }

  const [count, contacts] = await Promise.all([
    prisma.contactRequest.count({ where }),
    prisma.contactRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return NextResponse.json(
    paginated(contacts.map(serializeContact), count, page, PAGE_SIZE)
  );
}
