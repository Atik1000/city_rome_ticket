import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeNotice } from "@iconic/db/serialize";
import { admin, unauthorized, badRequest, notFound } from "../../../_lib/helpers";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const notice = await prisma.notice.findUnique({ where: { id: Number(id) } });
  if (!notice) return notFound();
  return NextResponse.json(serializeNotice(notice));
}

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.notice.findUnique({ where: { id: Number(id) } });
  if (!existing) return notFound();

  const payload = (await req.json().catch(() => null)) as {
    title?: string;
    description?: string;
    is_active?: boolean;
  } | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const notice = await prisma.notice.update({
    where: { id: existing.id },
    data: {
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.description !== undefined
        ? { description: payload.description }
        : {}),
      ...(typeof payload.is_active === "boolean"
        ? { isActive: payload.is_active }
        : {}),
    },
  });

  // Keep a single active notice: activating one deactivates the rest.
  if (payload.is_active === true) {
    await prisma.notice.updateMany({
      where: { id: { not: notice.id } },
      data: { isActive: false },
    });
  }

  return NextResponse.json(serializeNotice(notice));
}

export async function DELETE(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.notice.findUnique({ where: { id: Number(id) } });
  if (!existing) return notFound();

  await prisma.notice.delete({ where: { id: existing.id } });
  return new NextResponse(null, { status: 204 });
}
