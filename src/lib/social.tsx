import type { SVGProps } from "react";
import { Instagram, Facebook } from "lucide-react";

/**
 * Icono de TikTok. `lucide-react` no incluye la marca TikTok, así que se define
 * como SVG inline con una firma compatible con los iconos de lucide (`size`,
 * `className`), para poder usarlo indistintamente en la lista de redes.
 */
export function TikTokIcon({
  size = 15,
  className,
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
      {...props}
    >
      <path d="M16.5 3c.3 2.1 1.5 3.4 3.5 3.6v2.4c-1.2.1-2.4-.2-3.5-.8v5.7c0 3.6-2.6 5.8-5.6 5.8-2.8 0-5-2-5-4.9 0-2.9 2.3-5 5.4-4.7v2.5c-.4-.1-.9-.2-1.3-.1-1.2.1-2 1-1.9 2.3.1 1.2 1 2 2.2 2 1.3 0 2.1-1 2.1-2.6V3h3.6z" />
    </svg>
  );
}

/** Redes sociales oficiales de Mirador Propiedades (fuente única). */
export const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/miradorpropiedades/",
    Icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/MiradorPropiedades",
    Icon: Facebook,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@miradorpropiedades",
    Icon: TikTokIcon,
  },
];
