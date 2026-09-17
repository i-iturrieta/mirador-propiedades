import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Cloudflare R2 bucket served via custom domain
      { protocol: "https", hostname: "img.miradorpropiedades.cl" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
  async redirects() {
    return [
      // La sección pasó a llamarse "Nosotros"; se conserva el enlace anterior.
      { source: "/nosotras", destination: "/nosotros", permanent: true },

      /*
       * El sitio vive en UN dominio: www.miradorpropiedades.cl.
       *
       * Los dos .vercel.app de abajo servían el sitio completo, con 200 y
       * robots.txt en `Allow: /`, o sea tres copias indexables del mismo
       * contenido sin ninguna etiqueta canonical que dijera cuál manda. Google
       * todavía no había indexado ninguna — se alcanzó a cerrar antes.
       *
       * Se listan por host exacto a propósito: los dominios de preview llevan
       * la rama en el nombre (…-git-rama-….vercel.app) y no coinciden, así que
       * las previews siguen funcionando como siempre.
       */
      {
        source: "/:path*",
        has: [{ type: "host", value: "mirador-propiedades.vercel.app" }],
        destination: "https://www.miradorpropiedades.cl/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "mirador-propiedades-jrsx.vercel.app" }],
        destination: "https://www.miradorpropiedades.cl/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
