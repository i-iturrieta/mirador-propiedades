import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** Altura del logo en pixels (se calcula el ancho preservando proporción) */
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
};

// Proporción real del logo recortado: 908x347 (~2.617:1)
const sizes = {
  sm: { h: 40, w: 105 },
  md: { h: 56, w: 147 },
  lg: { h: 72, w: 188 },
};

/**
 * Logo oficial Mirador Propiedades.
 * Usa la imagen real (fondo negro con MIRADOR PROPIEDADES y techo rojo sobre la A).
 * Como la imagen tiene fondo negro, se integra naturalmente en superficies oscuras
 * y se renderiza como sticker sobre superficies claras.
 */
export function Logo({ size = "md", className, priority = false }: LogoProps) {
  const { h, w } = sizes[size];
  return (
    <Image
      src="/logo-mirador.png"
      alt="Mirador Propiedades"
      width={w * 4}
      height={h * 4}
      priority={priority}
      sizes={`${w}px`}
      className={cn("block h-auto select-none", className)}
      style={{ width: `${w}px`, height: `${h}px` }}
    />
  );
}
