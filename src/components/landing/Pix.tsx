"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { site } from "@/config/site";
import { copy } from "@/content/copy";

const brl = (v: number) => `R$ ${v},00`;

/** Final da página 2 do convite: cotas com memes, etiquetas e a chave Pix. */
export function Pix() {
  const reduce = !!useReducedMotion();
  const [copied, setCopied] = useState(false);
  const key = site.pix.key;

  async function onCopy() {
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = key;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <section aria-labelledby="pix-title" className="bg-green-ui px-5 pt-16 pb-20 text-white">
      <h2 id="pix-title" className="mx-auto max-w-xs text-center font-display text-[1.75rem] leading-[1] uppercase">
        {copy.pix.title}
      </h2>
      <ul className="mx-auto mt-12 grid max-w-sm grid-cols-2 gap-x-5 gap-y-12">
        {site.pix.quotas.map((q, i) => (
          <motion.li
            key={q.value}
            className="relative text-center"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.12 }}
          >
            <img src={q.img} alt="" aria-hidden="true" loading="lazy" className="mx-auto aspect-square w-full object-cover" />
            <motion.span
              className="sticker absolute -top-5 right-[-10%] text-[1.35rem]"
              initial={reduce ? false : { scale: 0, rotate: -40 }}
              whileInView={{ scale: 1, rotate: 14 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.25 + (i % 2) * 0.12 }}
            >
              {brl(q.value)}
            </motion.span>
            <p className="hand mt-2 text-[1.12rem] leading-tight">{q.label}</p>
          </motion.li>
        ))}
      </ul>

      <div className="mt-16 flex flex-col items-center">
        <span className="sticker relative z-10 -mb-2 -rotate-6 text-[1.4rem] uppercase">{copy.pix.label}</span>
        {key ? (
          <button
            type="button"
            onClick={onCopy}
            className="bg-ink px-5 py-3 font-hand text-[1.9rem] tracking-[0.12em] text-white active:scale-95"
            aria-label={`Copiar chave Pix ${site.pix.display ?? key}`}
          >
            {site.pix.display ?? key}
          </button>
        ) : (
          <p className="bg-ink px-5 py-3 text-white">{copy.pix.soon}</p>
        )}
        <p aria-live="polite" className="hand mt-3 h-7 text-[1.2rem]">
          {key ? (copied ? copy.pix.copied : copy.pix.copy) : ""}
        </p>
      </div>
    </section>
  );
}
