import { prisma } from "@iconic/db";
import { verifyPassword, issueTokens } from "@iconic/db/auth";
import { json } from "../_lib/helpers";

const INVALID = { detail: "No active account found with the given credentials" };

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ detail: "Invalid JSON body." }, 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) return json(INVALID, 401);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return json(INVALID, 401);
  }

  return json(await issueTokens(user));
}
