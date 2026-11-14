"use client";

import { useEffect, useState } from "react";

/** Setinha na abertura convidando a rolar a página; some quando a pessoa começa a rolar. */
export function ScrollHint() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY < 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })}
      aria-label="Rolar para baixo"
      className={`scroll-hint fixed right-3 bottom-24 z-30 transition-opacity duration-500 ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span className="scroll-hint-arrow flex h-11 w-11 items-center justify-center rounded-full bg-green-ui text-cream shadow-[0_6px_16px_rgba(31,28,24,0.28)] ring-4 ring-cream/70">
        <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 11l9 9 9-9" />
          <path d="M11 21l9 9 9-9" opacity={0.55} />
        </svg>
      </span>
    </button>
  );
}
