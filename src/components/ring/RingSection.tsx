"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { copy } from "@/content/copy";

const RingScene = dynamic(() => import("./RingScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Seção "presa" na tela (260 svh de rolagem): a aliança vem para fora da tela e,
 * quando atravessa, o fundo vira o verde do convite com o "Vamos casar!".
 */
export function RingSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const [mount, setMount] = useState(false);
  const [gl, setGl] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // three.js pesa: só carrega quando a pessoa começa a rolar ou a seção chega perto.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const start = () => {
      if (done) return;
      done = true;
      setGl(hasWebGL());
      setMount(true);
    };
    const onScroll = () => window.scrollY > 40 && start();
    window.addEventListener("scroll", onScroll, { passive: true });
    const near = new IntersectionObserver(([e]) => e.isIntersecting && start());
    near.observe(el);
    // Só anima (desenha quadros) enquanto a seção está na tela.
    const onScreen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    onScreen.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      near.disconnect();
      onScreen.disconnect();
    };
  }, []);

  // Interpolações com limite explícito (0..1).
  const ramp = (a: number, b: number) => (v: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  const greenOpacity = useTransform(scrollYProgress, ramp(0.55, 0.8));
  const titleOpacity = useTransform(scrollYProgress, ramp(0.7, 0.88));
  const titleScale = useTransform(scrollYProgress, (v) => 0.82 + 0.18 * ramp(0.7, 0.95)(v));
  const hintOpacity = useTransform(scrollYProgress, (v) => 1 - ramp(0, 0.1)(v));
  const [past, setPast] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPast(v > 0.86);
  });

  if (reduce) {
    return (
      <section aria-label="Aliança" className="relative h-[70svh] min-h-[420px]">
        {mount && gl && <RingScene progress={null} still active={visible} />}
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="Aliança" className="relative h-[260svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0 bg-green-ui" style={{ opacity: greenOpacity }} aria-hidden="true" />
        <div className={`absolute inset-0 transition-opacity duration-300 ${past ? "opacity-0" : "opacity-100"}`}>
          {mount && gl ? (
            <RingScene progress={scrollYProgress} active={visible && !past} />
          ) : (
            <div className="flex h-full items-center justify-center text-olive-700">
              <svg viewBox="0 0 120 120" className="w-40" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="60" cy="68" r="34" />
                <path d="M60 34l-8-12h16z" />
              </svg>
            </div>
          )}
        </div>
        <motion.p
          style={{ opacity: hintOpacity }}
          className="hand pointer-events-none absolute inset-x-0 bottom-[12svh] text-center text-[1.35rem] text-olive-700"
        >
          role devagar…
        </motion.p>
        <motion.p
          aria-hidden="true"
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center font-display text-[4.2rem] leading-[0.9] text-white uppercase sm:text-[6rem]"
        >
          {copy.casar.title.split(" ").map((w) => (
            <span key={w} className="block">
              {w}
            </span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}
