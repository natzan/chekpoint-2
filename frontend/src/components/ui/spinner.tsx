import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  label?: string;
};

export function Spinner({ className, label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2" role="status" aria-live="polite">
      <div
        className={cn(
          "h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900",
          className,
        )}
      />
      {label ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="sr-only">Chargement…</span>
      )}
    </div>
  );
}

