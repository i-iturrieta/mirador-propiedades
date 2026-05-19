import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.miradorpropiedades.cl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mirador Propiedades · Corredora boutique en Los Lagos",
    template: "%s · Mirador Propiedades",
  },
  description:
    "Corredora boutique de propiedades en la Región de Los Lagos: Frutillar, Llanquihue, Puerto Varas, Puerto Montt, Fresia y alrededores. Compra, venta y arriendo con asesoría personalizada.",
  keywords: [
    "corredora de propiedades",
    "Frutillar",
    "Puerto Varas",
    "Llanquihue",
    "Los Lagos",
    "casas en venta",
    "parcelas en venta",
    "arriendo sur de Chile",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteUrl,
    siteName: "Mirador Propiedades",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${montserrat.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-bg text-fg">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:bg-fg focus:text-bg focus:px-4 focus:py-2 focus:rounded focus:text-sm"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster richColors closeButton position="bottom-right" />
      </body>
    </html>
  );
}
