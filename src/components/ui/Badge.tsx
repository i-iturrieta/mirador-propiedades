import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "muted" | "outline" | "danger" | "ghost-light" | "accent";
  size?: "sm" | "md";
};

export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  ...props
}: BadgeProps) {
  const styles = {
    neutral: "bg-fg text-bg",
    muted: "bg-surface text-fg/80 border border-border",
    outline: "border border-fg/80 text-fg bg-bg/70 backdrop-blur",
    danger: "bg-accent text-white",
    accent: "bg-accent text-white",
    "ghost-light":
      "bg-night/50 backdrop-blur-md text-white border border-white/30 hover:bg-night/65",
  }[variant];

  const sizing = {
    sm: "text-[10px] tracking-[0.22em] px-2.5 py-1",
    md: "text-[11px] tracking-[0.22em] px-3 py-1.5",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center uppercase font-medium rounded-sm transition-colors duration-300",
        sizing,
        styles,
        className,
      )}
      {...props}
    />
  );
}
