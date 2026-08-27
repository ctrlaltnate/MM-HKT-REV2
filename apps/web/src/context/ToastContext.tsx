import { createContext, useContext, useState, type ReactNode, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "loading";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, duration?: number) => string;
  dismissToast: (id: string) => void;
  toast: {
    success: (message: string, duration?: number) => string;
    error: (message: string, duration?: number) => string;
    info: (message: string, duration?: number) => string;
    loading: (message: string) => string;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAllLoadingToasts = useCallback(() => {
    setToasts((prev) => prev.filter((t) => t.type !== "loading"));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { id, type, message, duration };

      if (type === "success" || type === "error") {
        dismissAllLoadingToasts();
      }

      setToasts((prev) => [...prev, newToast]);

      if (type !== "loading" && duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast, dismissAllLoadingToasts],
  );

  const toast = {
    success: (msg: string, duration?: number) => showToast(msg, "success", duration),
    error: (msg: string, duration?: number) => showToast(msg, "error", duration),
    info: (msg: string, duration?: number) => showToast(msg, "info", duration),
    loading: (msg: string) => showToast(msg, "loading", 0),
    dismiss: (id?: string) => {
      if (id) dismissToast(id);
      else dismissAllLoadingToasts();
    },
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toasts: [],
      showToast: () => "",
      dismissToast: () => {},
      toast: {
        success: () => "",
        error: () => "",
        info: () => "",
        loading: () => "",
      },
    };
  }
  return ctx;
}
