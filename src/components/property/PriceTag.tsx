import type { Currency } from "@prisma/client";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type Props = {
  price: number | string;
  currency: Currency;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Show eyebrow label "Desde" above the price */
  withLabel?: boolean;
};

export function PriceTag({
  price,
  currency,
  size = "md",
  className,
  withLabel = false,
}: Props) {
  const styles = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl md:text-5xl",
  }[size];

  return (
    <div className={cn("inline-flex flex-col", className)}>
      {withLabel && (
        <span className="text-[10px] tracking-[0.22em] uppercase text-muted mb-1">
          Desde
        </span>
      )}
      <p className={cn("font-display tracking-tight2 text-fg leading-none", styles)}>
        {formatPrice(price, currency)}
      </p>
    </div>
  );
}
