import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const baseField =
  "w-full bg-bg text-sm text-fg placeholder:text-muted-2 transition-colors duration-300 " +
  "border-b border-border focus-visible:outline-none focus-visible:border-fg " +
  "disabled:opacity-60";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn("h-12 px-0 py-3", baseField, className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[140px] py-3 resize-y",
      baseField,
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-12 px-0 py-3 appearance-none cursor-pointer",
      baseField,
      // `image:` y `position:` explícitos: sin esas etiquetas, tailwind-merge
      // no distingue estas utilidades de un `bg-*` de color, y cualquier
      // override (p. ej. `bg-transparent`) descarta la posición del chevron y
      // lo manda a la esquina superior izquierda.
      "bg-[image:url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2210%22%20height=%226%22%20viewBox=%220%200%2010%206%22%20fill=%22none%22><path%20d=%22M1%201L5%205L9%201%22%20stroke=%22%236b6b70%22%20stroke-width=%221.2%22/></svg>')] bg-no-repeat bg-[position:right_8px_center] pr-6",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-[11px] tracking-[0.22em] uppercase font-medium text-muted", className)}
    {...props}
  />
));
Label.displayName = "Label";

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-xs text-accent mt-1.5">{children}</p>;
}
