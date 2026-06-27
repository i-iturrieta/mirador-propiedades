"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertyFormSchema, type PropertyFormInput } from "@/lib/validations";
import { isShortMapsLink, parseLatLngFromMapsUrl, type LatLng } from "@/lib/maps";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
  return session.user;
}

/**
 * Extrae coordenadas de un enlace de Google Maps. Los enlaces largos se
 * parsean directamente; los cortos (maps.app.goo.gl, goo.gl) se resuelven
 * siguiendo la redirección para leer la URL final.
 */
export async function resolveMapsLink(url: string): Promise<LatLng | null> {
  await requireAdmin();

  const direct = parseLatLngFromMapsUrl(url);
  if (direct) return direct;

  if (!isShortMapsLink(url)) return null;

  try {
    const res = await fetch(url.trim(), { redirect: "follow" });
    return parseLatLngFromMapsUrl(res.url);
  } catch {
    return null;
  }
}

export async function createProperty(input: PropertyFormInput) {
  await requireAdmin();
  const parsed = propertyFormSchema.parse(input);

  let slug = slugify(parsed.title, { lower: true, strict: true });
  const existing = await prisma.property.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const { images, ...rest } = parsed;
  const property = await prisma.property.create({
    data: {
      ...rest,
      slug,
      images: { create: images.map((img, i) => ({ url: img.url, alt: img.alt, order: i })) },
    },
  });

  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${property.slug}`);
  revalidatePath("/");
  redirect(`/admin/propiedades/${property.id}?ok=created`);
}

export async function updateProperty(id: string, input: PropertyFormInput) {
  await requireAdmin();
  const parsed = propertyFormSchema.parse(input);

  const { images, ...rest } = parsed;
  const property = await prisma.property.update({
    where: { id },
    data: {
      ...rest,
      images: {
        deleteMany: {},
        create: images.map((img, i) => ({ url: img.url, alt: img.alt, order: i })),
      },
    },
  });

  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${property.slug}`);
  revalidatePath("/");
  redirect(`/admin/propiedades/${property.id}?ok=updated`);
}

export async function deleteProperty(id: string) {
  await requireAdmin();
  const p = await prisma.property.delete({ where: { id } });
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${p.slug}`);
  revalidatePath("/");
  redirect("/admin/propiedades");
}
