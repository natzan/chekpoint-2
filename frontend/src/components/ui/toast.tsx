import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type Toast = {
  id: number;
  title: string;
  description?: string;
};

type ToastContextValue = {
  addToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    setToasts((current) => [
      ...current,
      { id: Date.now(), ...toast },
    ]);
  }, []);

  const dismiss = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 top-2 z-50 flex justify-center"
      >
        <div className="flex flex-col gap-2">
          {toasts.map((toast) => (
            <Alert
              key={toast.id}
              className="pointer-events-auto flex items-start gap-3 bg-slate-900 text-slate-50"
            >
              <div>
                <p className="font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="text-sm text-slate-200">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2 text-slate-100 hover:bg-slate-800"
                onClick={() => dismiss(toast.id)}
              >
                Fermer
              </Button>
            </Alert>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

