import { prisma } from "@iconic/db";
import { getAuthUser, hashPassword } from "@iconic/db/auth";
import { serializeUser } from "@iconic/db/serialize";
import { json } from "../_lib/helpers";

const UNAUTHENTICATED = { detail: "Authentication credentials were not provided." };

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return json(UNAUTHENTICATED, 401);
  return json(serializeUser(user));
}

export async function PATCH(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return json(UNAUTHENTICATED, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ detail: "Invalid JSON body." }, 400);
  }

  const data: Record<string, unknown> = {};
  if (typeof body.first_name === "string" && body.first_name.trim()) data.firstName = body.first_name.trim();
  if (typeof body.last_name === "string" && body.last_name.trim()) data.lastName = body.last_name.trim();
  if (body.phone !== undefined) data.phone = typeof body.phone === "string" ? body.phone.trim() : null;
  if (typeof body.email === "string" && body.email.trim()) {
    const email = body.email.trim().toLowerCase();
    if (email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return json({ email: ["user with this email already exists."] }, 400);
    }
    data.email = email;
  }
  if (typeof body.password === "string" && body.password) {
    if (body.password.length < 8) {
      return json({ password: ["Password must be at least 8 characters."] }, 400);
    }
    data.passwordHash = await hashPassword(body.password);
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  return json(serializeUser(updated));
}

export async function DELETE(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return json(UNAUTHENTICATED, 401);
  await prisma.user.delete({ where: { id: user.id } });
  return new Response(null, { status: 204 });
}
