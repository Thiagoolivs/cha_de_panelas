"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { copy } from "@/content/copy";

/** Página 6 do convite: "VAMO? VAMO?" em linhas que deslizam com a rolagem. */
export function Vamo() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const right = useTransform(scrollYProgress, [0, 1], reduce ? ["-20%", "-20%"] : ["-35%", "0%"]);
  const left = useTransform(scrollYProgress, [0, 1], reduce ? ["-20%", "-20%"] : ["0%", "-35%"]);
  const line = Array.from({ length: 8 }, () => copy.vamo.word).join(" ");

  return (
    <section ref={ref} aria-label="Vamos?" className="relative overflow-hidden py-10">
      <div aria-hidden="true" className="space-y-1 font-display text-[3.1rem] leading-none whitespace-nowrap text-ink select-none">
        {Array.from({ length: 9 }, (_, i) => (
          <motion.div key={i} style={{ x: i % 2 ? left : right }}>
            {line}
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={reduce ? false : { scale: 0.6, rotate: -8, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: "spring", stiffness: 160, damping: 11 }}
        >
          <Link href="/presentes" className="block bg-green-ui px-6 py-2 font-display text-[2.6rem] text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] active:scale-95">
            {copy.vamo.cta}
            <span className="sr-only"> Ver a lista de presentes</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
