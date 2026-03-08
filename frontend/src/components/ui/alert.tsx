import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "destructive";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
};

export function Alert({
  className,
  variant = "default",
  role = "alert",
  ...props
}: AlertProps) {
  const variants: Record<Variant, string> = {
    default:
      "border-slate-200 bg-white text-slate-900",
    destructive:
      "border-red-500/20 bg-red-50 text-red-900",
  };

  return (
    <div
      role={role}
      className={cn(
        "relative w-full rounded-lg border px-4 py-3 text-sm",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

