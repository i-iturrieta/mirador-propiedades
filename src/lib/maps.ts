export type LatLng = { lat: number; lng: number };

const NUM = "(-?\\d+(?:\\.\\d+)?)";

// Probados en orden de precisión: el primero que matchee gana.
const PATTERNS: RegExp[] = [
  // Coordenadas exactas del lugar: ...!3d-41.1247!4d-73.0408
  new RegExp(`!3d${NUM}!4d${NUM}`),
  // Vista del mapa: /@-41.1247,-73.0408,15z
  new RegExp(`@${NUM},${NUM}`),
  // Query params: ?q=lat,lng | query= | ll= | center= | destination=
  new RegExp(`[?&](?:q|query|ll|center|destination)=${NUM},\\s*${NUM}`),
  // Texto pegado directamente: "-41.12, -73.04"
  new RegExp(`^\\s*${NUM},\\s*${NUM}\\s*$`),
];

function inRange(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Extrae { lat, lng } de un enlace de Google Maps (largo) o de un par de
 * coordenadas pegado directamente. Devuelve null si no se puede parsear o si
 * los valores quedan fuera de rango.
 *
 * Los enlaces cortos (maps.app.goo.gl, goo.gl) no contienen coordenadas en la
 * URL — hay que resolver la redirección en el servidor (ver resolveMapsLink).
 */
export function parseLatLngFromMapsUrl(input: string): LatLng | null {
  if (!input) return null;
  const text = input.trim();

  for (const re of PATTERNS) {
    const m = text.match(re);
    if (m) {
      const lat = parseFloat(m[1]);
      const lng = parseFloat(m[2]);
      if (inRange(lat, lng)) return { lat, lng };
    }
  }
  return null;
}

const SHORT_LINK_HOSTS = ["maps.app.goo.gl", "goo.gl", "g.co"];

/** True si la URL es un enlace corto que necesita resolver la redirección. */
export function isShortMapsLink(input: string): boolean {
  try {
    const { hostname } = new URL(input.trim());
    return SHORT_LINK_HOSTS.some(
      (h) => hostname === h || hostname.endsWith(`.${h}`),
    );
  } catch {
    return false;
  }
}
