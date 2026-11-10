"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { copy } from "@/content/copy";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function Pix() {
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
    window.setTimeout(() => setCopied(false), 2400);
  }

  return (
    <section aria-labelledby="pix-title" className="px-4 py-14">
      <div className="mx-auto max-w-xl">
        <h2 id="pix-title" className="title-caps text-center text-[1.9rem]">
          {copy.pix.title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center">{copy.pix.intro}</p>
        <ul className="mt-8 divide-y divide-olive-700/20 border-y border-olive-700/20">
          {site.pix.quotas.map((q) => (
            <li key={q.value} className="flex items-baseline gap-4 py-4">
              <span className="w-[4.6rem] shrink-0 font-serif text-[1.5rem] text-olive-700">{brl(q.value)}</span>
              <span className="text-[0.98rem]">{q.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          {key ? (
            <>
              {site.pix.holder && <p className="text-sm text-olive-900">{site.pix.holder}</p>}
              <p className="mt-1 font-mono text-[0.95rem] break-all">{key}</p>
              <button type="button" onClick={onCopy} className="btn btn-outline mt-4">
                {copy.pix.copy}
              </button>
              <p aria-live="polite" className="mt-2 h-6 text-sm text-olive-900">
                {copied ? copy.pix.copied : ""}
              </p>
            </>
          ) : (
            <p className="text-sm italic text-olive-900">{copy.pix.soon}</p>
          )}
        </div>
      </div>
    </section>
  );
}
