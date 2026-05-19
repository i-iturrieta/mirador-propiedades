import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validations";
import { sendInquiryEmail } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, phone, message, propertyId, propertyTitle, website } = parsed.data;
  if (website && website.length > 0) {
    // Honeypot triggered: silently succeed.
    return NextResponse.json({ ok: true });
  }

  try {
    await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        propertyId: propertyId ?? null,
        source: propertyId ? "property" : "contact",
      },
    });
  } catch (e) {
    console.error("[api/contact] DB error", e);
    // Continue: we still try to email so the lead isn't lost.
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  let propertyUrl: string | null = null;
  if (propertyId) {
    const found = await prisma.property
      .findUnique({ where: { id: propertyId }, select: { slug: true } })
      .catch(() => null);
    if (found) propertyUrl = `${siteUrl}/propiedades/${found.slug}`;
  }

  await sendInquiryEmail({
    name,
    email,
    phone: phone || null,
    message,
    propertyTitle: propertyTitle ?? null,
    propertyUrl,
  });

  return NextResponse.json({ ok: true });
}
