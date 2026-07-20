import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";
import type { PropertyWithImages } from "@/types/property";

export function FeaturedGrid({ properties }: { properties: PropertyWithImages[] }) {
  return (
    <section
      className="container-ultra pt-24 lg:pt-36 pb-24 lg:pb-32"
      aria-labelledby="destacadas-heading"
    >
      <Reveal>
        <div className="flex items-end justify-between gap-10 flex-wrap mb-14 lg:mb-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Selección curada</p>
            <h2
              id="destacadas-heading"
              className="mt-6 display-lg text-balance"
            >
              Propiedades <span className="display-italic">destacadas</span>
            </h2>
            <p className="mt-6 max-w-prose text-muted text-base lg:text-lg leading-relaxed">
              Cada propiedad la visitamos antes de publicarla. Una selección breve, pensada para
              quienes prefieren calidad antes que catálogo.
            </p>
          </div>
          <Link
            href="/propiedades"
            className="group inline-flex items-center gap-3 h-12 px-5 border border-fg/15 hover:border-fg hover:bg-fg hover:text-bg transition-colors duration-500 text-sm rounded-sm"
          >
            <span>Ver catálogo completo</span>
            <ArrowUpRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </Reveal>

      <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-16">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={{ ...p, price: p.price.toString() }} />
        ))}
      </Reveal>
    </section>
  );
}
