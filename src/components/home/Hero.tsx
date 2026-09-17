import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";

export function Hero() {
  return (
    <section
      aria-label="Mirador Propiedades — corredora personalizada en el sur de Chile"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-night text-white"
    >
      {/* Carrusel de portada con fotos principales cambiantes */}
      <HeroCarousel />

      {/* Top meta strip — bajo el header fijo */}
      <div className="relative z-10 pt-28 lg:pt-40">
        <div className="container-ultra">
          {/* whitespace-nowrap + wrap: sin esto, en 390px los dos rótulos se
              comprimen y parten en dos columnas apretadas. Bajo `sm` basta el
              primero; el párrafo del hero ya dice "sur de Chile". */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-[0.22em] uppercase text-white/80 animate-fade-in">
            <span className="inline-block h-px w-10 bg-white/50" />
            <span className="whitespace-nowrap">Corredora personalizada</span>
            <span className="hidden sm:inline text-white/40">·</span>
            <span className="hidden sm:inline whitespace-nowrap">Sur de Chile</span>
          </div>
        </div>
      </div>

      {/* Main content.
          Sin marquesina de comunas al borde inferior: la tarjeta de búsqueda la
          tapaba casi entera. Las comunas se nombran en el párrafo, en el menú
          móvil y en el footer. */}
      <div className="relative z-10 container-ultra mt-8 lg:mt-14">
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
          className="mt-6 lg:mt-8 max-w-xl text-base lg:text-lg text-white/90 leading-relaxed animate-fade-up drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]"
          style={{ animationDelay: "300ms" }}
        >
          Seleccionamos las mejores propiedades en las regiones de Los Ríos y Los Lagos.
        </p>

        {/* Dos CTA apilados del mismo ancho: "Quiero vender/arrendar" va justo debajo de
            "Explorar propiedades" y con el mismo estilo. En columna para que en
            mobile no queden lado a lado comprimidos. */}
        <div
          className="mt-8 lg:mt-12 flex flex-col items-start gap-3 animate-fade-up"
          style={{ animationDelay: "440ms" }}
        >
          <Link
            href="/propiedades"
            className="group inline-flex w-full sm:w-[18rem] items-center justify-between gap-3 h-14 px-7 bg-white text-fg text-sm tracking-wide font-medium rounded-sm hover:bg-white/90 transition-colors duration-500"
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
            className="group inline-flex w-full sm:w-[18rem] items-center justify-between gap-3 h-14 px-7 bg-white text-fg text-sm tracking-wide font-medium rounded-sm hover:bg-white/90 transition-colors duration-500"
          >
            Quiero vender/arrendar
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-500 ease-out group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
