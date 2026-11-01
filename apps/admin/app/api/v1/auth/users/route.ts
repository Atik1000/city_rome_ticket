import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { hashPassword } from "@iconic/db/auth";
import { serializeUser, paginated } from "@iconic/db/serialize";
import { admin, unauthorized, badRequest, pageParam } from "../../_lib/helpers";

const PAGE_SIZE = 100;
const STAFF_ROLES = ["admin", "moderator"];

export async function GET(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const page = pageParam(req);
  const where = { role: { in: STAFF_ROLES } };
  const [count, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { id: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  return NextResponse.json(
    paginated(users.map(serializeUser), count, page, PAGE_SIZE)
  );
}

export async function POST(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const payload = (await req.json().catch(() => null)) as {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string | null;
    password?: string;
    role?: string;
  } | null;
  if (!payload) return badRequest({ detail: "Invalid request body." });

  const errors: Record<string, string[]> = {};
  if (!payload.first_name) errors.first_name = ["This field is required."];
  if (!payload.last_name) errors.last_name = ["This field is required."];
  if (!payload.email) errors.email = ["This field is required."];
  if (!payload.password) errors.password = ["This field is required."];
  if (Object.keys(errors).length) return badRequest(errors);

  const email = payload.email!.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return badRequest({ email: ["A user with this email already exists."] });
  }

  const role = STAFF_ROLES.includes((payload.role || "").toLowerCase())
    ? payload.role!.toLowerCase()
    : "moderator";

  const created = await prisma.user.create({
    data: {
      firstName: payload.first_name!,
      lastName: payload.last_name!,
      email,
      phone: payload.phone || null,
      passwordHash: await hashPassword(payload.password!),
      role,
    },
  });
  return NextResponse.json(serializeUser(created), { status: 201 });
}
