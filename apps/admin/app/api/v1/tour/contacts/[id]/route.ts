import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { serializeContact } from "@iconic/db/serialize";
import { admin, unauthorized, badRequest, notFound } from "../../../_lib/helpers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const existing = await prisma.contactRequest.findUnique({
    where: { id: Number(id) },
  });
  if (!existing) return notFound();

  const payload = (await req.json().catch(() => null)) as {
    status?: string;
    cancelled_reason?: string | null;
  } | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const contact = await prisma.contactRequest.update({
    where: { id: existing.id },
    data: {
      ...(typeof payload.status === "string" ? { status: payload.status } : {}),
      ...("cancelled_reason" in payload
        ? {
            cancelledReason:
              typeof payload.cancelled_reason === "string"
                ? payload.cancelled_reason
                : null,
          }
        : {}),
    },
  });
  return NextResponse.json(serializeContact(contact));
}
