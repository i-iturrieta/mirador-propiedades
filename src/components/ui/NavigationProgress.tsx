"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress — barra de progreso superior, fina y en color de acento.
 * Aparece al instante al hacer click en un enlace interno (feedback inmediato
 * en rutas estáticas como /contacto, /servicios, /nosotras que no tienen
 * skeleton) y se completa cuando la nueva ruta termina de cargar.
 *
 * Sin dependencias: detecta el inicio de la navegación con un listener de
 * clicks en fase de captura y el fin observando cambios de pathname/searchParams.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setVisible(true);
    let p = 10;
    setProgress(p);
    const tick = () => {
      p = Math.min(p + Math.random() * 12, 90);
      setProgress(p);
      if (p < 90) timers.current.push(window.setTimeout(tick, 320));
    };
    timers.current.push(window.setTimeout(tick, 320));
  }, [clearTimers]);

  // Inicio: cualquier click en un enlace interno que cambie de URL
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (!href || target === "_blank" || anchor.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [start]);

  // Fin: la ruta cambió → completar y ocultar
  useEffect(() => {
    clearTimers();
    setProgress(100);
    timers.current.push(window.setTimeout(() => setVisible(false), 220));
    timers.current.push(window.setTimeout(() => setProgress(0), 480));
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[9999] h-[2px] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        className="h-full bg-accent"
        style={{
          width: `${progress}%`,
          transition: "width 300ms ease-out",
          boxShadow: "0 0 8px var(--accent), 0 0 4px var(--accent)",
        }}
      />
    </div>
  );
}
