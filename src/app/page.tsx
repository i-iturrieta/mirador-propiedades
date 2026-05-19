import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import { SearchBar } from "@/components/home/SearchBar";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { ServicesTeaser } from "@/components/home/ServicesTeaser";
import { Reveal } from "@/components/ui/Reveal";
import type { PropertyWithImages } from "@/types/property";

export const revalidate = 300;

async function getFeatured(): Promise<PropertyWithImages[]> {
  try {
    return await prisma.property.findMany({
      where: { featured: true, status: { in: ["DISPONIBLE", "RESERVADA"] } },
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch (e) {
    console.warn("[home] DB not reachable, rendering without featured properties.", e);
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <>
      <Hero />
      <SearchBar />
      {featured.length > 0 && <FeaturedGrid properties={featured} />}

      {/* Trust / stats strip */}
      <Reveal>
        <section
          aria-label="En cifras"
          className="border-y border-border bg-bg-tint"
        >
          <div className="container-ultra py-16 lg:py-20 grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
            {[
              { value: "+12", label: "años en la región" },
              { value: "98%", label: "clientes que recomiendan" },
              { value: "6", label: "comunas de cobertura" },
              { value: "1:1", label: "atención personalizada" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="font-display text-5xl lg:text-6xl tracking-tight2 leading-none">
                  {s.value}
                </span>
                <span className="mt-4 text-[11px] tracking-[0.22em] uppercase text-muted">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <ServicesTeaser />

      {/* Editorial about block — full-bleed photo left, narrative right */}
      <section
        aria-labelledby="nosotras-heading"
        className="container-ultra py-24 lg:py-36"
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface img-zoom">
              <Image
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"
                alt="Vista panorámica del lago Llanquihue al amanecer con casa contemporánea"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6">
            <p className="eyebrow">Quiénes somos</p>
            <h2
              id="nosotras-heading"
              className="mt-6 display-lg text-balance"
            >
              Conocemos el sur
              <br />
              <span className="display-italic">porque vivimos aquí.</span>
            </h2>
            <p className="mt-8 max-w-prose text-muted text-base lg:text-lg leading-relaxed text-pretty">
              Somos una corredora pequeña, con foco en clientes que valoran tiempo, honestidad y
              continuidad. Cada propiedad la visitamos antes de publicarla, y cada cliente tiene un
              único interlocutor desde el primer mensaje al cierre.
            </p>

            <div className="mt-10 border-l-2 border-accent pl-6 py-2 max-w-prose">
              <p className="font-display italic text-xl lg:text-2xl leading-snug text-fg">
                “Buscábamos algo muy específico en Frutillar y nos guiaron sin presión. Cerramos en
                tres meses, todo claro desde el primer día.”
              </p>
              <footer className="mt-4 text-xs tracking-[0.18em] uppercase text-muted">
                Camila R. · Compradora 2024
              </footer>
            </div>

            <Link
              href="/nosotras"
              className="group mt-10 inline-flex items-center gap-3 text-sm tracking-wide text-fg"
            >
              <span className="link-underline">Conoce más sobre nosotras</span>
              <ArrowUpRight
                size={15}
                strokeWidth={1.5}
                className="transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Cinematic final CTA */}
      <section className="relative overflow-hidden bg-night text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2200&q=80"
            alt="Casa contemporánea con vista al lago al atardecer"
            fill
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/40" aria-hidden />
          <div className="noise-overlay absolute inset-0" aria-hidden />
        </div>

        <Reveal className="relative container-ultra py-28 lg:py-44">
          <p className="eyebrow text-white/55">Tasación gratuita</p>
          <h2 className="mt-6 display-xl text-balance max-w-[14ch] text-white">
            ¿Tienes una propiedad
            <br />
            <span className="display-italic text-white/85">para vender o arrendar?</span>
          </h2>
          <p className="mt-8 max-w-xl text-white/75 text-base lg:text-lg leading-relaxed">
            Te entregamos una tasación referencial sin compromiso y, si decides avanzar, nos
            encargamos del resto. Conversamos antes de cobrar.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-3 h-14 px-8 bg-white text-fg text-sm tracking-wide font-medium rounded-sm hover:bg-white/90 transition-colors duration-500"
            >
              Solicitar tasación
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="/servicios"
              className="group inline-flex items-center gap-3 h-14 px-8 border border-white/30 hover:border-white text-sm tracking-wide rounded-sm transition-colors duration-500"
            >
              Conocer servicios
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
