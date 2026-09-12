import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative min-h-[calc(100svh-4rem)] flex items-center justify-center pt-28 lg:pt-36 pb-20 lg:pb-32 bg-bg overflow-hidden">
      <div className="container-ultra text-center">
        <p className="font-display text-[clamp(8rem,22vw,18rem)] leading-none tracking-tight2 text-fg/10 select-none">
          404
        </p>
        <p className="eyebrow justify-center -mt-8 lg:-mt-16 relative">
          Página no encontrada
        </p>
        <h1 className="mt-6 display-lg text-balance max-w-3xl mx-auto">
          Este lugar <span className="display-italic">no existe.</span>
        </h1>
        <p className="mt-6 text-muted max-w-prose mx-auto leading-relaxed">
          Es posible que la propiedad haya sido retirada o que el enlace haya cambiado.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 h-12 px-6 bg-fg text-bg hover:bg-ink text-sm tracking-wide rounded-sm transition-colors duration-500"
          >
            <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:-translate-x-0.5" />
            Volver al inicio
          </Link>
          <Link
            href="/propiedades"
            className="group inline-flex items-center gap-3 h-12 px-6 border border-fg hover:bg-fg hover:text-bg text-sm tracking-wide rounded-sm transition-colors duration-500"
          >
            Ver propiedades
            <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
