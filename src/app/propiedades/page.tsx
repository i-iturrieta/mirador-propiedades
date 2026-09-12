import type { Metadata } from "next";
import { Suspense } from "react";
import {
  PropertiesResults,
  PropertiesResultsSkeleton,
  type SearchParams,
} from "./PropertiesResults";

export const metadata: Metadata = {
  title: "Propiedades en venta y arriendo",
  description:
    "Casas, parcelas, departamentos y terrenos en venta y arriendo en el sur de Chile. Filtra por comuna, tipo de propiedad y precio.",
};

export default async function PropertiesPage({
  searchParams,
}: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;

  return (
    <>
      {/* Encabezado mínimo: la idea es llegar de inmediato a las propiedades */}
      <header className="pt-32 lg:pt-40 pb-8 lg:pb-10">
        <div className="container-ultra">
          <h1 className="display-md">Propiedades</h1>
        </div>
      </header>

      {/* Filtros + grilla — llegan por streaming cuando la DB responde */}
      <Suspense key={JSON.stringify(sp)} fallback={<PropertiesResultsSkeleton />}>
        <PropertiesResults sp={sp} />
      </Suspense>
    </>
  );
}
