import { prisma } from "@/lib/prisma";

/**
 * Devuelve las comunas (ciudades) que efectivamente tienen propiedades
 * visibles en el sitio, ordenadas alfabéticamente. Se usa para poblar los
 * selectores de "Comuna" del buscador del home y de los filtros del catálogo,
 * de modo que solo se ofrezcan comunas con inventario real.
 *
 * El filtro de estado se alinea con el default del catálogo
 * (ver buildWhere en PropertiesResults.tsx). Si la DB no responde, devuelve
 * una lista vacía en lugar de romper el render.
 */
export async function getPropertyCities(): Promise<string[]> {
  try {
    const rows = await prisma.property.findMany({
      where: { status: { in: ["DISPONIBLE", "RESERVADA"] } },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    });
    return rows.map((r) => r.city);
  } catch (e) {
    console.warn("[getPropertyCities] DB unavailable", e);
    return [];
  }
}
