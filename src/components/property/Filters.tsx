"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type FiltersState = Record<string, string | undefined>;

function readState(params: URLSearchParams): FiltersState {
  return {
    op: params.get("op") ?? "",
    tipo: params.get("tipo") ?? "",
    estado: params.get("estado") ?? "",
    comuna: params.get("comuna") ?? "",
    dorms: params.get("dorms") ?? "",
    banos: params.get("banos") ?? "",
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
      {/* Top bar — count + orden + mobile filter trigger */}
      <div className="container-ultra flex items-center justify-between gap-4 py-5">
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
            className="md:hidden inline-flex items-center gap-2 h-10 px-4 border border-border hover:border-fg text-xs tracking-[0.18em] uppercase rounded-sm"
          >
            <SlidersHorizontal size={14} strokeWidth={1.5} />
            Filtros
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center bg-accent text-white text-[10px] px-1.5 rounded-sm">
                {activeCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-xs tracking-[0.18em] uppercase text-muted">Orden</span>
            <Select
              id="orden"
              className="h-10 text-sm w-auto min-w-[160px]"
              value={state.orden ?? "recientes"}
              onChange={(e) => update({ orden: e.target.value })}
            >
              <option value="recientes">Recientes</option>
              <option value="precio-asc">Precio ascendente</option>
              <option value="precio-desc">Precio descendente</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Inline desktop filter row */}
      <div className="hidden md:block border-t border-border bg-bg-tint">
        <div className="container-ultra grid grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-2 py-3">
          <FilterField label="Operación">
            <Select className="h-10" value={state.op ?? ""} onChange={(e) => update({ op: e.target.value })}>
              <option value="">Todas</option>
              <option value="VENTA">Venta</option>
              <option value="ARRIENDO">Arriendo</option>
            </Select>
          </FilterField>
          <FilterField label="Tipo">
            <Select className="h-10" value={state.tipo ?? ""} onChange={(e) => update({ tipo: e.target.value })}>
              <option value="">Todos</option>
              <option value="CASA">Casa</option>
              <option value="DEPARTAMENTO">Departamento</option>
              <option value="PARCELA">Parcela</option>
              <option value="TERRENO">Terreno</option>
              <option value="OFICINA">Oficina</option>
              <option value="COMERCIAL">Comercial</option>
            </Select>
          </FilterField>
          <FilterField label="Comuna">
            <Select className="h-10" value={state.comuna ?? ""} onChange={(e) => update({ comuna: e.target.value })}>
              <option value="">Todas</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </FilterField>
          <FilterField label="Dormitorios">
            <Select className="h-10" value={state.dorms ?? ""} onChange={(e) => update({ dorms: e.target.value })}>
              <option value="">Cualquiera</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={String(n)}>{n}+</option>
              ))}
            </Select>
          </FilterField>
          <FilterField label="Baños">
            <Select className="h-10" value={state.banos ?? ""} onChange={(e) => update({ banos: e.target.value })}>
              <option value="">Cualquiera</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={String(n)}>{n}+</option>
              ))}
            </Select>
          </FilterField>
          <FilterField label="Estado">
            <Select className="h-10" value={state.estado ?? ""} onChange={(e) => update({ estado: e.target.value })}>
              <option value="">Todos</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="RESERVADA">Reservada</option>
              <option value="VENDIDA">Vendida</option>
              <option value="ARRENDADA">Arrendada</option>
            </Select>
          </FilterField>
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
              <h2 className="font-display text-2xl tracking-tight2">Filtros</h2>
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
                <Select value={state.op ?? ""} onChange={(e) => update({ op: e.target.value })}>
                  <option value="">Todas</option>
                  <option value="VENTA">Venta</option>
                  <option value="ARRIENDO">Arriendo</option>
                </Select>
              </FilterField>
              <FilterField label="Tipo">
                <Select value={state.tipo ?? ""} onChange={(e) => update({ tipo: e.target.value })}>
                  <option value="">Todos</option>
                  <option value="CASA">Casa</option>
                  <option value="DEPARTAMENTO">Departamento</option>
                  <option value="PARCELA">Parcela</option>
                  <option value="TERRENO">Terreno</option>
                  <option value="OFICINA">Oficina</option>
                </Select>
              </FilterField>
              <FilterField label="Comuna">
                <Select value={state.comuna ?? ""} onChange={(e) => update({ comuna: e.target.value })}>
                  <option value="">Todas</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </FilterField>
              <div className="grid grid-cols-2 gap-5">
                <FilterField label="Dormitorios">
                  <Select value={state.dorms ?? ""} onChange={(e) => update({ dorms: e.target.value })}>
                    <option value="">Cualquiera</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={String(n)}>{n}+</option>
                    ))}
                  </Select>
                </FilterField>
                <FilterField label="Baños">
                  <Select value={state.banos ?? ""} onChange={(e) => update({ banos: e.target.value })}>
                    <option value="">Cualquiera</option>
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={String(n)}>{n}+</option>
                    ))}
                  </Select>
                </FilterField>
              </div>
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
              <FilterField label="Estado">
                <Select value={state.estado ?? ""} onChange={(e) => update({ estado: e.target.value })}>
                  <option value="">Todos</option>
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="RESERVADA">Reservada</option>
                  <option value="VENDIDA">Vendida</option>
                  <option value="ARRENDADA">Arrendada</option>
                </Select>
              </FilterField>
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

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] tracking-[0.22em] uppercase text-muted">{label}</span>
      {children}
    </label>
  );
}
