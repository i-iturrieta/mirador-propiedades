"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, Phone, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { whatsappDisplay, buildWhatsAppUrl } from "@/lib/whatsapp";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotras", label: "Nosotras" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (pathname.startsWith("/admin")) return null;

  const waUrl = buildWhatsAppUrl("Hola, me gustaría conversar sobre asesoría inmobiliaria.");

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-night text-white border-b border-white/10">
      <div className="container-ultra flex items-center justify-between h-20 lg:h-24">
        <Link
          href="/"
          aria-label="Mirador Propiedades — inicio"
          className="block transition-opacity duration-300 hover:opacity-85"
        >
          <Logo size="md" priority />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Principal">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-5 py-2 text-[13px] tracking-wide transition-colors duration-300",
                  active ? "text-white" : "text-white/70 hover:text-white",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute left-5 right-5 -bottom-0.5 h-px bg-accent transition-transform duration-500 ease-out origin-center",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-6 group inline-flex items-center gap-2.5 text-[13px] text-white/85 hover:text-white transition-colors"
            aria-label={`WhatsApp ${whatsappDisplay}`}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center bg-white/10 group-hover:bg-accent transition-colors duration-300 rounded-sm">
              <MessageCircle size={15} strokeWidth={1.5} />
            </span>
            <span className="tabular-nums">{whatsappDisplay}</span>
          </a>
        </nav>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center h-11 w-11 text-white"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={cn(
          "lg:hidden fixed inset-x-0 top-0 z-40 bg-night text-white transition-transform duration-500 ease-out min-h-screen",
          open ? "translate-y-0" : "-translate-y-full",
        )}
        aria-hidden={!open}
      >
        <div className="container-ultra flex items-center justify-between h-20">
          <Link href="/" aria-label="Mirador Propiedades — inicio" className="block">
            <Logo size="md" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center h-11 w-11 text-white"
            aria-label="Cerrar menú"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="container-ultra pt-8 pb-16 flex flex-col" aria-label="Móvil">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "group flex items-center justify-between py-6 border-b border-white/10 font-display text-3xl tracking-tight2 transition-colors",
                isActive(item.href) ? "text-white" : "text-white/75 hover:text-white",
              )}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${100 + i * 70}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${100 + i * 70}ms`,
              }}
            >
              <span>{item.label}</span>
              <ArrowUpRight
                size={20}
                strokeWidth={1.5}
                className="opacity-50 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          ))}

          <div
            className="mt-10 grid gap-3"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) 480ms, transform 600ms cubic-bezier(0.22,1,0.36,1) 480ms`,
            }}
          >
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 h-14 bg-[#25D366] text-white text-sm tracking-wide rounded-sm"
            >
              <MessageCircle size={16} strokeWidth={1.5} />
              WhatsApp
            </a>
            <a
              href="tel:+56988040592"
              className="inline-flex items-center justify-center gap-3 h-14 border border-white/30 text-white text-sm tracking-wide rounded-sm hover:border-white transition-colors"
            >
              <Phone size={16} strokeWidth={1.5} />
              {whatsappDisplay}
            </a>
          </div>

          <div
            className="mt-12 text-xs text-white/60 tracking-[0.18em] uppercase"
            style={{
              opacity: open ? 1 : 0,
              transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) 580ms`,
            }}
          >
            Frutillar · Llanquihue · Puerto Varas · Puerto Montt
          </div>
        </nav>
      </div>
    </header>
  );
}
