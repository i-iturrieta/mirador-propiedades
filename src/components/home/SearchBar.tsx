"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";

const cities = ["Frutillar", "Llanquihue", "Puerto Varas", "Puerto Montt", "Fresia", "Los Muermos"];

type Tab = "VENTA" | "ARRIENDO";

export function SearchBar() {
  const router = useRouter();
  const [op, setOp] = useState<Tab>("VENTA");
  const [tipo, setTipo] = useState("");
  const [comuna, setComuna] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("op", op);
    if (tipo) params.set("tipo", tipo);
    if (comuna) params.set("comuna", comuna);
    router.push(`/propiedades?${params}`);
  }

  return (
    <section aria-label="Búsqueda rápida" className="relative z-20">
      <div className="container-ultra">
        <form
          onSubmit={onSubmit}
          className="-mt-12 lg:-mt-16 relative bg-bg shadow-float rounded-sm overflow-hidden border border-border"
        >
          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["VENTA", "ARRIENDO"] as Tab[]).map((t) => {
              const active = op === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setOp(t)}
                  className={[
                    "relative px-7 h-14 text-[12px] tracking-[0.18em] uppercase font-medium transition-colors duration-300",
                    active ? "text-fg" : "text-muted hover:text-fg",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {t === "VENTA" ? "Comprar" : "Arrendar"}
                  <span
                    className={[
                      "absolute inset-x-7 -bottom-px h-0.5 transition-transform duration-500 ease-out origin-center",
                      active ? "bg-accent scale-x-100" : "bg-accent scale-x-0",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1fr,auto] divide-x divide-border">
            <SelectField
              label="Comuna"
              value={comuna}
              onChange={setComuna}
              placeholder="Cualquier comuna"
              options={cities.map((c) => ({ value: c, label: c }))}
            />
            <SelectField
              label="Tipo de propiedad"
              value={tipo}
              onChange={setTipo}
              placeholder="Todos los tipos"
              options={[
                { value: "CASA", label: "Casa" },
                { value: "DEPARTAMENTO", label: "Departamento" },
                { value: "PARCELA", label: "Parcela" },
                { value: "TERRENO", label: "Terreno" },
                { value: "OFICINA", label: "Oficina" },
              ]}
            />
            <button
              type="submit"
              className="group h-full min-h-[80px] px-8 lg:px-10 bg-fg text-bg hover:bg-ink transition-colors duration-300 flex items-center justify-center gap-3 text-sm tracking-wide"
            >
              <Search size={16} strokeWidth={1.5} />
              <span>Buscar</span>
              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-500 ease-out group-hover:translate-x-1"
              />
            </button>
          </div>
        </form>

        {/* Quick filter chips */}
        <div className="mt-6 flex flex-wrap gap-2 text-[12px]">
          <span className="text-muted tracking-[0.18em] uppercase mr-2 self-center">Búsquedas frecuentes</span>
          {[
            { label: "Casas en Frutillar", q: "?op=VENTA&tipo=CASA&comuna=Frutillar" },
            { label: "Parcelas en Puerto Varas", q: "?op=VENTA&tipo=PARCELA&comuna=Puerto+Varas" },
            { label: "Arriendos disponibles", q: "?op=ARRIENDO" },
          ].map((c) => (
            <a
              key={c.label}
              href={`/propiedades${c.q}`}
              className="inline-flex items-center px-3 h-8 border border-border hover:border-fg hover:bg-surface transition-colors duration-300 rounded-sm"
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block px-6 py-4">
      <span className="block text-[10px] tracking-[0.22em] uppercase text-muted font-medium">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-transparent text-sm text-fg border-0 outline-none cursor-pointer appearance-none focus:ring-0 pr-6 bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%226%22%20viewBox=%220%200%2010%206%22%20fill=%22none%22><path%20d=%22M1%201L5%205L9%201%22%20stroke=%22%236b6b70%22%20stroke-width=%221.2%22/></svg>')] bg-no-repeat bg-[right_center]"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
