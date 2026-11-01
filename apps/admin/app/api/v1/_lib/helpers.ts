import { NextResponse } from "next/server";
import { requireAdmin } from "@iconic/db/auth";
import type { User, Prisma } from "@iconic/db";

export function unauthorized() {
  return NextResponse.json(
    { detail: "Authentication credentials were not provided." },
    { status: 401 }
  );
}

export function notFound(detail = "Not found.") {
  return NextResponse.json({ detail }, { status: 404 });
}

export function badRequest(body: Record<string, unknown>) {
  return NextResponse.json(body, { status: 400 });
}

/** Returns the admin/moderator user, or null (caller returns unauthorized()). */
export async function admin(req: Request): Promise<User | null> {
  return requireAdmin(req);
}

export function pageParam(req: Request): number {
  const page = Number(new URL(req.url).searchParams.get("page") || "1");
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
}

export function searchParam(req: Request): string {
  return (new URL(req.url).searchParams.get("search") || "").trim();
}

const num = (v: unknown): number | undefined => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const int = (v: unknown): number | undefined => {
  const n = num(v);
  return n === undefined ? undefined : Math.trunc(n);
};

const arr = (v: unknown): string | undefined =>
  Array.isArray(v) ? JSON.stringify(v) : undefined;

/**
 * Maps the snake_case TourPlan payload the dashboard sends onto Prisma's
 * Tour fields. Only keys present in the payload are included, so the same
 * mapping serves POST (with defaults) and PATCH (partial update).
 */
export function tourDataFromPayload(p: Record<string, unknown>) {
  const data: Prisma.TourUpdateInput = {};
  const set = <K extends keyof Prisma.TourUpdateInput>(
    key: K,
    value: Prisma.TourUpdateInput[K] | undefined
  ) => {
    if (value !== undefined) data[key] = value;
  };

  if (typeof p.title === "string") set("title", p.title);
  if (typeof p.description === "string") set("description", p.description);
  if ("full_description" in p)
    set("fullDescription", (p.full_description as string | null) ?? null);

  set("maxAdults", int(p.max_adults));
  set("priceAdult", num(p.price_adult));
  set("adultAgeMin", int(p.adult_age_min));
  set("adultAgeMax", int(p.adult_age_max));
  set("maxChildren", int(p.max_children));
  set("priceChild", num(p.price_child));
  set("childAgeMin", int(p.child_age_min));
  set("childAgeMax", int(p.child_age_max));
  set("maxInfants", int(p.max_infants));
  set("priceInfant", num(p.price_infant));
  set("infantAgeMin", int(p.infant_age_min));
  set("infantAgeMax", int(p.infant_age_max));
  set("maxYouth", int(p.max_youth));
  set("priceYouth", num(p.price_youth));
  set("youthAgeMin", int(p.youth_age_min));
  set("youthAgeMax", int(p.youth_age_max));
  set("maxStudentEu", int(p.max_student_eu));
  set("priceStudentEu", num(p.price_student_eu));
  set("studentEuAgeMin", int(p.student_eu_age_min));
  set("studentEuAgeMax", int(p.student_eu_age_max));

  if (typeof p.free_cancellation === "boolean")
    set("freeCancellation", p.free_cancellation);
  if (typeof p.pickup_included === "boolean")
    set("pickupIncluded", p.pickup_included);

  set("highlights", arr(p.highlights));
  set("includes", arr(p.includes));
  set("excludes", arr(p.excludes));
  set("notSuitableFor", arr(p.not_suitable_for));
  set("notAllowed", arr(p.not_allowed));
  set("knowBeforeYouGo", arr(p.know_before_you_go));

  set("durationDays", int(p.duration_days));
  if (typeof p.status === "string") set("status", p.status);
  if (typeof p.is_active === "boolean") set("isActive", p.is_active);

  return data;
}

export const tourInclude = {
  images: true,
  locations: true,
} as const;

export const bookingInclude = {
  items: {
    include: {
      tour: { include: tourInclude },
      timeSlot: { include: { tourDate: true } },
    },
  },
} as const;

/** Price of one booking item from the tour's per-person prices. */
export function itemPrice(
  tour: {
    priceAdult: number;
    priceChild: number;
    priceInfant: number;
    priceYouth: number;
    priceStudentEu: number;
  },
  counts: {
    numAdults: number;
    numChildren: number;
    numInfants: number;
    numYouth: number;
    numStudentEu: number;
  }
): number {
  return (
    tour.priceAdult * counts.numAdults +
    tour.priceChild * counts.numChildren +
    tour.priceInfant * counts.numInfants +
    tour.priceYouth * counts.numYouth +
    tour.priceStudentEu * counts.numStudentEu
  );
}
