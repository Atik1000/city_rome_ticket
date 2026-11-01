import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { verifyPassword, issueTokens } from "@iconic/db/auth";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password) {
    return NextResponse.json(
      { detail: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const invalid = NextResponse.json(
    { detail: "No active account found with the given credentials" },
    { status: 401 }
  );
  if (!user) return invalid;
  if (user.role !== "admin" && user.role !== "moderator") return invalid;
  if (!(await verifyPassword(password, user.passwordHash))) return invalid;

  const tokens = await issueTokens(user);
  return NextResponse.json(tokens);
}
