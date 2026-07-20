export type VideoProvider = "youtube" | "vimeo";
export type ParsedVideo = { provider: VideoProvider; id: string; embedUrl: string };

const YOUTUBE_ID = /^[a-zA-Z0-9_-]{11}$/;
const VIMEO_ID = /^\d{6,12}$/;

/**
 * Extrae { provider, id, embedUrl } de un enlace de YouTube o Vimeo pegado
 * en el admin. Soporta los formatos habituales de cada plataforma —
 * watch?v=, youtu.be, /embed/, /shorts/, /live/ para YouTube; vimeo.com/{id}
 * y enlaces privados vimeo.com/{id}/{hash} para Vimeo. Devuelve null si el
 * enlace no corresponde a ninguna de las dos plataformas.
 */
export function parseVideoUrl(input: string): ParsedVideo | null {
  if (!input) return null;
  const url = safeUrl(input.trim());
  if (!url) return null;

  const host = url.hostname.toLowerCase().replace(/^(www|m)\./, "");

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v && YOUTUBE_ID.test(v)) return youtube(v);

    const m = url.pathname.match(/^\/(?:embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
    return m ? youtube(m[1]) : null;
  }

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && YOUTUBE_ID.test(id) ? youtube(id) : null;
  }

  if (host === "vimeo.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    const secondLast = parts.length >= 2 ? parts[parts.length - 2] : null;

    // Enlace privado: vimeo.com/{id}/{hash}
    if (secondLast && VIMEO_ID.test(secondLast) && last) return vimeo(secondLast, last);
    if (last && VIMEO_ID.test(last)) return vimeo(last, url.searchParams.get("h"));
    return null;
  }

  if (host === "player.vimeo.com") {
    const m = url.pathname.match(/^\/video\/(\d{6,12})/);
    return m ? vimeo(m[1], url.searchParams.get("h")) : null;
  }

  return null;
}

function safeUrl(input: string): URL | null {
  try {
    return new URL(input);
  } catch {
    try {
      return new URL(`https://${input}`);
    } catch {
      return null;
    }
  }
}

function youtube(id: string): ParsedVideo {
  return {
    provider: "youtube",
    id,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
  };
}

function vimeo(id: string, hash?: string | null): ParsedVideo {
  const suffix = hash ? `&h=${hash}` : "";
  return {
    provider: "vimeo",
    id,
    embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1${suffix}`,
  };
}
