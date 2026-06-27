import { SkeletonBox } from "@/components/ui/Skeleton";

/**
 * Loading neutro para el panel admin — evita que el skeleton de marketing del
 * loading.tsx raíz se filtre en estas vistas.
 */
export default function Loading() {
  return (
    <div className="p-6 lg:p-10">
      <SkeletonBox className="h-3 w-24" />
      <SkeletonBox className="mt-4 h-8 w-64 max-w-full" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
