import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Filters } from "@/components/property/Filters";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Prisma, Operation, PropertyType, PropertyStatus } from "@prisma/client";
import type { PropertyWithImages } from "@/types/property";

export const metadata: Metadata = {
  title: "Propiedades en venta y arriendo · Los Lagos",
  description:
    "Casas, parcelas, departamentos y terrenos en venta y arriendo en la Región de Los Lagos. Filtra por comuna, precio, dormitorios y más.",
};

const PAGE_SIZE = 12;

type SearchParams = {
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

export default async function PropertiesPage({
  searchParams,
}: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
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
      {/* Editorial header */}
      <header className="pt-32 lg:pt-44 pb-16 lg:pb-20 bg-bg-tint border-b border-border">
        <div className="container-ultra">
          <Reveal>
            <p className="eyebrow">Catálogo</p>
            <h1 className="mt-6 display-lg text-balance max-w-3xl">
              Propiedades en la
              <br />
              <span className="display-italic">Región de Los Lagos</span>
            </h1>
            <p className="mt-6 max-w-prose text-muted text-base lg:text-lg leading-relaxed">
              Casas, parcelas y proyectos seleccionados a mano. Filtra por comuna, tipo o precio
              para encontrar lo que buscas.
            </p>
          </Reveal>
        </div>
      </header>

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
