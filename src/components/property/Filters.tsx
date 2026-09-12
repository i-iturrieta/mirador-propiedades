"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type FiltersState = Record<string, string | undefined>;

const PROPERTY_TYPES = [
  { value: "CASA", label: "Casa" },
  { value: "DEPARTAMENTO", label: "Departamento" },
  { value: "PARCELA", label: "Parcela" },
  { value: "TERRENO", label: "Terreno" },
  { value: "OFICINA", label: "Oficina" },
  { value: "COMERCIAL", label: "Comercial" },
];

/**
 * Campo de la tira de control del catálogo. Sin fondo ni borde propios: la
 * estructura la dan las celdas y sus filetes, igual que en el buscador del
 * hero. El `Select` base trae fondo blanco y borde inferior porque está pensado
 * para fondos blancos; aquí ambos estorban.
 */
const STRIP_SELECT =
  "mt-2 h-auto py-0 border-0 bg-transparent text-base lg:text-lg";

const SORT_OPTIONS = [
  { value: "recientes", label: "Recientes" },
  { value: "precio-asc", label: "Precio ascendente" },
  { value: "precio-desc", label: "Precio descendente" },
];

function readState(params: URLSearchParams): FiltersState {
  return {
    op: params.get("op") ?? "",
    tipo: params.get("tipo") ?? "",
    comuna: params.get("comuna") ?? "",
    precioMin: params.get("precioMin") ?? "",
    precioMax: params.get("precioMax") ?? "",
    orden: params.get("orden") ?? "recientes",
  };
}

export function Filters({ total, cities }: { total: number; cities: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FiltersState>(() => readState(params));

  useEffect(() => {
    setState(readState(params));
  }, [params]);

  function update(patch: Partial<FiltersState>) {
    const next = { ...state, ...patch };
    setState(next);
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (v && v !== "" && !(k === "orden" && v === "recientes")) {
        search.set(k, v);
      }
    }
    startTransition(() => {
      router.replace(`/propiedades${search.size ? `?${search}` : ""}`, { scroll: false });
    });
  }

  function reset() {
    setState({});
    startTransition(() => router.replace("/propiedades", { scroll: false }));
  }

  const activeCount = Object.entries(state).filter(
    ([k, v]) => v && v !== "" && !(k === "orden" && v === "recientes"),
  ).length;

  return (
    <div className="border-y border-border">
      {/* Tira de control (escritorio): cuatro celdas de peso parejo que ocupan
          todo el ancho, separadas por filetes. Es el mismo sistema que el
          buscador del hero, en su versión plana de catálogo. */}
      <div className="hidden md:block bg-bg-tint border-b border-border">
        <div className="container-ultra grid grid-cols-[0.85fr,1.15fr,1fr,1.1fr] divide-x divide-border">
          <StripField label="Operación">
            <Select
              className={STRIP_SELECT}
              value={state.op ?? ""}
              onChange={(e) => update({ op: e.target.value })}
            >
              <option value="">Todas</option>
              <option value="VENTA">Venta</option>
              <option value="ARRIENDO">Arriendo</option>
            </Select>
          </StripField>
          <StripField label="Tipo de propiedad">
            <Select
              className={STRIP_SELECT}
              value={state.tipo ?? ""}
              onChange={(e) => update({ tipo: e.target.value })}
            >
              <option value="">Todos los tipos</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </StripField>
          <StripField label="Comuna">
            <Select
              className={STRIP_SELECT}
              value={state.comuna ?? ""}
              onChange={(e) => update({ comuna: e.target.value })}
            >
              <option value="">Todas</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </StripField>
          <StripField label="Orden">
            <Select
              id="orden"
              className={STRIP_SELECT}
              value={state.orden ?? "recientes"}
              onChange={(e) => update({ orden: e.target.value })}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </StripField>
        </div>
      </div>

      {/* Resultado de esos controles: conteo y limpiar (+ acceso al cajón y al
          orden en móvil, donde la tira no se muestra). */}
      <div className="container-ultra flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-5">
        <p className="text-sm text-muted tracking-wide" aria-live="polite">
          {isPending ? (
            <span className="text-fg">Actualizando…</span>
          ) : (
            <>
              <span className="font-display text-xl text-fg tracking-tight2 mr-2">{total}</span>
              {total === 1 ? "propiedad disponible" : "propiedades disponibles"}
            </>
          )}
        </p>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-muted hover:text-fg transition-colors"
            >
              <X size={13} strokeWidth={1.5} />
              Limpiar ({activeCount})
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center gap-2 h-11 px-4 border border-border hover:border-fg text-xs tracking-[0.18em] uppercase rounded-sm"
          >
            <SlidersHorizontal size={14} strokeWidth={1.5} />
            Filtros
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center bg-accent text-white text-[10px] px-1.5 rounded-sm">
                {activeCount}
              </span>
            )}
          </button>
          {/* En escritorio el orden vive en la barra de filtros, no aquí */}
          <Select
            id="orden-movil"
            aria-label="Ordenar resultados"
            className="md:hidden h-11 text-sm w-auto"
            value={state.orden ?? "recientes"}
            onChange={(e) => update({ orden: e.target.value })}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filtros"
        >
          <div
            className="absolute inset-0 bg-night/55 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 bg-bg max-h-[90vh] overflow-y-auto rounded-t-lg animate-fade-up">
            <div className="sticky top-0 bg-bg flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-display text-2xl tracking-tight2 text-fg">Filtros</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="h-10 w-10 inline-flex items-center justify-center hover:bg-surface rounded-sm"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 gap-5">
              <FilterField label="Operación">
                <Select
                  className="h-14 text-base"
                  value={state.op ?? ""}
                  onChange={(e) => update({ op: e.target.value })}
                >
                  <option value="">Todas</option>
                  <option value="VENTA">Venta</option>
                  <option value="ARRIENDO">Arriendo</option>
                </Select>
              </FilterField>
              <FilterField label="Tipo de propiedad">
                <Select
                  className="h-14 text-base"
                  value={state.tipo ?? ""}
                  onChange={(e) => update({ tipo: e.target.value })}
                >
                  <option value="">Todos los tipos</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </Select>
              </FilterField>
              <FilterField label="Comuna">
                <Select
                  className="h-14 text-base"
                  value={state.comuna ?? ""}
                  onChange={(e) => update({ comuna: e.target.value })}
                >
                  <option value="">Todas</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </FilterField>
              <div className="grid grid-cols-2 gap-5">
                <FilterField label="Precio mín.">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={state.precioMin ?? ""}
                    onChange={(e) => update({ precioMin: e.target.value })}
                  />
                </FilterField>
                <FilterField label="Precio máx.">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={state.precioMax ?? ""}
                    onChange={(e) => update({ precioMax: e.target.value })}
                  />
                </FilterField>
              </div>
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-bg pb-2">
                <Button onClick={() => setOpen(false)} className="flex-1" size="lg">
                  Ver {total} resultados
                </Button>
                <Button variant="outline" onClick={reset} size="lg">
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Celda de la tira de control de escritorio. */
function StripField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    /* first/last sin relleno lateral: así el primer rótulo y el último chevron
       caen sobre el margen del contenedor, alineados con el título y el conteo.
       El ritmo interno entre celdas lo siguen dando los filetes. */
    <label className="block px-6 lg:px-8 first:pl-0 last:pr-0 py-5 cursor-pointer">
      <span className="block text-[11px] tracking-[0.22em] uppercase text-muted font-medium">
        {label}
      </span>
      {children}
    </label>
  );
}

/** Campo del cajón de filtros en móvil. */
function FilterField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[11px] tracking-[0.22em] uppercase text-muted">{label}</span>
      {children}
    </label>
  );
}
