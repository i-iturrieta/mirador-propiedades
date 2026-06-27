import { cn } from "@/lib/utils";

/**
 * SkeletonBox — bloque de carga con el shimmer del design system (`img-skeleton`).
 * Usar para representar texto, imágenes o controles mientras se traen los datos.
 */
export function SkeletonBox({ className }: { className?: string }) {
  return <div className={cn("img-skeleton rounded-sm", className)} aria-hidden />;
}

/**
 * PropertyCardSkeleton — espejo de <PropertyCard> para estados de carga.
 * Replica la imagen 4/5, el caption editorial y la meta strip.
 */
export function PropertyCardSkeleton() {
  return (
    <div className="bg-bg" aria-hidden>
      {/* Imagen */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <div className="absolute inset-0 img-skeleton" />
      </div>

      {/* Caption editorial */}
      <div className="pt-5">
        <SkeletonBox className="h-2.5 w-20" />
        <SkeletonBox className="mt-3 h-5 w-4/5" />
        <SkeletonBox className="mt-2 h-5 w-3/5" />
      </div>

      {/* Meta strip */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <SkeletonBox className="h-3 w-2/5" />
          <div className="mt-3 flex gap-5">
            <SkeletonBox className="h-3.5 w-8" />
            <SkeletonBox className="h-3.5 w-8" />
            <SkeletonBox className="h-3.5 w-10" />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <SkeletonBox className="h-2.5 w-10 ml-auto" />
          <SkeletonBox className="mt-1.5 h-5 w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * PropertyGridSkeleton — grilla de tarjetas skeleton con la misma maquetación
 * que la grilla real de propiedades.
 */
export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-16">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
