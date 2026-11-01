// Serializers producing the same snake_case JSON shapes the previous
// Django API returned, so both frontends consume identical payloads.
import type {
  Tour,
  TourImage,
  Location,
  TourDate,
  TimeSlot,
  CartItem,
  Booking,
  BookingItem,
  ContactRequest,
  Notice,
  User,
} from "@prisma/client";

const money = (n: number) => n.toFixed(2);
const parseArr = (s: string): string[] => {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export function serializeImage(i: TourImage) {
  return { id: i.id, file: i.file, status: i.status };
}

export function serializeLocation(l: Location) {
  return {
    id: l.id,
    name: l.name,
    description: l.description,
    created_at: l.createdAt.toISOString(),
  };
}

export function serializeTour(
  t: Tour & { images?: TourImage[]; locations?: Location[] }
) {
  return {
    id: t.id,
    locations: (t.locations ?? []).map(serializeLocation),
    images: (t.images ?? []).map(serializeImage),
    title: t.title,
    description: t.description,
    max_adults: t.maxAdults,
    price_adult: money(t.priceAdult),
    adult_age_min: t.adultAgeMin,
    adult_age_max: t.adultAgeMax,
    max_children: t.maxChildren,
    price_child: money(t.priceChild),
    child_age_min: t.childAgeMin,
    child_age_max: t.childAgeMax,
    max_infants: t.maxInfants,
    price_infant: money(t.priceInfant),
    infant_age_min: t.infantAgeMin,
    infant_age_max: t.infantAgeMax,
    max_youth: t.maxYouth,
    price_youth: money(t.priceYouth),
    youth_age_min: t.youthAgeMin,
    youth_age_max: t.youthAgeMax,
    max_student_eu: t.maxStudentEu,
    price_student_eu: money(t.priceStudentEu),
    student_eu_age_min: t.studentEuAgeMin,
    student_eu_age_max: t.studentEuAgeMax,
    free_cancellation: t.freeCancellation,
    pickup_included: t.pickupIncluded,
    highlights: parseArr(t.highlights),
    full_description: t.fullDescription,
    includes: parseArr(t.includes),
    excludes: parseArr(t.excludes),
    not_suitable_for: parseArr(t.notSuitableFor),
    not_allowed: parseArr(t.notAllowed),
    know_before_you_go: parseArr(t.knowBeforeYouGo),
    duration_days: t.durationDays,
    status: t.status,
    is_active: t.isActive,
    created_at: t.createdAt.toISOString(),
    updated_at: t.updatedAt.toISOString(),
  };
}

export function serializeTourDate(d: TourDate) {
  return {
    id: d.id,
    date: d.date,
    is_active: d.isActive,
    created_at: d.createdAt.toISOString(),
    tour_plan: d.tourId,
  };
}

export function serializeTimeSlot(s: TimeSlot & { tourDate?: TourDate }) {
  const base = {
    id: s.id,
    start_time: s.startTime,
    end_time: s.endTime,
    available_adults: s.availableAdults,
    available_children: s.availableChildren,
    available_infants: s.availableInfants,
    available_youth: s.availableYouth,
    available_student_eu: s.availableStudentEu,
    is_active: s.isActive,
    created_at: s.createdAt.toISOString(),
  };
  if (s.tourDate) {
    return { ...base, tour_date: serializeTourDate(s.tourDate) };
  }
  return { ...base, tour_date: s.tourDateId };
}

export function serializeCartItem(c: CartItem) {
  return {
    id: c.id,
    num_adults: c.numAdults,
    num_children: c.numChildren,
    num_infants: c.numInfants,
    num_youth: c.numYouth,
    num_student_eu: c.numStudentEu,
    item_price: money(c.itemPrice),
    created_at: c.createdAt.toISOString(),
    updated_at: c.updatedAt.toISOString(),
    user: c.userId,
    tour_plan: c.tourId,
    time_slot: c.timeSlotId,
  };
}

export function serializeBookingItem(
  i: BookingItem & {
    tour?: Tour & { images?: TourImage[]; locations?: Location[] };
    timeSlot?: TimeSlot & { tourDate?: TourDate };
  }
) {
  return {
    id: i.id,
    num_adults: i.numAdults,
    num_children: i.numChildren,
    num_infants: i.numInfants,
    num_youth: i.numYouth,
    num_student_eu: i.numStudentEu,
    item_price: money(i.itemPrice),
    created_at: i.createdAt.toISOString(),
    booking: i.bookingId,
    tour_plan: i.tour ? serializeTour(i.tour) : i.tourId,
    time_slot: i.timeSlot ? serializeTimeSlot(i.timeSlot) : i.timeSlotId,
  };
}

export function serializeBooking(
  b: Booking & {
    items?: (BookingItem & {
      tour?: Tour & { images?: TourImage[]; locations?: Location[] };
      timeSlot?: TimeSlot & { tourDate?: TourDate };
    })[];
  }
) {
  let travelers: unknown[] = [];
  try {
    travelers = JSON.parse(b.travelerDetails);
  } catch {}
  return {
    id: b.id,
    items: (b.items ?? []).map(serializeBookingItem),
    user_type: b.userType,
    total_price: money(b.totalPrice),
    traveler_details: travelers,
    status: b.status,
    cancelled_reason: b.cancelledReason,
    booked_by_admin: b.bookedByAdmin,
    full_name: b.fullName,
    email: b.email,
    country: b.country,
    phone: b.phone,
    created_at: b.createdAt.toISOString(),
    updated_at: b.updatedAt.toISOString(),
    user: b.userId,
    guest_user: null,
  };
}

export function serializeContact(c: ContactRequest) {
  return {
    id: c.id,
    first_name: c.firstName,
    last_name: c.lastName,
    email: c.email,
    phone: c.phone,
    subject: c.subject,
    message: c.message,
    status: c.status,
    cancelled_reason: c.cancelledReason,
    created_at: c.createdAt.toISOString(),
  };
}

export function serializeNotice(n: Notice) {
  return {
    id: n.id,
    title: n.title,
    description: n.description,
    is_active: n.isActive,
  };
}

export function serializeUser(u: User) {
  return {
    id: u.id,
    first_name: u.firstName,
    last_name: u.lastName,
    email: u.email,
    phone: u.phone,
    role: u.role,
  };
}

/** Django-style paginated envelope. */
export function paginated<T>(results: T[], count: number, page: number, pageSize: number, baseUrl?: string) {
  const pages = Math.max(1, Math.ceil(count / pageSize));
  const mk = (p: number) =>
    baseUrl ? `${baseUrl}?page=${p}` : String(p);
  return {
    count,
    next: page < pages ? mk(page + 1) : null,
    previous: page > 1 ? mk(page - 1) : null,
    results,
  };
}

export const PAGE_SIZE = 10;
