import { SkeletonBox, PropertyGridSkeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton de la vista de catálogo. Se muestra al instante al entrar a
 * /propiedades, replicando el header editorial, la barra de filtros y la grilla.
 */
export default function Loading() {
  return (
    <>
      {/* Header editorial */}
      <header className="pt-32 lg:pt-44 pb-16 lg:pb-20 bg-bg-tint border-b border-border">
        <div className="container-ultra">
          <SkeletonBox className="h-3 w-24" />
          <SkeletonBox className="mt-6 h-12 w-3/4 max-w-2xl" />
          <SkeletonBox className="mt-3 h-12 w-1/2 max-w-xl" />
          <SkeletonBox className="mt-6 h-4 w-full max-w-prose" />
          <SkeletonBox className="mt-2 h-4 w-2/3 max-w-prose" />
        </div>
      </header>

      {/* Barra de filtros */}
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

      {/* Grilla */}
      <div className="container-ultra py-16 lg:py-24">
        <PropertyGridSkeleton count={12} />
      </div>
    </>
  );
}
