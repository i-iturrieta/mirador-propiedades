import { SkeletonBox, PropertyGridSkeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton de la vista de catálogo. Se muestra al instante al entrar a
 * /propiedades, replicando el encabezado mínimo, la barra de filtros y la grilla.
 */
export default function Loading() {
  return (
    <>
      {/* Encabezado mínimo */}
      <header className="pt-32 lg:pt-40 pb-8 lg:pb-10">
        <div className="container-ultra">
          <SkeletonBox className="h-11 w-64 max-w-full" />
        </div>
      </header>

      {/* Tira de control + conteo */}
      <div className="border-y border-border">
        <div className="hidden md:block bg-bg-tint border-b border-border">
          <div className="container-ultra grid grid-cols-[0.85fr,1.15fr,1fr,1.1fr] divide-x divide-border">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="px-6 lg:px-8 first:pl-0 last:pr-0 py-5">
                <SkeletonBox className="h-2.5 w-24" />
                <SkeletonBox className="mt-3 h-6 w-3/4" />
              </div>
            ))}
          </div>
        </div>
        <div className="container-ultra flex items-center justify-between gap-4 py-5">
          <SkeletonBox className="h-6 w-48" />
          <SkeletonBox className="h-5 w-28" />
        </div>
      </div>

      {/* Grilla */}
      <div className="container-ultra pt-10 lg:pt-16 pb-24 lg:pb-32">
        <PropertyGridSkeleton count={12} />
      </div>
    </>
  );
}
