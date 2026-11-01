import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeNotice, paginated } from "@iconic/db/serialize";
import { admin, unauthorized, badRequest } from "../../_lib/helpers";

const PAGE_SIZE = 100;

export async function GET(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const [count, notices] = await Promise.all([
    prisma.notice.count(),
    prisma.notice.findMany({ orderBy: { createdAt: "desc" }, take: PAGE_SIZE }),
  ]);
  return NextResponse.json(
    paginated(notices.map(serializeNotice), count, 1, PAGE_SIZE)
  );
}

export async function POST(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const payload = (await req.json().catch(() => null)) as {
    title?: string;
    description?: string;
    is_active?: boolean;
  } | null;

  const errors: Record<string, string[]> = {};
  if (!payload?.title) errors.title = ["This field is required."];
  if (!payload?.description) errors.description = ["This field is required."];
  if (Object.keys(errors).length) return badRequest(errors);

  // New notices start inactive; only one notice is active at a time.
  const notice = await prisma.notice.create({
    data: {
      title: payload!.title!,
      description: payload!.description!,
      isActive: payload?.is_active ?? false,
    },
  });
  if (notice.isActive) {
    await prisma.notice.updateMany({
      where: { id: { not: notice.id } },
      data: { isActive: false },
    });
  }
  return NextResponse.json(serializeNotice(notice), { status: 201 });
}
