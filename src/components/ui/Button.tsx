import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-wide transition-all duration-500 ease-out disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:bg-ink",
        outline:
          "border border-fg text-fg bg-bg hover:bg-fg hover:text-bg",
        "outline-light":
          "border border-white/40 text-white hover:border-white hover:bg-white hover:text-fg",
        ghost: "text-fg hover:bg-surface",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe5b]",
        link: "underline-offset-4 hover:underline text-fg",
        accent: "bg-accent text-white hover:bg-accent-hover",
      },
      size: {
        sm: "h-10 px-4 text-[12px]",
        md: "h-12 px-6 text-[13px]",
        lg: "h-14 px-8 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
