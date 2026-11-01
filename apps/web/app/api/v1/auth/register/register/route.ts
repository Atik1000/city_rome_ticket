import { prisma } from "@iconic/db";
import { hashPassword } from "@iconic/db/auth";
import { serializeUser } from "@iconic/db/serialize";
import { json } from "../../../_lib/helpers";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ detail: "Invalid JSON body." }, 400);
  }

  const str = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim() : "");
  const errors: Record<string, string[]> = {};
  if (!str("first_name")) errors.first_name = ["This field is required."];
  if (!str("last_name")) errors.last_name = ["This field is required."];
  if (!str("email")) errors.email = ["This field is required."];
  const password = typeof body.password === "string" ? (body.password as string) : "";
  if (!password) errors.password = ["This field is required."];
  else if (password.length < 8) errors.password = ["Password must be at least 8 characters."];
  if (Object.keys(errors).length > 0) return json(errors, 400);

  const email = str("email").toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return json({ email: ["user with this email already exists."] }, 400);
  }

  const user = await prisma.user.create({
    data: {
      firstName: str("first_name"),
      lastName: str("last_name"),
      email,
      phone: str("phone") || null,
      passwordHash: await hashPassword(password),
      role: "customer",
    },
  });

  return json(serializeUser(user), 201);
}
