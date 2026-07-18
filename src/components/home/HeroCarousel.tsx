"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Fotos de portada del hero. Placeholders de Unsplash por ahora.
 * TODO: reemplazar por las fotos reales que entregue el dueño (portadas
 * principales de propiedades). Mantener 3-5 imágenes horizontales de alta
 * calidad; la primera es la que se muestra con `priority`.
 */
const slides = [
  {
    src: "https://img.miradorpropiedades.cl/web/Fondo-mirador-1.png",
    alt: "Panorámica del lago Llanquihue con el volcán Osorno al fondo, desde la costanera de Frutillar. Fotografía de portada de Mirador Propiedades.",
  },
];

const INTERVAL_MS = 5000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    // Respetar prefers-reduced-motion: si el usuario lo pide, no autoavanzar.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0">
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className={[
            "object-cover scale-[1.02] motion-safe:will-change-transform transition-opacity duration-1000 ease-out",
            i === active ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      ))}

      {/* Capa base sólida — asegura legibilidad incluso en imágenes claras */}
      <div className="absolute inset-0 bg-night/45" aria-hidden />
      {/* Viñeteo lateral cinematográfico hacia el texto (izquierda) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-night/85 via-night/55 to-transparent"
        aria-hidden
      />
      {/* Cierre inferior — asegura contraste del marquee */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/90 via-night/55 to-transparent"
        aria-hidden
      />
    </div>
  );
}
