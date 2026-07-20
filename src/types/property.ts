import type { Property, PropertyImage, Operation, PropertyType, PropertyStatus, Currency } from "@prisma/client";

export type PropertyWithImages = Property & { images: PropertyImage[] };

/**
 * Forma de PropertyWithImages para cruzar a un Client Component: `price` es
 * Decimal (instancia de decimal.js), que React Server Components no acepta
 * como prop de un "use client" — hay que convertirlo a string antes.
 */
export type PropertyCardData = Omit<PropertyWithImages, "price"> & { price: string };

export type PropertyFilterParams = {
  q?: string;
  op?: Operation;
  tipo?: PropertyType;
  estado?: PropertyStatus;
  comuna?: string;
  dorms?: number;
  banos?: number;
  precioMin?: number;
  precioMax?: number;
  m2Min?: number;
  m2Max?: number;
  orden?: "recientes" | "precio-asc" | "precio-desc";
  pagina?: number;
};

export type { Operation, PropertyType, PropertyStatus, Currency };
