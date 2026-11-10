"use client";

import type { GiftView } from "@/lib/types";
import { storeLinks } from "@/lib/links";
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
  const titleId = `gift-${gift.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className={`card flex flex-col p-4 transition-opacity ${soldOut && !isMine ? "opacity-55" : ""}`}
      data-gift={gift.id}
    >
      <div className="flex gap-4">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center bg-cream">
          {gift.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={gift.image} alt="" className="h-full w-full object-cover" loading="lazy" />
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
