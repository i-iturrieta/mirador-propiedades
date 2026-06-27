"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { markerIcon } from "@/lib/leaflet-icon";
import "leaflet/dist/leaflet.css";

// Región de Los Lagos — centro por defecto cuando aún no hay coordenadas.
const DEFAULT_CENTER: [number, number] = [-41.32, -72.98];
const DEFAULT_ZOOM = 9;
const PIN_ZOOM = 15;

type Props = {
  lat?: number | null;
  lng?: number | null;
  onChange: (lat: number, lng: number) => void;
};

function ClickHandler({ onChange }: { onChange: Props["onChange"] }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function Recenter({ lat, lng }: { lat?: number | null; lng?: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) {
      map.setView([lat, lng], Math.max(map.getZoom(), PIN_ZOOM));
    }
  }, [lat, lng, map]);
  return null;
}

export default function LocationPickerMap({ lat, lng, onChange }: Props) {
  const hasPin = lat != null && lng != null;

  useEffect(() => {
    // ensure container reflows after mount
    const id = setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    return () => clearTimeout(id);
  }, []);

  return (
    <MapContainer
      center={hasPin ? [lat as number, lng as number] : DEFAULT_CENTER}
      zoom={hasPin ? PIN_ZOOM : DEFAULT_ZOOM}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onChange={onChange} />
      <Recenter lat={lat} lng={lng} />
      {hasPin && (
        <Marker
          position={[lat as number, lng as number]}
          icon={markerIcon}
          draggable
          eventHandlers={{
            dragend(e) {
              const { lat: la, lng: ln } = e.target.getLatLng();
              onChange(la, ln);
            },
          }}
        />
      )}
    </MapContainer>
  );
}
