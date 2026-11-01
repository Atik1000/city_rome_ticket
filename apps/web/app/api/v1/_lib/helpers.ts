import { NextResponse } from "next/server";
import type { Tour } from "@iconic/db";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function notFound(detail = "Not found.") {
  return json({ detail }, 404);
}

export interface PartyCounts {
  num_adults?: number;
  num_children?: number;
  num_infants?: number;
  num_youth?: number;
  num_student_eu?: number;
}

export const toInt = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
};

/** Server-side price: per-category tour prices x traveler counts. */
export function computeItemPrice(tour: Tour, counts: PartyCounts): number {
  return (
    tour.priceAdult * toInt(counts.num_adults) +
    tour.priceChild * toInt(counts.num_children) +
    tour.priceInfant * toInt(counts.num_infants) +
    tour.priceYouth * toInt(counts.num_youth) +
    tour.priceStudentEu * toInt(counts.num_student_eu)
  );
}

export function pageParam(url: URL): number {
  const p = parseInt(url.searchParams.get("page") || "1", 10);
  return Number.isFinite(p) && p > 0 ? p : 1;
}
