import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal } from "@/components/ui/Reveal";
import {
  PropertiesResults,
  PropertiesResultsSkeleton,
  type SearchParams,
} from "./PropertiesResults";

export const metadata: Metadata = {
  title: "Propiedades en venta y arriendo · Los Lagos",
  description:
    "Casas, parcelas, departamentos y terrenos en venta y arriendo en la Región de Los Lagos. Filtra por comuna, precio, dormitorios y más.",
};

export default async function PropertiesPage({
  searchParams,
}: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;

  return (
    <>
      {/* Editorial header — aparece al instante, sin depender de la DB */}
      <header className="pt-32 lg:pt-44 pb-16 lg:pb-20 bg-bg-tint border-b border-border">
        <div className="container-ultra">
          <Reveal>
            <p className="eyebrow">Catálogo</p>
            <h1 className="mt-6 display-lg text-balance max-w-3xl">
              Propiedades en la
              <br />
              <span className="display-italic">Región de Los Lagos</span>
            </h1>
            <p className="mt-6 max-w-prose text-muted text-base lg:text-lg leading-relaxed">
              Casas, parcelas y proyectos seleccionados a mano. Filtra por comuna, tipo o precio
              para encontrar lo que buscas.
            </p>
          </Reveal>
        </div>
      </header>

      {/* Filtros + grilla — llegan por streaming cuando la DB responde */}
      <Suspense key={JSON.stringify(sp)} fallback={<PropertiesResultsSkeleton />}>
        <PropertiesResults sp={sp} />
      </Suspense>
    </>
  );
}
