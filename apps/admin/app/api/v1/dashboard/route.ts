import { NextResponse } from "next/server";
import { prisma } from "@iconic/db";
import { admin, unauthorized } from "../_lib/helpers";

export async function GET(req: Request) {
  const user = await admin(req);
  if (!user) return unauthorized();

  const [totalBookings, completedBookings, incomeAgg, totalContacts] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "completed" } }),
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { not: "cancelled" } },
      }),
      prisma.contactRequest.count(),
    ]);

  const rate =
    totalBookings > 0
      ? `${((completedBookings / totalBookings) * 100).toFixed(1)}%`
      : "0%";

  return NextResponse.json({
    total_bookings: totalBookings,
    completed_bookings: completedBookings,
    completion_rate: rate,
    total_income: incomeAgg._sum.totalPrice ?? 0,
    total_client_request: totalContacts,
  });
}
