import nodemailer from "nodemailer";

/** Where new-booking notifications go. Override with BOOKING_NOTIFY_EMAIL (comma-separated for several). */
const NOTIFY_TO = process.env.BOOKING_NOTIFY_EMAIL || "contactwnoor@gmail.com";

export interface BookingEmailData {
  id: number;
  status: string;
  userType: string;
  totalPrice: number;
  createdAt: Date;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  travelerNames: string[];
  items: {
    tourTitle: string;
    date: string;
    startTime: string;
    endTime: string | null;
    numAdults: number;
    numChildren: number;
    numInfants: number;
    numYouth: number;
    numStudentEu: number;
    itemPrice: number;
  }[];
}

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Strip CR/LF so user input can never inject mail headers. */
const oneLine = (s: unknown) => String(s ?? "").replace(/[\r\n]+/g, " ").trim();

const euro = (n: number) => `€${n.toFixed(2)}`;

function partySummary(i: BookingEmailData["items"][number]): string {
  const parts: [number, string][] = [
    [i.numAdults, "adult"],
    [i.numYouth, "youth"],
    [i.numStudentEu, "EU student"],
    [i.numChildren, "child"],
    [i.numInfants, "infant"],
  ];
  return parts
    .filter(([n]) => n > 0)
    .map(([n, label]) => `${n} × ${label}`)
    .join(", ");
}

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT) || 465;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * Email the client + booking details to the site owner.
 * Never throws: a mail failure must not affect the booking itself.
 */
export async function sendBookingNotification(b: BookingEmailData): Promise<void> {
  try {
    const transport = getTransport();
    if (!transport) {
      console.warn(
        `[booking-email] SMTP_HOST/SMTP_USER/SMTP_PASS not set; notification for booking #${b.id} was not sent.`
      );
      return;
    }

    const name = oneLine(b.fullName) || "—";
    const email = oneLine(b.email);
    const phone = oneLine(b.phone);
    const waDigits = phone.replace(/\D/g, "");
    const created = b.createdAt.toLocaleString("en-GB", {
      timeZone: "Europe/Rome",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const clientRows: [string, string, string][] = [
      ["Name", name, esc(name)],
      ["Email", email || "—", email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : "—"],
      [
        "WhatsApp",
        phone || "—",
        phone ? `<a href="https://wa.me/${esc(waDigits)}">${esc(phone)}</a>` : "—",
      ],
      ["Country", oneLine(b.country) || "—", esc(oneLine(b.country) || "—")],
      ["Customer type", b.userType, esc(b.userType)],
    ];

    const text = [
      `New booking #${b.id} on the Iconic Rome Tours website`,
      "",
      "CLIENT",
      ...clientRows.map(([k, v]) => `${k}: ${v}`),
      "",
      "BOOKING",
      `Booking ID: #${b.id}`,
      `Status: ${b.status}`,
      `Placed: ${created} (Rome time)`,
      `Total: ${euro(b.totalPrice)}`,
      "",
      "TOURS",
      ...b.items.map(
        (i) =>
          `- ${i.tourTitle}\n  ${i.date} at ${i.startTime}${i.endTime ? `–${i.endTime}` : ""}\n  ${partySummary(i)}\n  ${euro(i.itemPrice)}`
      ),
      ...(b.travelerNames.length ? ["", "TRAVELERS", ...b.travelerNames.map((n, idx) => `${idx + 1}. ${n}`)] : []),
    ].join("\n");

    const td = 'style="padding:6px 12px 6px 0;vertical-align:top"';
    const th = 'style="padding:6px 12px 6px 0;vertical-align:top;color:#666;white-space:nowrap;text-align:left;font-weight:normal"';
    const h2 = 'style="font-size:15px;margin:24px 0 8px;color:#003b95"';
    const row = (k: string, vHtml: string) => `<tr><th ${th}>${esc(k)}</th><td ${td}>${vHtml}</td></tr>`;

    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;max-width:640px">
<h1 style="font-size:20px;margin:0 0 4px;color:#003b95">New booking #${b.id}</h1>
<p style="margin:0;color:#666">Iconic Rome Tours website · ${esc(created)} (Rome time)</p>
<h2 ${h2}>Client</h2>
<table cellpadding="0" cellspacing="0">${clientRows.map(([k, , v]) => row(k, v)).join("")}</table>
<h2 ${h2}>Booking</h2>
<table cellpadding="0" cellspacing="0">
${row("Booking ID", `#${b.id}`)}
${row("Status", esc(b.status))}
${row("Total", `<strong>${euro(b.totalPrice)}</strong>`)}
</table>
<h2 ${h2}>Tours</h2>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
${b.items
  .map(
    (i) => `<tr style="border-top:1px solid #e5e5e5">
<td ${td}><strong>${esc(i.tourTitle)}</strong><br>${esc(i.date)} at ${esc(i.startTime)}${i.endTime ? `–${esc(i.endTime)}` : ""}<br><span style="color:#666">${esc(partySummary(i))}</span></td>
<td style="padding:6px 0;vertical-align:top;text-align:right;white-space:nowrap">${euro(i.itemPrice)}</td>
</tr>`
  )
  .join("")}
</table>
${
  b.travelerNames.length
    ? `<h2 ${h2}>Travelers</h2><ol style="margin:0;padding-left:20px">${b.travelerNames.map((n) => `<li>${esc(n)}</li>`).join("")}</ol>`
    : ""
}
</div>`;

    await transport.sendMail({
      from: process.env.SMTP_FROM || `"Iconic Rome Tours" <${process.env.SMTP_USER}>`,
      to: NOTIFY_TO,
      // Lets the owner hit Reply to answer the client directly.
      ...(email ? { replyTo: email } : {}),
      subject: `New booking #${b.id} – ${name} – ${euro(b.totalPrice)}`,
      text,
      html,
    });
  } catch (e) {
    console.error(`[booking-email] Failed to send notification for booking #${b.id}:`, e);
  }
}
