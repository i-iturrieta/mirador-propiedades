import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.miradorpropiedades.cl";

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/propiedades`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/servicios`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/nosotros`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), priority: 0.6 },
  ];

  let propertyEntries: MetadataRoute.Sitemap = [];
  try {
    const properties = await prisma.property.findMany({
      where: { status: { in: ["DISPONIBLE", "RESERVADA"] } },
      select: { slug: true, updatedAt: true },
    });
    propertyEntries = properties.map((p) => ({
      url: `${baseUrl}/propiedades/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.8,
    }));
  } catch (e) {
    console.warn("[sitemap] DB unavailable, returning static entries only", e);
  }

  return [...staticEntries, ...propertyEntries];
}
