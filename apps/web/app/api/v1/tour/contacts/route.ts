import { prisma } from "@iconic/db";
import { serializeContact } from "@iconic/db/serialize";
import { json } from "../../_lib/helpers";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ detail: "Invalid JSON body." }, 400);
  }

  const errors: Record<string, string[]> = {};
  const str = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim() : "");
  const required = ["first_name", "last_name", "email", "message"];
  for (const field of required) {
    if (!str(field)) errors[field] = ["This field is required."];
  }
  if (Object.keys(errors).length > 0) return json(errors, 400);

  const contact = await prisma.contactRequest.create({
    data: {
      firstName: str("first_name"),
      lastName: str("last_name"),
      email: str("email"),
      phone: str("phone"),
      subject: str("subject"),
      message: str("message"),
    },
  });
  return json(serializeContact(contact), 201);
}
