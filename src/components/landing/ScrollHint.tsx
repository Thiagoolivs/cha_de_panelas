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
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 flex h-24 items-end justify-center bg-gradient-to-t from-cream via-cream/80 to-transparent pb-3 transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })}
        aria-label="Rolar para baixo"
        className={`scroll-hint-arrow flex h-11 w-11 items-center justify-center rounded-full bg-green-ui text-cream shadow-[0_6px_16px_rgba(31,28,24,0.28)] ${show ? "pointer-events-auto" : ""}`}
      >
        <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 11l9 9 9-9" />
          <path d="M11 21l9 9 9-9" opacity={0.55} />
        </svg>
      </button>
    </div>
  );
}
