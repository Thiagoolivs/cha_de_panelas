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
      className={`scroll-hint fixed bottom-3 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center text-olive-700 transition-opacity duration-500 ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span className="hand rounded-full bg-cream/85 px-3 text-[1.15rem] leading-tight backdrop-blur-sm">role para baixo</span>
      <svg viewBox="0 0 40 40" className="scroll-hint-arrow mt-0.5 h-10 w-10" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 12l10 10 10-10" />
        <path d="M10 22l10 10 10-10" opacity={0.45} />
      </svg>
    </button>
  );
}
