import nodemailer from "nodemailer";

/** Where new-booking notifications go. Override with BOOKING_NOTIFY_EMAIL (comma-separated for several). */
const NOTIFY_TO = process.env.BOOKING_NOTIFY_EMAIL || "contactwnoor@gmail.com";

/** WhatsApp number shown to customers in their confirmation email (same as the site footer). */
const SUPPORT_WHATSAPP = process.env.SUPPORT_WHATSAPP || "+39 371 046 2213";

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
 * Email the client + booking details to the site owner, then a confirmation to the customer.
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
    const h2 = 'style="font-size:15px;margin:24px 0 8px;color:#234f8b"';
    const row = (k: string, vHtml: string) => `<tr><th ${th}>${esc(k)}</th><td ${td}>${vHtml}</td></tr>`;

    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;max-width:640px">
<h1 style="font-size:20px;margin:0 0 4px;color:#234f8b">New booking #${b.id}</h1>
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
    console.log(`[booking-email] Owner notification for booking #${b.id} sent to ${NOTIFY_TO}.`);
  } catch (e) {
    console.error(`[booking-email] Failed to send notification for booking #${b.id}:`, e);
  }

  await sendCustomerConfirmation(b);
}

/**
 * Email the customer a confirmation of what they booked.
 * Never throws: a mail failure must not affect the booking itself.
 */
async function sendCustomerConfirmation(b: BookingEmailData): Promise<void> {
  const to = oneLine(b.email);
  if (!to) return;
  try {
    const transport = getTransport();
    if (!transport) {
      console.warn(`[booking-email] SMTP not set; customer confirmation for booking #${b.id} was not sent.`);
      return;
    }

    const firstName = oneLine(b.fullName).split(" ")[0] || "there";
    const td = 'style="padding:8px 12px 8px 0;vertical-align:top"';
    const h2 = 'style="font-size:15px;margin:24px 0 8px;color:#234f8b"';

    const text = [
      `Hi ${firstName},`,
      "",
      `Thank you for booking with Iconic Rome Tours! Your booking #${b.id} is confirmed.`,
      "",
      "YOUR TOURS",
      ...b.items.map(
        (i) =>
          `- ${i.tourTitle}\n  ${i.date} at ${i.startTime}${i.endTime ? `–${i.endTime}` : ""}\n  ${partySummary(i)}\n  ${euro(i.itemPrice)}`
      ),
      "",
      `Total: ${euro(b.totalPrice)} (pay later)`,
      "",
      `We'll contact you on WhatsApp (${oneLine(b.phone) || "the number you gave us"}) with meeting-point details before your tour.`,
      "",
      `Questions? Reply to this email or message us on WhatsApp: ${SUPPORT_WHATSAPP}`,
      "",
      "Iconic Rome Tours",
      "https://iconicrometours.com",
    ].join("\n");

    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;max-width:640px">
<h1 style="font-size:20px;margin:0 0 12px;color:#234f8b">Your booking is confirmed</h1>
<p style="margin:0 0 8px">Hi ${esc(firstName)},</p>
<p style="margin:0 0 8px">Thank you for booking with Iconic Rome Tours! Your booking <strong>#${b.id}</strong> is confirmed.</p>
<h2 ${h2}>Your tours</h2>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
${b.items
  .map(
    (i) => `<tr style="border-top:1px solid #e5e5e5">
<td ${td}><strong>${esc(i.tourTitle)}</strong><br>${esc(i.date)} at ${esc(i.startTime)}${i.endTime ? `–${esc(i.endTime)}` : ""}<br><span style="color:#666">${esc(partySummary(i))}</span></td>
<td style="padding:8px 0;vertical-align:top;text-align:right;white-space:nowrap">${euro(i.itemPrice)}</td>
</tr>`
  )
  .join("")}
<tr style="border-top:2px solid #234f8b"><td ${td}><strong>Total</strong> <span style="color:#666">(pay later)</span></td><td style="padding:8px 0;text-align:right"><strong>${euro(b.totalPrice)}</strong></td></tr>
</table>
<p style="margin:24px 0 8px">We'll contact you on WhatsApp${b.phone ? ` (<strong>${esc(oneLine(b.phone))}</strong>)` : ""} with meeting-point details before your tour.</p>
<p style="margin:0 0 24px">Questions? Just reply to this email or message us on WhatsApp: <a href="https://wa.me/${SUPPORT_WHATSAPP.replace(/\D/g, "")}">${esc(SUPPORT_WHATSAPP)}</a></p>
<p style="margin:0;color:#666">Iconic Rome Tours · <a href="https://iconicrometours.com" style="color:#234f8b">iconicrometours.com</a></p>
</div>`;

    await transport.sendMail({
      from: process.env.SMTP_FROM || `"Iconic Rome Tours" <${process.env.SMTP_USER}>`,
      to,
      // Customer replies land with the owner.
      replyTo: NOTIFY_TO,
      subject: `Booking confirmed #${b.id} – Iconic Rome Tours`,
      text,
      html,
    });
    console.log(`[booking-email] Customer confirmation for booking #${b.id} sent.`);
  } catch (e) {
    console.error(`[booking-email] Failed to send customer confirmation for booking #${b.id}:`, e);
  }
}
