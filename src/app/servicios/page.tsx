import type { Metadata } from "next";
import Link from "next/link";
import {
  Home, Handshake, ClipboardList, Map, Building2, BadgeCheck, ArrowUpRight,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Asesoría personalizada para compra, venta y arriendo de propiedades en el sur de Chile. Evaluación comercial, marketing, gestión legal y acompañamiento integral.",
};

const services = [
  {
    icon: Home,
    number: "01",
    title: "Búsqueda de hogar",
    description:
      "Detectamos tus necesidades para encontrar la opción perfecta para ti. Filtramos el mercado y pre-visitamos cada propiedad para que solo inviertas tiempo en las que realmente importan.",
  },
  {
    icon: Handshake,
    number: "02",
    title: "Venta de propiedades",
    description:
      "Evaluación comercial, plan de marketing (fotografía, ficha técnica, difusión segmentada), gestión de visitas, negociación y cierre con resguardo legal.",
  },
  {
    icon: Building2,
    number: "03",
    title: "Arriendo y administración",
    description:
      "Evaluación de antecedentes del candidato, contrato, entrega del inmueble y seguimiento durante el arriendo.",
  },
  {
    icon: ClipboardList,
    number: "04",
    title: "Evaluación comercial",
    description:
      "Realizamos un estudio comparativo de mercado y revisión de antecedentes de la propiedad para definir un valor comercial competitivo.",
  },
  {
    icon: Map,
    number: "05",
    title: "Asesoría a inversionistas",
    description:
      "Análisis de oportunidades de inversión en parcelas, departamentos y campos en el sur de Chile.",
  },
  {
    icon: BadgeCheck,
    number: "06",
    title: "Acompañamiento legal",
    description:
      "Coordinamos con abogados y notarías de confianza la revisión de títulos, escrituras, autorizaciones y cierre.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <header className="pt-28 sm:pt-32 lg:pt-44 pb-12 sm:pb-16 lg:pb-28 bg-bg-tint border-b border-border">
        <div className="container-ultra">
          <Reveal>
            <p className="eyebrow">Servicios</p>
            <h1 className="mt-5 lg:mt-6 display-xl text-balance max-w-4xl">
              Te acompañamos personalmente <br />
              <span className="display-italic">en cada paso del proceso.</span>
            </h1>
            <p className="mt-5 lg:mt-8 max-w-prose text-muted text-base lg:text-lg leading-relaxed">
              Transparencia, guía experta y atención directa en todo momento.
            </p>
          </Reveal>
        </div>
      </header>

      {/* Services grid — editorial cards */}
      <section className="container-ultra py-14 sm:py-20 lg:py-32">
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 sm:gap-y-14 lg:gap-y-20">
          {services.map((s) => (
            <article key={s.title} className="group border-t border-border pt-6 lg:pt-8 relative">
              <span className="absolute -top-px left-0 h-px w-12 bg-accent transition-all duration-700 ease-out group-hover:w-full" />
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center border border-border bg-bg rounded-sm">
                  <s.icon size={20} strokeWidth={1.5} aria-hidden />
                </div>
                <span className="font-display text-3xl text-muted/60">{s.number}</span>
              </div>
              <h2 className="mt-6 lg:mt-8 font-display text-2xl lg:text-3xl tracking-tight2">{s.title}</h2>
              <p className="mt-4 text-muted text-base leading-relaxed max-w-prose">
                {s.description}
              </p>
            </article>
          ))}
        </Reveal>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-bg-tint">
        <div className="container-ultra py-14 sm:py-20 lg:py-32">
          <Reveal>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-end">
              <div className="lg:col-span-8">
                <p className="eyebrow">Tu próximo paso</p>
                <h2 className="mt-5 lg:mt-6 display-lg text-balance">
                  ¿Tienes una propiedad <br />
                  <span className="display-italic">o estás buscando una?</span>
                </h2>
                <p className="mt-5 lg:mt-6 max-w-prose text-muted text-base lg:text-lg leading-relaxed">
                  Sin compromiso y sin guion: una llamada para entender qué estás buscando.
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
        </div>
      </section>
    </>
  );
}
