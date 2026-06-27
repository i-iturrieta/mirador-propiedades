import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Filters } from "@/components/property/Filters";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";
import { SkeletonBox, PropertyGridSkeleton } from "@/components/ui/Skeleton";
import type { Prisma, Operation, PropertyType, PropertyStatus } from "@prisma/client";
import type { PropertyWithImages } from "@/types/property";

const PAGE_SIZE = 12;

export type SearchParams = {
  op?: string; tipo?: string; estado?: string; comuna?: string;
  dorms?: string; banos?: string; precioMin?: string; precioMax?: string;
  orden?: string; pagina?: string;
};

function buildWhere(sp: SearchParams): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};
  if (sp.op === "VENTA" || sp.op === "ARRIENDO") where.operation = sp.op as Operation;
  if (sp.tipo) where.type = sp.tipo as PropertyType;
  if (sp.estado) where.status = sp.estado as PropertyStatus;
  else where.status = { in: ["DISPONIBLE", "RESERVADA"] };
  if (sp.comuna) where.city = sp.comuna;
  if (sp.dorms) where.bedrooms = { gte: Number(sp.dorms) };
  if (sp.banos) where.bathrooms = { gte: Number(sp.banos) };
  const priceMin = sp.precioMin ? Number(sp.precioMin) : undefined;
  const priceMax = sp.precioMax ? Number(sp.precioMax) : undefined;
  if (priceMin != null || priceMax != null) {
    where.price = {};
    if (priceMin != null) where.price.gte = priceMin;
    if (priceMax != null) where.price.lte = priceMax;
  }
  return where;
}

function buildOrderBy(orden?: string): Prisma.PropertyOrderByWithRelationInput {
  if (orden === "precio-asc") return { price: "asc" };
  if (orden === "precio-desc") return { price: "desc" };
  return { createdAt: "desc" };
}

/** Fallback de carga: barra de filtros + grilla de 12 tarjetas skeleton. */
export function PropertiesResultsSkeleton() {
  return (
    <>
      <div className="border-y border-border">
        <div className="container-ultra flex items-center justify-between gap-4 py-5">
          <SkeletonBox className="h-6 w-48" />
          <SkeletonBox className="h-10 w-40" />
        </div>
        <div className="hidden md:block border-t border-border bg-bg-tint">
          <div className="container-ultra grid grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-2 py-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <SkeletonBox className="h-2.5 w-16" />
                <SkeletonBox className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container-ultra py-16 lg:py-24">
        <PropertyGridSkeleton count={12} />
      </div>
    </>
  );
}

/**
 * PropertiesResults — barra de filtros (con conteo) + grilla paginada.
 * Componente async aislado para streamear con <Suspense>: el header editorial
 * aparece al instante y este bloque llega cuando la DB responde.
 */
export async function PropertiesResults({ sp }: { sp: SearchParams }) {
  const page = Math.max(1, Number(sp.pagina) || 1);
  const where = buildWhere(sp);
  const orderBy = buildOrderBy(sp.orden);

  let total = 0;
  let properties: PropertyWithImages[] = [];
  let dbError: string | null = null;

  try {
    [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
    ]);
  } catch (e) {
    console.warn("[/propiedades] DB unavailable", e);
    dbError = "Estamos teniendo problemas para cargar las propiedades. Intenta nuevamente en unos minutos.";
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <Filters total={total} />

      <div className="container-ultra py-16 lg:py-24">
        {dbError ? (
          <p className="text-center text-muted py-20">{dbError}</p>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 lg:py-28">
            <p className="font-display text-3xl tracking-tight2">No hay coincidencias</p>
            <p className="mt-4 text-muted">No encontramos propiedades con esos filtros.</p>
            <Link
              href="/propiedades"
              className="mt-8 inline-flex items-center h-12 px-6 border border-fg hover:bg-fg hover:text-bg text-sm tracking-wide transition-colors rounded-sm"
            >
              Limpiar filtros
            </Link>
          </div>
        ) : (
          <>
            <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-16">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </Reveal>

            {totalPages > 1 && (
              <nav
                className="mt-20 lg:mt-28 flex items-center justify-center gap-2"
                aria-label="Paginación"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                  const params = new URLSearchParams();
                  for (const [k, v] of Object.entries(sp))
                    if (v && k !== "pagina") params.set(k, String(v));
                  if (n > 1) params.set("pagina", String(n));
                  const href = `/propiedades${params.size ? `?${params}` : ""}`;
                  const isCurrent = n === page;
                  return (
                    <Link
                      key={n}
                      href={href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={
                        isCurrent
                          ? "inline-flex items-center justify-center h-11 min-w-11 px-3 bg-fg text-bg text-sm rounded-sm"
                          : "inline-flex items-center justify-center h-11 min-w-11 px-3 border border-border hover:border-fg text-sm rounded-sm transition-colors"
                      }
                    >
                      {n}
                    </Link>
                  );
                })}
              </nav>
            )}
          </>
        )}
      </div>
    </>
  );
}
