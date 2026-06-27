import { SkeletonBox, PropertyGridSkeleton } from "@/components/ui/Skeleton";

/**
 * Fallback global de carga. Se muestra al instante al navegar a cualquier ruta
 * sin loading propio, mientras el servidor renderiza la página.
 */
export default function Loading() {
  return (
    <>
      {/* Hero placeholder */}
      <div className="relative h-[70vh] min-h-[520px] bg-surface overflow-hidden">
        <div className="absolute inset-0 img-skeleton" aria-hidden />
        <div className="container-ultra relative h-full flex flex-col justify-end pb-20">
          <SkeletonBox className="h-3 w-28" />
          <SkeletonBox className="mt-6 h-12 w-3/4 max-w-2xl" />
          <SkeletonBox className="mt-3 h-12 w-1/2 max-w-xl" />
        </div>
      </div>

      {/* Grid placeholder */}
      <div className="container-ultra py-24 lg:py-32">
        <SkeletonBox className="h-3 w-24" />
        <SkeletonBox className="mt-6 h-9 w-72 max-w-full" />
        <div className="mt-14 lg:mt-20">
          <PropertyGridSkeleton count={6} />
        </div>
      </div>
    </>
  );
}
