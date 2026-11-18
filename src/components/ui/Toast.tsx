"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createContext, useCallback, useContext, useRef, useState } from "react";

interface Toast {
  id: number;
  text: string;
  tone: "neutral" | "script";
}

const ToastCtx = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);
  const reduce = useReducedMotion();

  const push = useCallback((text: string, tone: Toast["tone"] = "neutral") => {
    const id = next.current++;
    setToasts((t) => [...t.slice(-2), { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-sm rounded-[2px] bg-olive-900 px-5 py-3 text-center text-cream shadow-[0_6px_24px_rgba(43,43,36,0.18)]"
            >
              {t.tone === "script" ? <span className="script text-[2rem]">{t.text}</span> : <span className="text-[0.95rem]">{t.text}</span>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
