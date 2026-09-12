import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce a Mirador Propiedades: una corredora personalizada en el sur de Chile enfocada en atención cercana, transparencia y conocimiento real del territorio.",
};

export default function AboutPage() {
  return (
    /* min-h + centrado vertical: al quedar una sola sección, así la página se
       lee como una portada deliberada y no como un bloque cortado. */
    <section className="pt-32 lg:pt-44 pb-24 lg:pb-36 overflow-hidden lg:min-h-[calc(100svh-7rem)] lg:flex lg:items-center">
      <div className="container-ultra w-full grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow">Nosotros</p>
          <h1 className="mt-6 display-xl text-balance">
            Una corredora <br />
            <span className="display-italic">con raíces en el sur.</span>
          </h1>
          <p className="mt-8 max-w-prose text-muted text-base lg:text-lg leading-relaxed">
            Mirador Propiedades nace para acompañar de cerca a quienes buscan comprar, vender o
            arrendar en el sur de Chile. Trabajamos con pocas propiedades a la vez, lo que nos
            permite conocerlas a fondo y dedicar tiempo real a cada cliente.
          </p>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:col-start-8" delay={150}>
          {/* Placeholder — reemplazar por la foto definitiva de la corredora */}
          <div
            role="img"
            aria-label="Espacio reservado para la foto de la corredora"
            className="relative aspect-[4/5] overflow-hidden bg-surface border border-border flex flex-col items-center justify-center gap-4 text-muted"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="w-16 h-16 opacity-40"
            >
              <circle cx="12" cy="8.5" r="4" />
              <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] tracking-[0.22em] uppercase opacity-60">
              Foto pendiente
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
