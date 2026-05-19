"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger children so each one animates in sequence */
  stagger?: boolean;
  /** Delay in ms before triggering the reveal */
  delay?: number;
};

/**
 * Reveal — fade + translate-up on scroll, using IntersectionObserver.
 * Respects `prefers-reduced-motion` (handled in globals.css).
 */
export function Reveal({ children, className, stagger = false, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = window.setTimeout(() => setVisible(true), delay);
          io.disconnect();
          return () => window.clearTimeout(t);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      data-visible={visible || undefined}
      className={cn("reveal", stagger && "reveal-stagger", className)}
    >
      {children}
    </div>
  );
}
