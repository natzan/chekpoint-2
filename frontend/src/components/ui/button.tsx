import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "default" | "sm";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-950 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<Variant, string> = {
    default:
      "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    outline:
      "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100",
    ghost:
      "bg-transparent text-slate-900 hover:bg-slate-100",
    destructive:
      "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes: Record<Size, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs",
  };

  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

