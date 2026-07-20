"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/property/StatusBadge";
import { formatArea, formatPrice, labelOperation, labelType } from "@/lib/formatters";
import type { PropertyCardData } from "@/types/property";

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const cover = property.images[0];
  const isAvailable = property.status === "DISPONIBLE";
  const href = `/propiedades/${property.slug}`;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <article className="relative bg-bg">
      <Link
        href={href}
        aria-label={`Ver ${property.title}`}
        onClick={() => setIsLoading(true)}
        className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
      >
        {/* Image area */}
        <div className="relative aspect-[4/5] overflow-hidden bg-surface img-zoom">
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

          {/* Top-left badges */}
          <div className="absolute top-4 left-4 flex items-start gap-2">
            <Badge variant="ghost-light">{labelOperation(property.operation)}</Badge>
            {!isAvailable && <StatusBadge status={property.status} />}
          </div>

          {/* Top-right action button (arrow → spinner on click) */}
          <span className="absolute top-4 right-4 hidden md:inline-flex h-9 w-9 items-center justify-center bg-white/0 group-hover:bg-white text-white group-hover:text-fg transition-colors duration-500 rounded-sm border border-white/0 group-hover:border-white">
            {isLoading ? (
              <span className="h-[18px] w-[18px] rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <ArrowUpRight size={15} strokeWidth={1.5} />
            )}
          </span>

          {/* Dim overlay on click */}
          <div
            className={`absolute inset-0 bg-black/25 transition-opacity duration-200 pointer-events-none ${
              isLoading ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
          />
        </div>

        {/* Editorial caption */}
        <div className="pt-5">
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
            {labelType(property.type)}
          </p>
          <h3 className="mt-2 font-display text-xl lg:text-[22px] leading-tight tracking-tight2 text-balance text-fg transition-colors duration-500 group-hover:text-accent">
            {property.title}
          </h3>
        </div>

        {/* Meta strip */}
        <div className="mt-4 flex items-start justify-between gap-4">
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
              {formatPrice(property.price, property.currency)}
            </span>
          </p>
        </div>

        {/* Accent line: slides in on hover, shimmers on click */}
        <span
          aria-hidden
          className={`absolute inset-x-0 -bottom-px h-px origin-left transition-transform duration-500 ease-out ${
            isLoading
              ? "scale-x-100 card-loading-bar"
              : "scale-x-0 group-hover:scale-x-100 bg-accent"
          }`}
        />
      </Link>
    </article>
  );
}
