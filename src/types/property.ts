import type { Property, PropertyImage, Operation, PropertyType, PropertyStatus, Currency } from "@prisma/client";

export type PropertyWithImages = Property & { images: PropertyImage[] };

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
