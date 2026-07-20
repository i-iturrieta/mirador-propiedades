"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { whatsappDisplay } from "@/lib/whatsapp";
import { socialLinks } from "@/lib/social";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 bg-night text-white">
      {/* Big CTA strip */}
      <section className="border-b border-white/12">
        <div className="container-ultra py-20 lg:py-28 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <p className="text-[11px] tracking-[0.22em] uppercase text-white/70">Conversemos</p>
            <h2 className="mt-5 font-display text-4xl md:text-6xl lg:text-7xl tracking-tight2 text-balance leading-[1.02] text-white">
              ¿Listo para encontrar
              <br />
              <span className="italic">tu próximo lugar?</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link
              href="/contacto"
              className="group inline-flex items-center justify-between gap-6 px-6 py-5 border border-white/30 hover:border-white hover:bg-white hover:text-fg transition-colors duration-500 rounded-sm w-full lg:w-auto lg:min-w-[280px] text-white"
            >
              <span className="text-sm tracking-wide">Solicitar asesoría</span>
              <ArrowUpRight
                size={20}
                strokeWidth={1.5}
                className="transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="container-ultra pt-20 pb-12 grid gap-12 lg:gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo size="md" />
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-white/80">
            Corredora personalizada en la Región de Los Lagos. Acompañamos cada compra, venta y
            arriendo con asesoría personalizada, conocimiento real del territorio y discreción.
          </p>

          <ul className="mt-10 flex items-center gap-2">
            {socialLinks.map(({ Icon, href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/25 text-white hover:border-white hover:bg-white hover:text-fg transition-colors duration-500 rounded-sm"
                >
                  <Icon size={15} strokeWidth={1.5} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3 lg:col-start-7">
          <h3 className="text-[11px] tracking-[0.22em] uppercase text-white/70">Navegar</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              { href: "/propiedades", label: "Propiedades" },
              { href: "/servicios", label: "Servicios" },
              { href: "/nosotras", label: "Nosotras" },
              { href: "/contacto", label: "Contacto" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-center gap-2 text-white hover:text-white transition-colors"
                >
                  <span className="opacity-90 group-hover:opacity-100">{l.label}</span>
                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.5}
                    className="opacity-0 -translate-x-1 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-[11px] tracking-[0.22em] uppercase text-white/70">Contacto</h3>
          <ul className="mt-6 space-y-4 text-sm">
            <li>
              <a
                href="mailto:info@miradorpropiedades.cl"
                className="inline-flex items-start gap-3 text-white/90 hover:text-white transition-colors"
              >
                <Mail
                  size={14}
                  strokeWidth={1.5}
                  className="mt-1 text-white/70"
                  aria-hidden
                />
                <span>info@miradorpropiedades.cl</span>
              </a>
            </li>
            <li>
              <a
                href="tel:+56988040592"
                className="inline-flex items-start gap-3 text-white/90 hover:text-white transition-colors"
              >
                <Phone
                  size={14}
                  strokeWidth={1.5}
                  className="mt-1 text-white/70"
                  aria-hidden
                />
                <span>{whatsappDisplay}</span>
              </a>
            </li>
            <li className="inline-flex items-start gap-3 text-white/80">
              <MapPin
                size={14}
                strokeWidth={1.5}
                className="mt-1 text-white/70"
                aria-hidden
              />
              <span>Región de Los Lagos, Chile</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className="container-ultra py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] tracking-wide text-white/75 uppercase">
          <p>© {year} Mirador Propiedades · Todos los derechos reservados</p>
          <p>Puerto Varas · Frutillar · Fresia · Lago Ranco · Puerto Montt · Llanquihue</p>
        </div>
      </div>
    </footer>
  );
}
