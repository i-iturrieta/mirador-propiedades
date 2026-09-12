import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
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

function safeUrl(value: string | undefined, fallback: string) {
  try {
    return new URL(value ?? fallback);
  } catch {
    console.warn(`[layout] NEXT_PUBLIC_SITE_URL inválido (${value}), usando fallback.`);
    return new URL(fallback);
  }
}

const fallbackUrl = "https://www.miradorpropiedades.cl";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: safeUrl(siteUrl, fallbackUrl),
  title: {
    default: "Mirador Propiedades · Corredora personalizada en el sur de Chile",
    template: "%s · Mirador Propiedades",
  },
  description:
    "Corredora personalizada de propiedades en el sur de Chile: Frutillar, Llanquihue, Puerto Varas, Puerto Montt, Valdivia, Fresia y alrededores. Compra, venta y arriendo con asesoría personalizada.",
  keywords: [
    "corredora de propiedades",
    "Frutillar",
    "Puerto Varas",
    "Llanquihue",
    "Valdivia",
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
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
        {/* offset: deja libre la esquina que ocupa el botón flotante de WhatsApp */}
        <Toaster
          richColors
          closeButton
          position="bottom-right"
          offset={{ bottom: "104px", right: "20px" }}
          mobileOffset={{ bottom: "92px", left: "16px", right: "16px" }}
        />
      </body>
    </html>
  );
}
