"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const config: Record<ToastType, { icon: ReactNode; border: string; iconColor: string }> = {
    success: {
      icon: <CheckCircle className="w-5 h-5 shrink-0" />,
      border: "#22c55e",
      iconColor: "#22c55e",
    },
    error: {
      icon: <XCircle className="w-5 h-5 shrink-0" />,
      border: "var(--color-accent)",
      iconColor: "var(--color-accent)",
    },
    info: {
      icon: <Info className="w-5 h-5 shrink-0" />,
      border: "var(--color-gold)",
      iconColor: "var(--color-gold)",
    },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const { icon, border, iconColor } = config[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl max-w-sm"
                style={{
                  backgroundColor: "var(--color-card)",
                  borderColor: border,
                  color: "var(--color-text)",
                }}
              >
                <span style={{ color: iconColor }}>{icon}</span>
                <p className="text-sm font-medium flex-1">{toast.message}</p>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="p-1 rounded-lg transition-colors"
                  style={{ color: "var(--color-text-faint)" }}
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
