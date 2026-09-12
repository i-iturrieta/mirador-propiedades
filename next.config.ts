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
