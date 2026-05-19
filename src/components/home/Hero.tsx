import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";

const locations = ["Frutillar", "Llanquihue", "Puerto Varas", "Puerto Montt", "Fresia", "Los Muermos"];

export function Hero() {
  return (
    <section
      aria-label="Mirador Propiedades — corredora boutique en Los Lagos"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-night text-white"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"
          alt="Casa contemporánea con grandes ventanales frente al paisaje del sur de Chile"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-[1.02] animate-fade-in motion-safe:will-change-transform"
        />
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

      {/* Top meta strip — bajo el header fijo */}
      <div className="relative z-10 pt-32 lg:pt-40">
        <div className="container-ultra">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-white/80 animate-fade-in">
            <span className="inline-block h-px w-10 bg-white/50" />
            <span>Corredora boutique</span>
            <span className="text-white/40">·</span>
            <span>Región de Los Lagos</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container-ultra mt-10 lg:mt-14">
        <h1
          className="display-xl text-white text-balance max-w-[18ch] animate-fade-up drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
          style={{ animationDelay: "120ms" }}
        >
          Hogares con
          <br />
          vista al sur
          <span className="text-accent">.</span>
        </h1>

        <p
          className="mt-8 max-w-xl text-base lg:text-lg text-white/90 leading-relaxed animate-fade-up drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]"
          style={{ animationDelay: "300ms" }}
        >
          Seleccionamos propiedades en Frutillar, Llanquihue, Puerto Varas y el resto de la Región
          de Los Lagos. Asesoría personal, sin guion, a tu ritmo.
        </p>

        <div
          className="mt-12 flex flex-wrap items-center gap-4 animate-fade-up"
          style={{ animationDelay: "440ms" }}
        >
          <Link
            href="/propiedades"
            className="group inline-flex items-center gap-3 h-14 px-7 bg-white text-fg text-sm tracking-wide font-medium rounded-sm hover:bg-white/90 transition-colors duration-500"
          >
            Explorar propiedades
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-500 ease-out group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/contacto"
            className="group inline-flex items-center gap-3 h-14 px-7 border border-white/50 hover:border-white hover:bg-white/10 text-sm tracking-wide rounded-sm transition-colors duration-500"
          >
            Solicitar tasación
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" />
          </Link>
        </div>
      </div>

      {/* Bottom strip — locations marquee */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-night/70 backdrop-blur-sm animate-fade-up"
        style={{ animationDelay: "600ms" }}
      >
        <div className="container-ultra py-5 flex items-center gap-8 text-[11px] tracking-[0.22em] uppercase">
          <span className="inline-flex items-center gap-2 text-white/70 shrink-0">
            <MapPin size={12} strokeWidth={1.5} />
            <span>Operamos en</span>
          </span>
          <div className="relative overflow-hidden flex-1">
            <div className="flex items-center gap-12 marquee-track whitespace-nowrap text-white/90 will-change-transform">
              {[...locations, ...locations, ...locations].map((c, i) => (
                <span key={i} className="inline-flex items-center gap-12">
                  {c}
                  <span className="inline-block h-1 w-1 rounded-full bg-white/50" />
                </span>
              ))}
            </div>
            {/* edge fades */}
            <span className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-night to-transparent" />
            <span className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-night to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
