"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Expand } from "lucide-react";

type GalleryImage = { url: string; alt: string };

export function Gallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className="aspect-[16/9] w-full bg-surface"
        aria-label={`Sin fotos para ${title}`}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-1.5 lg:gap-2 aspect-[16/9] overflow-hidden relative">
        <button
          type="button"
          className="col-span-4 md:col-span-2 row-span-2 relative bg-surface img-zoom group focus-visible:outline focus-visible:outline-2 focus-visible:outline-fg"
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          aria-label={`Abrir galería de ${title}`}
        >
          <Image
            src={images[0].url}
            alt={images[0].alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </button>
        {images.slice(1, 5).map((img, i) => (
          <button
            key={img.url}
            type="button"
            className="hidden md:block relative bg-surface img-zoom group focus-visible:outline focus-visible:outline-2 focus-visible:outline-fg"
            onClick={() => {
              setIndex(i + 1);
              setOpen(true);
            }}
            aria-label={`Ver imagen ${i + 2} de ${images.length}`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="group absolute bottom-4 right-4 inline-flex items-center gap-2 bg-bg/95 backdrop-blur px-4 py-3 text-xs tracking-[0.18em] uppercase font-medium hover:bg-fg hover:text-bg transition-colors rounded-sm shadow-soft"
        >
          <Expand size={14} strokeWidth={1.5} aria-hidden />
          Ver {images.length} fotos
        </button>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({ src: img.url, alt: img.alt, title: img.alt }))}
      />
    </>
  );
}
