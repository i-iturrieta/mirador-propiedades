import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce al equipo de Mirador Propiedades: una corredora boutique en las regiones de Los Ríos y Los Lagos, enfocada en atención cercana, transparencia y conocimiento real del territorio.",
};

type Member = {
  /** Vacío mientras sea un espacio reservado sin datos. */
  name?: string;
  role: string;
  /** Bajo el cargo: especialidad en la fundadora, zona en los ejecutivos. */
  detail?: string;
  /** Ruta dentro de /public. Sin foto, se muestra el marcador. */
  photo?: string;
};

/** Fundadora — va destacada arriba, como en el referente. */
const founder: Member = {
  name: "Alejandra Venegas",
  role: "Fundadora",
  // Sin zona: las locaciones quedan reservadas para los ejecutivos. Aquí va la
  // trayectoria, que es lo que distingue el rol.
  detail:
    "Corredora de propiedades y experta en marketing relacional. Fundadora de Mirador Propiedades, empresa que por más de 15 años se ha enfocado en la asesoría y gestión inmobiliaria.",
  photo: undefined,
};

/**
 * Resto del equipo. Dos espacios reservados para ejecutivos: sin nombre, sin
 * zona y sin foto hasta que lleguen los datos. Al completar `name`/`detail`/
 * `photo` la tarjeta se arma sola, sin tocar el layout.
 */
const team: Member[] = [
  { role: "Ejecutivo/a" },
  { role: "Ejecutivo/a" },
];

/** Marcador de retrato mientras no llega la foto definitiva. */
function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-2 text-ink"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        className="w-12 h-12 opacity-70"
      >
        <circle cx="12" cy="8.5" r="4" />
        <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" strokeLinecap="round" />
      </svg>
      <span className="text-[10px] font-medium tracking-[0.22em] uppercase">Foto pendiente</span>
    </div>
  );
}

function Portrait({ member, sizes }: { member: Member; sizes: string }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-surface border border-border img-zoom">
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name ? `${member.name} — ${member.role}` : member.role}
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      ) : (
        <PhotoPlaceholder
          label={
            member.name ? `Foto pendiente de ${member.name}` : `Foto pendiente — ${member.role}`
          }
        />
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Sin franja introductoria: la página entra directo al equipo. El pt
          compensa el header fijo, que antes cubría la sección anterior. */}
      <section
        aria-labelledby="equipo-heading"
        className="container-ultra pt-28 sm:pt-32 lg:pt-44 pb-14 sm:pb-20 lg:pb-28"
      >
        <Reveal>
          <p className="eyebrow">Nosotros</p>
          <h1 id="equipo-heading" className="mt-5 lg:mt-6 display-xl text-balance">
            Quiénes te <span className="display-italic">acompañan.</span>
          </h1>
        </Reveal>

        {/* Fundadora destacada: retrato a la izquierda, nombre y cargo al lado.
            En mobile se apila para no dejar el retrato gigante y solo. */}
        <Reveal
          delay={100}
          className="mt-10 lg:mt-16 grid sm:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center"
        >
          <div className="sm:col-span-5 lg:col-span-4 max-w-[280px] sm:max-w-none">
            <Portrait member={founder} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 40vw, 80vw" />
          </div>
          <div className="sm:col-span-7 lg:col-span-6">
            <span className="block h-px w-12 bg-accent" aria-hidden />
            <h2 className="mt-5 font-display text-3xl lg:text-4xl tracking-tight2">
              {founder.name}
            </h2>
            <p className="mt-3 text-sm font-medium tracking-[0.18em] uppercase text-accent">
              {founder.role}
            </p>
            {founder.detail && (
              <p className="mt-4 max-w-prose text-ink text-base leading-relaxed">
                {founder.detail}
              </p>
            )}
          </div>
        </Reveal>

        {team.length > 0 && (
          <Reveal
            stagger
            className={cn(
              "mt-14 lg:mt-20 grid grid-cols-2 gap-x-5 sm:gap-x-8 gap-y-10 lg:gap-y-14 border-t border-border pt-10 lg:pt-14",
              // Con pocas personas, cuatro columnas dejarían retratos diminutos
              // y media fila vacía: hasta tres se reparten en columnas anchas.
              team.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3 lg:max-w-4xl",
            )}
          >
            {team.map((m, i) => (
              <article key={m.name ?? `pendiente-${i}`}>
                <Portrait member={m} sizes="(min-width: 1024px) 25vw, 50vw" />
                {/* Sin nombre aún: una línea tenue mantiene la altura y el ritmo
                    de la tarjeta para que la grilla no quede desalineada. */}
                <h2 className="mt-5 font-display text-xl lg:text-2xl tracking-tight2 text-balance">
                  {m.name ?? <span className="text-muted">—</span>}
                </h2>
                <p className="mt-2 text-[11px] font-medium tracking-[0.18em] uppercase text-accent">
                  {m.role}
                </p>
                {m.detail && <p className="mt-2 text-ink text-sm leading-relaxed">{m.detail}</p>}
              </article>
            ))}
          </Reveal>
        )}
      </section>
    </>
  );
}
