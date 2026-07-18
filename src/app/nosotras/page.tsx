import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Nosotras",
  description:
    "Conoce a Mirador Propiedades: una corredora personalizada en la Región de Los Lagos enfocada en atención cercana, transparencia y conocimiento real del territorio.",
};

const values = [
  {
    number: "01",
    title: "Conocimiento del territorio",
    description:
      "Vivimos en el sur. Conocemos los caminos, los barrios y los matices de cada comuna porque los recorremos cada semana.",
  },
  {
    number: "02",
    title: "Atención uno a uno",
    description:
      "Cada cliente tiene un único interlocutor. Sin call centers, sin formularios genéricos: una conversación directa de principio a fin.",
  },
  {
    number: "03",
    title: "Transparencia",
    description:
      "Decimos lo que pensamos del precio, del estado y de la oportunidad. Nuestro objetivo es que vuelvas, no cerrar una sola operación.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero — editorial */}
      <header className="pt-32 lg:pt-44 pb-20 lg:pb-28 bg-bg-tint border-b border-border overflow-hidden">
        <div className="container-ultra grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">Nosotras</p>
            <h1 className="mt-6 display-xl text-balance">
              Una corredora <br />
              <span className="display-italic">con raíces en el sur.</span>
            </h1>
            <p className="mt-8 max-w-prose text-muted text-base lg:text-lg leading-relaxed">
              Mirador Propiedades nace para acompañar de cerca a quienes buscan comprar, vender o
              arrendar en la Región de Los Lagos. Trabajamos con pocas propiedades a la vez, lo que
              nos permite conocerlas a fondo y dedicar tiempo real a cada cliente.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={150}>
            <div className="relative aspect-[4/5] overflow-hidden img-zoom">
              <Image
                src="https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=1400&q=80"
                alt="Profesional inmobiliaria revisando planos en oficina luminosa"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </header>

      {/* Manifest / values */}
      <section className="container-ultra py-24 lg:py-36" aria-labelledby="valores-heading">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">Cómo trabajamos</p>
            <h2 id="valores-heading" className="mt-6 display-lg text-balance">
              Lo que <span className="display-italic">defendemos.</span>
            </h2>
          </div>
        </Reveal>

        <Reveal stagger className="mt-16 lg:mt-20 grid md:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-12">
          {values.map((v) => (
            <article key={v.title} className="group border-t border-border pt-8 relative">
              <span className="absolute -top-px left-0 h-px w-12 bg-accent transition-all duration-700 ease-out group-hover:w-full" />
              <span className="font-display text-3xl text-muted/60">{v.number}</span>
              <h3 className="mt-6 font-display text-2xl lg:text-3xl tracking-tight2">{v.title}</h3>
              <p className="mt-4 text-muted text-base leading-relaxed max-w-prose">
                {v.description}
              </p>
            </article>
          ))}
        </Reveal>
      </section>

      {/* Quote */}
      <section className="border-y border-border bg-bg-tint">
        <Reveal className="container-ultra py-24 lg:py-32 text-center">
          <p className="eyebrow justify-center">Nuestra filosofía</p>
          <blockquote className="mt-8 mx-auto max-w-4xl">
            <p className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight2 text-balance">
              “Trabajamos cada propiedad
              <span className="display-italic"> como si fuera nuestra,</span>
              <br />
              porque la confianza es lo único que no se vende.”
            </p>
            <footer className="mt-10 text-xs tracking-[0.22em] uppercase text-muted">
              Alejandra · Fundadora
            </footer>
          </blockquote>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="container-ultra py-24 lg:py-32">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow">Conversemos</p>
              <h2 className="mt-6 display-lg text-balance">
                ¿Conversamos sobre <br />
                <span className="display-italic">tu próximo lugar?</span>
              </h2>
              <p className="mt-6 max-w-prose text-muted text-base lg:text-lg leading-relaxed">
                Cuéntanos qué buscas o qué quieres vender. Te respondemos personalmente en menos de un
                día hábil.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                href="/contacto"
                className="group inline-flex items-center justify-center gap-3 h-14 px-8 bg-fg text-bg hover:bg-ink text-sm tracking-wide rounded-sm transition-colors duration-500"
              >
                Escríbenos
                <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
