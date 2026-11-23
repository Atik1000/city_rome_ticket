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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(v: unknown): v is string {
  return typeof v === "string" && v.length <= 254 && EMAIL_RE.test(v.trim());
}

/**
 * Normalise a WhatsApp/phone number to "+<digits>" (or bare digits when no "+" was typed).
 * Returns null unless it has 7-15 digits, the E.164 range.
 */
export function normalizePhone(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const raw = v.trim();
  if (!/^\+?[\d\s().-]+$/.test(raw)) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return (raw.startsWith("+") ? "+" : "") + digits;
}
