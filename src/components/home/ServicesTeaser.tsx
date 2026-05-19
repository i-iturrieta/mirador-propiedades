import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Home, Handshake, ClipboardList } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const services = [
  {
    icon: Home,
    number: "01",
    title: "Búsqueda de hogar",
    description:
      "Identificamos lo que buscas y te mostramos solo las propiedades que vale la pena visitar. Cada inmueble lo recorremos antes.",
  },
  {
    icon: Handshake,
    number: "02",
    title: "Venta y arriendo",
    description:
      "Tasación referencial, plan de marketing, gestión de visitas y cierre con resguardo legal. Sin sobresaltos.",
  },
  {
    icon: ClipboardList,
    number: "03",
    title: "Asesoría integral",
    description:
      "Coordinamos abogados, tasadores y bancos. Una sola interlocutora desde el primer mensaje al cierre.",
  },
];

export function ServicesTeaser() {
  return (
    <section
      aria-labelledby="servicios-heading"
      className="relative bg-night text-white overflow-hidden"
    >
      {/* Editorial photo strip */}
      <div className="absolute inset-y-0 right-0 hidden lg:block w-[42%] xl:w-[44%]">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80"
          alt="Interior contemporáneo con grandes ventanales hacia el paisaje"
          fill
          sizes="44vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/40 to-transparent" aria-hidden />
      </div>

      <div className="relative container-ultra py-24 lg:py-36">
        <div className="grid lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-7 max-w-2xl">
            <p className="eyebrow text-white/55">Cómo trabajamos</p>
            <h2
              id="servicios-heading"
              className="mt-6 display-lg text-balance text-white"
            >
              Asesoría boutique
              <br />
              <span className="display-italic text-white/85">de principio a fin.</span>
            </h2>
            <p className="mt-6 max-w-prose text-white/65 text-base lg:text-lg leading-relaxed">
              Atendemos pocas operaciones a la vez. Esto nos permite responder rápido, conocer cada
              propiedad a fondo, y trabajarla como si fuera nuestra.
            </p>
          </Reveal>
        </div>

        <Reveal stagger className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 lg:gap-x-12">
          {services.map((s) => (
            <article
              key={s.title}
              className="group relative border-t border-white/15 pt-8"
            >
              <span className="absolute -top-px left-0 h-px w-12 bg-accent transition-all duration-700 ease-out group-hover:w-full" />
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex h-11 w-11 items-center justify-center border border-white/20 group-hover:border-white transition-colors duration-500 rounded-sm">
                  <s.icon size={18} strokeWidth={1.5} aria-hidden />
                </div>
                <span className="font-display text-2xl text-white/40">{s.number}</span>
              </div>
              <h3 className="mt-8 font-display text-2xl tracking-tight2">{s.title}</h3>
              <p className="mt-3 text-white/65 text-sm leading-relaxed max-w-prose">
                {s.description}
              </p>
            </article>
          ))}
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-16 lg:mt-20">
            <Link
              href="/servicios"
              className="group inline-flex items-center gap-3 text-sm tracking-wide text-white/80 hover:text-white transition-colors"
            >
              <span>Conocer todos los servicios</span>
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
