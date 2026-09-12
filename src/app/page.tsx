import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { SearchBar } from "@/components/home/SearchBar";
import { FeaturedSection, FeaturedSkeleton } from "@/components/home/FeaturedSection";
import { ServicesTeaser } from "@/components/home/ServicesTeaser";
import { Reveal } from "@/components/ui/Reveal";
import { getPropertyCities } from "@/lib/cities";

export const revalidate = 300;

export default async function HomePage() {
  const cities = await getPropertyCities();

  return (
    <>
      <Hero />
      <SearchBar cities={cities} />
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>

      <ServicesTeaser />

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
          <p className="eyebrow text-white/55">Evaluación comercial</p>
          <h2 className="mt-6 display-xl text-balance max-w-[22ch] text-white">
            ¿Tienes una propiedad
            <br />
            <span className="display-italic text-white/85">para vender o arrendar?</span>
          </h2>
          <p className="mt-8 max-w-xl text-white/75 text-base lg:text-lg leading-relaxed">
            Te entregamos una evaluación comercial sin compromiso y, si decides avanzar, nos
            encargamos del resto.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-3 h-14 px-8 bg-white text-fg text-sm tracking-wide font-medium rounded-sm hover:bg-white/90 transition-colors duration-500"
            >
              Solicitar evaluación
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
