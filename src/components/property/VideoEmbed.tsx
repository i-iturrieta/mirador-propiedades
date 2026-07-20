"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { parseVideoUrl } from "@/lib/video";

type Props = {
  videoUrl: string;
  poster?: string;
  title: string;
};

/**
 * Facade de video: muestra la portada + botón de play y solo monta el
 * iframe de YouTube/Vimeo cuando la persona hace click. Así el detalle de
 * la propiedad no paga el costo de carga del reproductor de terceros hasta
 * que alguien realmente quiere verlo — clave para que cargue rápido en móvil.
 */
export function VideoEmbed({ videoUrl, poster, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const video = parseVideoUrl(videoUrl);

  if (!video) return null;

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-surface">
      {playing ? (
        <iframe
          src={video.embedUrl}
          title={`Video de ${title}`}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-fg"
          aria-label={`Reproducir video de ${title}`}
        >
          {poster ? (
            <Image
              src={poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-night" aria-hidden />
          )}
          <div
            className="absolute inset-0 bg-night/25 transition-colors duration-500 group-hover:bg-night/40"
            aria-hidden
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-bg/95 shadow-soft transition-transform duration-500 group-hover:scale-105">
              <Play
                size={22}
                strokeWidth={1.5}
                fill="currentColor"
                className="translate-x-0.5 text-fg"
                aria-hidden
              />
            </span>
          </span>
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-bg/95 backdrop-blur px-4 py-3 text-xs tracking-[0.18em] uppercase font-medium rounded-sm shadow-soft">
            Ver video
          </span>
        </button>
      )}
    </div>
  );
}
