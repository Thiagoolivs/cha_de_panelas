"use client";

import type { GiftView } from "@/lib/types";
import { storeLinks } from "@/lib/links";
import { doubtLink } from "@/lib/contact";
import { site } from "@/config/site";
import { GiftIcon } from "@/components/icons/GiftIcon";
import { giftsCopy } from "@/content/gifts-copy";

interface Props {
  gift: GiftView;
  isMine: boolean;
  onChoose(gift: GiftView): void;
}

export function GiftCard({ gift, isMine, onChoose }: Props) {
  const soldOut = gift.remaining <= 0;
  const disabled = soldOut || isMine;
  const links = storeLinks(gift);
  const doubt = doubtLink(gift.title);
  const titleId = `gift-${gift.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className={`card flex flex-col p-4 transition-opacity ${soldOut && !isMine ? "opacity-55" : ""}`}
      data-gift={gift.id}
    >
      <div className="flex gap-4">
        <div className="flex h-[96px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream">
          {gift.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={gift.image} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
          ) : (
            <GiftIcon iconKey={gift.iconKey} className="h-[60px] w-[60px]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 id={titleId} className="font-serif text-[1.3rem] leading-tight font-medium text-ink">
            {gift.title}
          </h3>
          <p className="mt-1 text-[0.9rem] leading-snug text-ink/85">{gift.description}</p>
          {gift.quantity > 1 && !soldOut && (
            <p className="mt-1 text-[0.8rem] font-medium tracking-wide text-olive-900">
              {giftsCopy.remaining(gift.remaining, gift.quantity)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {isMine ? (
          <p className="flex min-h-[48px] items-center justify-center border border-olive-700/40 text-[0.82rem] font-medium tracking-[0.14em] text-olive-700 uppercase">
            {giftsCopy.mine}
          </p>
        ) : soldOut ? (
          <p className="flex min-h-[48px] items-center justify-center text-[0.82rem] font-medium tracking-[0.14em] text-gray uppercase">
            {giftsCopy.chosen}
          </p>
        ) : (
          <button type="button" className="btn btn-primary w-full" onClick={() => onChoose(gift)} disabled={disabled}>
            {giftsCopy.choose}
            <span className="sr-only">: {gift.title}</span>
          </button>
        )}
      </div>

      {doubt && !soldOut && (
        <a
          href={doubt}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-[44px] items-center justify-center gap-2 self-center text-[0.9rem] font-medium text-olive-700"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
            <path d="M9.5 9.5c0 3 2 5 5 5l1-1.5-1.8-1-1 .8c-.9-.4-1.6-1.1-2-2l.8-1-1-1.8z" />
          </svg>
          Tirar dúvida com a {site.styleContact.name}
          <span className="sr-only"> sobre {gift.title} (abre o WhatsApp)</span>
        </a>
      )}

      {!soldOut && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 text-[0.8rem]">
          <span className="w-full text-[0.72rem] tracking-[0.12em] text-gray uppercase">{giftsCopy.whereToFind}</span>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[32px] items-center text-olive-900 underline decoration-olive-700/40 underline-offset-4 hover:decoration-olive-700"
            >
              {l.label}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
