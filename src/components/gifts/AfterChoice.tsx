"use client";

import Link from "next/link";
import { site } from "@/config/site";
import type { GiftView } from "@/lib/types";
import { giftsCopy } from "@/content/gifts-copy";
import { doubtLink } from "@/lib/contact";

/** Depois de escolher: contato para dúvidas de estilo e convite discreto para o recado. */
export function AfterChoice({ gift, onDismiss }: { gift: GiftView; onDismiss(): void }) {
  const contact = site.styleContact;
  const wa = doubtLink(gift.title);
  return (
    <section aria-label="Próximos passos" className="relative border-l-2 border-olive-700 bg-white/70 py-4 pr-12 pl-4">
      <p className="font-serif text-[1.25rem] leading-tight text-olive-700">{giftsCopy.ok(gift.title)}</p>
      <p className="mt-2 text-[0.92rem]">{giftsCopy.styleQuestion(contact.name)}</p>
      <div className="mt-2 flex flex-wrap gap-x-5">
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            {giftsCopy.styleCta(contact.name)}
          </a>
        )}
        <Link href="/recado" className="btn btn-ghost">
          {giftsCopy.messageCta}
        </Link>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar aviso"
        className="absolute top-1 right-1 flex h-11 w-11 items-center justify-center text-olive-900"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </section>
  );
}
