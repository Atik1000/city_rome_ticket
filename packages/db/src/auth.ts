import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./index";
import type { User } from "@prisma/client";

const secret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || "iconic-rome-tickets-dev-secret-change-me"
  );

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export async function issueTokens(user: {
  id: number;
  email: string;
  role: string;
}): Promise<TokenPair> {
  const base = { sub: String(user.id), email: user.email, role: user.role };
  const access = await new SignJWT({ ...base, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret());
  const refresh = await new SignJWT({ ...base, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  return { access, refresh };
}

export interface AuthPayload {
  userId: number;
  email: string;
  role: string;
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.type !== "access") return null;
    return {
      userId: Number(payload.sub),
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

/** Reads "Authorization: Bearer x" or the access_token cookie from a Request. */
export function extractToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7);
  const cookie = req.headers.get("cookie");
  if (cookie) {
    const match = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("access_token="));
    if (match) return decodeURIComponent(match.split("=")[1]);
  }
  return null;
}

export async function getAuthUser(req: Request): Promise<User | null> {
  const token = extractToken(req);
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return prisma.user.findUnique({ where: { id: payload.userId } });
}

export async function requireAdmin(req: Request): Promise<User | null> {
  const user = await getAuthUser(req);
  if (!user) return null;
  if (user.role !== "admin" && user.role !== "moderator") return null;
  return user;
}
