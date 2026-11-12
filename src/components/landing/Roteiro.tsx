"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useReducedMotion } from "framer-motion";
import { copy } from "@/content/copy";

/** Página 3 do convite: o roteiro, com os memes entrando como figurinhas. */
export function Roteiro() {
  const reduce = !!useReducedMotion();
  return (
    <section aria-labelledby="roteiro-title" className="px-6 py-16">
      <h2 id="roteiro-title" className="title-caps text-center text-[3.4rem]">
        {copy.roteiro.title}
      </h2>
      <ol className="mx-auto mt-6 max-w-xs space-y-10">
        {copy.roteiro.items.map((it, i) => (
          <motion.li
            key={it.text}
            className="flex flex-col items-center text-center"
            initial={reduce ? false : { opacity: 0, y: 40, rotate: i % 2 ? 6 : -6, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 140, damping: 14 }}
          >
            <p className="hand text-[1.45rem] leading-snug">{it.text}</p>
            <img src={it.img} alt="" aria-hidden="true" loading="lazy" className="mt-3 aspect-square w-[62%] max-w-[200px] object-cover shadow-[0_8px_20px_-8px_rgba(31,28,24,0.45)]" />
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
