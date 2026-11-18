"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";

interface Props {
  open: boolean;
  onClose(): void;
  title: string;
  children: React.ReactNode;
  /** Esconde o título visualmente (continua acessível). */
  hideTitle?: boolean;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Modal acessível: foco preso, Esc fecha, foco volta para quem abriu. */
export function Dialog({ open, onClose, title, children, hideTitle }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const reduce = useReducedMotion();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = ref.current;
    const first = root?.querySelector<HTMLElement>("[data-autofocus]") ?? root?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === "Tab" && root) {
        const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-md bg-cream px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_40px_rgba(43,43,36,0.2)] sm:rounded-[2px] sm:pb-6"
            style={{ backgroundImage: "var(--paper)" }}
            initial={reduce ? false : { y: 24 }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-2 right-2 flex h-11 w-11 items-center justify-center text-olive-900"
              aria-label="Fechar"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <h2 id={titleId} className={hideTitle ? "sr-only" : "title-caps pr-10 text-[1.35rem]"}>
              {title}
            </h2>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
