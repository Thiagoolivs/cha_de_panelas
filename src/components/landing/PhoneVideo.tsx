"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Vídeo dentro do celular: toca sozinho (mudo, em loop) quando aparece; toque pausa/retoma. */
export function PhoneVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLButtonElement>(null);
  const reduce = !!useReducedMotion();
  const [paused, setPaused] = useState(true);
  // O vídeo (e até a capa) só carrega quando o celular chega perto da tela.
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce || !near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce, near]);

  return (
    <button
      ref={box}
      type="button"
      className="relative block h-full w-full"
      aria-label={paused ? `Tocar ${label}` : `Pausar ${label}`}
      onClick={() => {
        const v = ref.current;
        if (!v) return;
        if (v.paused) void v.play();
        else v.pause();
      }}
    >
      <video
        ref={ref}
        src={near ? src : undefined}
        poster={near ? poster : undefined}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        className="h-full w-full object-cover"
      />
      {paused && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/15" aria-hidden="true">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="#70773d">
              <path d="M7 5l12 7-12 7z" />
            </svg>
          </span>
        </span>
      )}
    </button>
  );
}
