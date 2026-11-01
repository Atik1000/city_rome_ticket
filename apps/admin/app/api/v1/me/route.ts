import { NextResponse } from "next/server";
import { serializeUser } from "@iconic/db/serialize";
import { admin, unauthorized } from "../_lib/helpers";

export async function GET(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();
  return NextResponse.json(serializeUser(user));
}
