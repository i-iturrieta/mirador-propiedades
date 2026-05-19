import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, MapPin, Ruler, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/property/StatusBadge";
import { formatArea, formatPrice, labelOperation, labelType } from "@/lib/formatters";
import type { PropertyWithImages } from "@/types/property";

export function PropertyCard({ property }: { property: PropertyWithImages }) {
  const cover = property.images[0];
  const isAvailable = property.status === "DISPONIBLE";
  const href = `/propiedades/${property.slug}`;

  return (
    <article className="group relative flex flex-col bg-bg">
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden bg-surface img-zoom focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
        aria-label={`Ver ${property.title}`}
      >
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 img-skeleton" aria-hidden />
        )}

        {/* Subtle dark gradient for legibility of top badges + bottom price */}
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-night/40 to-transparent pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night/65 via-night/15 to-transparent pointer-events-none"
          aria-hidden
        />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
          <div className="flex gap-2">
            <Badge variant="ghost-light">{labelOperation(property.operation)}</Badge>
            {!isAvailable && <StatusBadge status={property.status} />}
          </div>
          <span className="hidden md:inline-flex h-9 w-9 items-center justify-center bg-white/0 group-hover:bg-white text-white group-hover:text-fg transition-colors duration-500 rounded-sm border border-white/0 group-hover:border-white">
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </span>
        </div>

        {/* Bottom title + price overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6 text-white pointer-events-none">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/75">
            {labelType(property.type)}
          </p>
          <h3 className="mt-2 font-display text-2xl lg:text-[26px] leading-tight tracking-tight2 text-balance">
            {property.title}
          </h3>
        </div>
      </Link>

      {/* Meta strip below image */}
      <div className="pt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-xs text-muted">
            <MapPin size={12} strokeWidth={1.5} aria-hidden />
            <span className="truncate">
              {property.city}
              {property.sector ? ` · ${property.sector}` : ""}
            </span>
          </p>

          <dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-fg/85">
            {property.bedrooms != null && (
              <div className="inline-flex items-center gap-1.5">
                <BedDouble size={14} strokeWidth={1.5} className="text-muted" aria-hidden />
                <dt className="sr-only">Dormitorios</dt>
                <dd>{property.bedrooms}</dd>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="inline-flex items-center gap-1.5">
                <Bath size={14} strokeWidth={1.5} className="text-muted" aria-hidden />
                <dt className="sr-only">Baños</dt>
                <dd>{property.bathrooms}</dd>
              </div>
            )}
            {property.builtArea != null && (
              <div className="inline-flex items-center gap-1.5">
                <Ruler size={14} strokeWidth={1.5} className="text-muted" aria-hidden />
                <dt className="sr-only">Construidos</dt>
                <dd>{formatArea(property.builtArea)}</dd>
              </div>
            )}
            {property.landArea != null && property.builtArea == null && (
              <div className="inline-flex items-center gap-1.5">
                <Ruler size={14} strokeWidth={1.5} className="text-muted" aria-hidden />
                <dt className="sr-only">Terreno</dt>
                <dd>{formatArea(property.landArea)}</dd>
              </div>
            )}
          </dl>
        </div>

        <p className="text-right shrink-0">
          <span className="block text-[10px] tracking-[0.22em] uppercase text-muted">Desde</span>
          <span className="mt-1 block font-display text-xl tracking-tight2 text-fg">
            {formatPrice(property.price.toString(), property.currency)}
          </span>
        </p>
      </div>
    </article>
  );
}
