import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Banda editorial "Cómo trabajamos". Va en claro (bg-tint) a propósito: el
 * único bloque oscuro de la mitad inferior del home debe ser el CTA final,
 * para que no se encadenen tres superficies negras seguidas hasta el footer.
 */
export function ServicesTeaser() {
  return (
    <section
      aria-labelledby="servicios-heading"
      className="border-y border-border bg-bg-tint"
    >
      <div className="container-ultra py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          <Reveal className="lg:col-span-6 xl:col-span-5">
            <p className="eyebrow">Cómo trabajamos</p>
            <h2 id="servicios-heading" className="mt-6 display-lg text-balance">
              Asesoría personalizada
              <br />
              <span className="display-italic">de principio a fin.</span>
            </h2>
            <p className="mt-7 max-w-prose text-muted text-base lg:text-lg leading-relaxed">
              Atendemos pocas operaciones a la vez. Esto nos permite responder rápido, conocer cada
              propiedad a fondo, y trabajarla como si fuera nuestra.
            </p>

            <Link
              href="/servicios"
              className="group mt-10 inline-flex items-center gap-3 text-sm tracking-wide text-fg"
            >
              <span className="link-underline">Conocer todos los servicios</span>
              <ArrowUpRight
                size={15}
                strokeWidth={1.5}
                className="transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Reveal>

          <Reveal className="lg:col-span-6 xl:col-span-6 xl:col-start-7" delay={150}>
            <div className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden bg-surface img-zoom">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80"
                alt="Casa contemporánea de líneas rectas con piscina exterior"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
