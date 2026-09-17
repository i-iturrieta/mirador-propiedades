import { SkeletonBox } from "@/components/ui/Skeleton";

/**
 * Skeleton de la ficha de propiedad. Replica breadcrumb, galería, título,
 * specs y la columna de contacto mientras se traen los datos.
 */
export default function Loading() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-28 lg:pt-36 pb-6 border-b border-border bg-bg-tint">
        <div className="container-ultra flex items-center justify-between gap-3">
          <SkeletonBox className="h-3 w-64 max-w-full" />
          <SkeletonBox className="h-3 w-32 hidden sm:block" />
        </div>
      </div>

      {/* Galería */}
      <div className="container-ultra py-8 lg:py-10">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 lg:gap-3 aspect-[16/10]">
          <SkeletonBox className="col-span-4 row-span-2 lg:col-span-2 h-full" />
          <SkeletonBox className="hidden lg:block h-full" />
          <SkeletonBox className="hidden lg:block h-full" />
          <SkeletonBox className="hidden lg:block h-full" />
          <SkeletonBox className="hidden lg:block h-full" />
        </div>
      </div>

      {/* Título + precio */}
      <div className="container-ultra pb-12">
        <div className="flex gap-2.5">
          <SkeletonBox className="h-7 w-20" />
          <SkeletonBox className="h-7 w-24" />
        </div>
        <div className="mt-8 grid lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <SkeletonBox className="h-10 w-3/4" />
            <SkeletonBox className="mt-4 h-4 w-40" />
          </div>
          <div className="lg:col-span-4">
            <SkeletonBox className="h-9 w-40 lg:ml-auto" />
          </div>
        </div>
      </div>

      {/* Detalle: specs + contacto */}
      <div className="container-ultra pb-14 sm:pb-20 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6 border-y border-border py-8 lg:py-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <SkeletonBox className="h-5 w-5" />
                  <SkeletonBox className="mt-3 h-2.5 w-20" />
                  <SkeletonBox className="mt-2 h-6 w-12" />
                </div>
              ))}
            </div>
            <div className="mt-14 space-y-3">
              <SkeletonBox className="h-3 w-24" />
              <SkeletonBox className="h-8 w-56" />
              <SkeletonBox className="mt-6 h-4 w-full max-w-prose" />
              <SkeletonBox className="h-4 w-full max-w-prose" />
              <SkeletonBox className="h-4 w-2/3 max-w-prose" />
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="bg-bg-tint border border-border p-7 lg:p-8 rounded-sm">
              <SkeletonBox className="h-3 w-20" />
              <SkeletonBox className="mt-4 h-7 w-48" />
              <SkeletonBox className="mt-3 h-4 w-full" />
              <div className="mt-7 space-y-4">
                <SkeletonBox className="h-11 w-full" />
                <SkeletonBox className="h-11 w-full" />
                <SkeletonBox className="h-24 w-full" />
                <SkeletonBox className="h-12 w-full" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
