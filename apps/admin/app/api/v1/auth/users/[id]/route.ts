import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { hashPassword } from "@iconic/db/auth";
import { serializeUser } from "@iconic/db/serialize";
import { admin, unauthorized, badRequest, notFound } from "../../../_lib/helpers";

type Ctx = { params: Promise<{ id: string }> };

/** The frontend addresses users by numeric id, api.ts docs also allow email. */
async function findUser(id: string) {
  const decoded = decodeURIComponent(id);
  if (/^\d+$/.test(decoded)) {
    return prisma.user.findUnique({ where: { id: Number(decoded) } });
  }
  return prisma.user.findUnique({ where: { email: decoded.toLowerCase() } });
}

export async function GET(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const target = await findUser(id);
  if (!target) return notFound();
  return NextResponse.json(serializeUser(target));
}

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const target = await findUser(id);
  if (!target) return notFound();

  const payload = (await req.json().catch(() => null)) as {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string | null;
    password?: string;
    role?: string;
  } | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const data: Record<string, unknown> = {};
  if (typeof payload.first_name === "string") data.firstName = payload.first_name;
  if (typeof payload.last_name === "string") data.lastName = payload.last_name;
  if ("phone" in payload) data.phone = payload.phone || null;
  if (typeof payload.role === "string" && payload.role) {
    data.role = payload.role.toLowerCase();
  }
  if (typeof payload.email === "string" && payload.email) {
    const email = payload.email.trim().toLowerCase();
    if (email !== target.email) {
      const taken = await prisma.user.findUnique({ where: { email } });
      if (taken) {
        return badRequest({ email: ["A user with this email already exists."] });
      }
      data.email = email;
    }
  }
  // Re-hash only when a non-empty password is provided.
  if (typeof payload.password === "string" && payload.password.length > 0) {
    data.passwordHash = await hashPassword(payload.password);
  }

  const updated = await prisma.user.update({ where: { id: target.id }, data });
  return NextResponse.json(serializeUser(updated));
}

export async function DELETE(req: Request, { params }: Ctx) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const target = await findUser(id);
  if (!target) return notFound();

  if (target.id === user.id) {
    return badRequest({ detail: "You cannot delete your own account." });
  }

  await prisma.user.delete({ where: { id: target.id } });
  return new NextResponse(null, { status: 204 });
}
