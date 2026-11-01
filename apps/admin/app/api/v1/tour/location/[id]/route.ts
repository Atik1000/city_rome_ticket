import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeLocation } from "@iconic/db/serialize";
import { admin, unauthorized, badRequest, notFound } from "../../../_lib/helpers";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.location.findUnique({ where: { id: Number(id) } });
  if (!existing) return notFound();

  const payload = (await req.json().catch(() => null)) as {
    name?: string;
    description?: string;
  } | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const location = await prisma.location.update({
    where: { id: existing.id },
    data: {
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.description !== undefined
        ? { description: payload.description }
        : {}),
    },
  });
  return NextResponse.json(serializeLocation(location));
}

export async function DELETE(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.location.findUnique({ where: { id: Number(id) } });
  if (!existing) return notFound();

  await prisma.location.delete({ where: { id: existing.id } });
  return new NextResponse(null, { status: 204 });
}
