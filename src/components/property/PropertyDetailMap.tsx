"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/property/MapView"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 img-skeleton rounded" aria-hidden />,
});

export function PropertyDetailMap(props: { lat: number; lng: number; label: string }) {
  return (
    <div className="relative h-[360px] rounded overflow-hidden border border-border">
      <MapView {...props} />
    </div>
  );
}
