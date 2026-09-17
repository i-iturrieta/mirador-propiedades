"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";

type Tab = "VENTA" | "ARRIENDO";

export function SearchBar({ cities }: { cities: string[] }) {
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
    <section aria-label="Búsqueda rápida" className="relative z-20 pb-10 sm:pb-14 lg:pb-24">
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
                    "relative px-7 h-16 text-[13px] tracking-[0.18em] uppercase font-medium transition-colors duration-300",
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
          <div className="grid grid-cols-1 md:grid-cols-[1fr,1.15fr,auto] divide-y md:divide-y-0 md:divide-x divide-border">
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
                { value: "COMERCIAL", label: "Comercial" },
              ]}
            />
            <button
              type="submit"
              className="group h-full min-h-[96px] px-8 lg:px-12 bg-fg text-bg hover:bg-ink transition-colors duration-300 flex items-center justify-center gap-3 text-base tracking-wide"
            >
              <Search size={18} strokeWidth={1.5} />
              <span>Buscar</span>
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-500 ease-out group-hover:translate-x-1"
              />
            </button>
          </div>
        </form>
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
    <label className="block px-6 lg:px-7 py-5">
      <span className="block text-[11px] tracking-[0.22em] uppercase text-muted font-medium">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent text-base lg:text-lg text-fg border-0 outline-none cursor-pointer appearance-none focus:ring-0 pr-8 bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2214%22%20height=%228%22%20viewBox=%220%200%2014%208%22%20fill=%22none%22><path%20d=%22M1%201L7%207L13%201%22%20stroke=%22%236b6b70%22%20stroke-width=%221.4%22/></svg>')] bg-no-repeat bg-[right_center]"
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
