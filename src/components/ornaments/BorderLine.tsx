"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Borda de utensílios em traço contínuo do convite, "desenhada" da esquerda para a direita. */
export function BorderLine({ className = "", delay = 0, inView = false }: { className?: string; delay?: number; inView?: boolean }) {
  const reduce = !!useReducedMotion();
  const anim = reduce
    ? {}
    : {
        initial: { clipPath: "inset(0 100% 0 0)" },
        [inView ? "whileInView" : "animate"]: { clipPath: "inset(0 0% 0 0)" },
        viewport: { once: true, amount: 0.5 },
        transition: { duration: 2.2, ease: [0.45, 0, 0.25, 1] as const, delay },
      };
  return (
    <motion.img
      src="/assets/convite/utensilios-borda.svg"
      alt=""
      aria-hidden="true"
      className={`mx-auto block w-full max-w-[560px] ${className}`}
      {...anim}
    />
  );
}
