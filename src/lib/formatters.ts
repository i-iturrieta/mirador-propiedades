import type { Currency } from "@prisma/client";

const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const ufFormatter = new Intl.NumberFormat("es-CL", {
  maximumFractionDigits: 0,
});

export function formatPrice(
  price: number | string,
  currency: Currency | "CLP" | "UF",
): string {
  const value = typeof price === "string" ? Number(price) : price;
  if (currency === "UF") return `UF ${ufFormatter.format(value)}`;
  return clpFormatter.format(value);
}

export function formatArea(m2: number | null | undefined): string {
  if (m2 == null) return "—";
  return `${new Intl.NumberFormat("es-CL").format(m2)} m²`;
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("es-CL").format(n);
}

const operationLabels: Record<string, string> = {
  VENTA: "Venta",
  ARRIENDO: "Arriendo",
};

const typeLabels: Record<string, string> = {
  CASA: "Casa",
  DEPARTAMENTO: "Departamento",
  PARCELA: "Parcela",
  TERRENO: "Terreno",
  OFICINA: "Oficina",
};

const statusLabels: Record<string, string> = {
  DISPONIBLE: "Disponible",
  RESERVADA: "Reservada",
  ARRENDADA: "Arrendada",
  VENDIDA: "Vendida",
};

export const labelOperation = (op: string) => operationLabels[op] ?? op;
export const labelType = (t: string) => typeLabels[t] ?? t;
export const labelStatus = (s: string) => statusLabels[s] ?? s;
