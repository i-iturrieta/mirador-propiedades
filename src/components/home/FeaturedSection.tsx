import { prisma } from "@/lib/prisma";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { PropertyGridSkeleton, SkeletonBox } from "@/components/ui/Skeleton";
import type { PropertyWithImages } from "@/types/property";

async function getFeatured(): Promise<PropertyWithImages[]> {
  try {
    return await prisma.property.findMany({
      where: { featured: true, status: { in: ["DISPONIBLE", "RESERVADA"] } },
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch (e) {
    console.warn("[home] DB not reachable, rendering without featured properties.", e);
    return [];
  }
}

/**
 * FeaturedSection — bloque de propiedades destacadas. Componente async aislado
 * para poder streamearlo con <Suspense>: el resto del home aparece al instante
 * y la grilla llega cuando la DB responde.
 */
export async function FeaturedSection() {
  const featured = await getFeatured();
  if (featured.length === 0) return null;
  return <FeaturedGrid properties={featured} />;
}

/** Fallback de carga con la misma maquetación que FeaturedGrid. */
export function FeaturedSkeleton() {
  return (
    <section className="container-ultra pt-24 lg:pt-36 pb-24 lg:pb-32" aria-hidden>
      <div className="mb-14 lg:mb-20">
        <SkeletonBox className="h-3 w-28" />
        <SkeletonBox className="mt-6 h-10 w-80 max-w-full" />
        <SkeletonBox className="mt-6 h-4 w-full max-w-prose" />
      </div>
      <PropertyGridSkeleton count={6} />
    </section>
  );
}
