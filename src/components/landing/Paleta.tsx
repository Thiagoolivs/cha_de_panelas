"use client";

import { motion, useReducedMotion } from "framer-motion";
import { copy } from "@/content/copy";
import { BAMBU_BG } from "@/content/palette";

/** Página 5 do convite: paleta dos utensílios (branco, cinza, preto; cabo de bambu também vale). */
export function Paleta() {
  const reduce = !!useReducedMotion();
  return (
    <section aria-labelledby="paleta-title" className="px-6 py-16 text-center">
      <h2 id="paleta-title" className="title-caps text-[2.4rem]">
        {copy.paleta.title}
      </h2>
      <p className="hand mx-auto mt-3 max-w-xs text-[1.25rem] leading-snug">{copy.paleta.note}</p>
      <ul className="mx-auto mt-8 grid max-w-sm grid-cols-4 gap-3">
        {copy.paleta.colors.map((c, i) => (
          <motion.li
            key={c.name}
            initial={reduce ? false : { opacity: 0, y: 24, rotate: -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: i * 0.08 }}
          >
            <span
              className="block aspect-square border border-ink/70"
              style={{ background: c.hex === "bambu" ? BAMBU_BG : c.hex }}
              aria-hidden="true"
            />
            <span className="mt-1 block text-[0.75rem] leading-tight">{c.name}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
