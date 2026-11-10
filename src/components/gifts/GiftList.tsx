"use client";

import { useMemo, useState } from "react";
import type { GiftView, Tier } from "@/lib/types";
import { TIERS } from "@/lib/types";
import { TIER_LABEL, giftsCopy } from "@/content/gifts-copy";
import { GiftCard } from "./GiftCard";

interface Props {
  gifts: GiftView[] | null;
  myIds: Set<string>;
  onChoose(gift: GiftView): void;
}

export function GiftList({ gifts, myIds, onChoose }: Props) {
  const [filter, setFilter] = useState<Tier | "all">("all");

  const groups = useMemo(() => {
    if (!gifts) return [];
    return TIERS.filter((t) => filter === "all" || filter === t)
      .map((t) => ({
        tier: t,
        // Disponíveis primeiro, escolhidos no fim (mantendo a ordem da lista).
        items: gifts
          .filter((g) => g.tier === t)
          .sort((a, b) => Number(a.remaining <= 0) - Number(b.remaining <= 0) || a.order - b.order),
      }))
      .filter((g) => g.items.length);
  }, [gifts, filter]);

  return (
    <div>
      <div role="group" aria-label={giftsCopy.filterLabel} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
        {(["all", ...TIERS] as const).map((t) => {
          const active = filter === t;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(t)}
              className={`min-h-[40px] shrink-0 rounded-full border px-4 text-[0.82rem] whitespace-nowrap transition-colors ${
                active ? "border-olive-700 bg-olive-700 text-cream" : "border-olive-700/40 text-olive-900 hover:border-olive-700"
              }`}
            >
              {t === "all" ? giftsCopy.filterAll : TIER_LABEL[t].short}
            </button>
          );
        })}
      </div>

      {!gifts ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2" aria-busy="true" aria-label="Carregando presentes">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-[188px] animate-pulse" />
          ))}
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.tier} aria-labelledby={`tier-${g.tier}`} className="mt-8">
            <h2 id={`tier-${g.tier}`} className="title-caps text-[1.45rem]">
              {TIER_LABEL[g.tier].title}
            </h2>
            <p className="mt-1 text-[0.88rem] text-olive-900">{TIER_LABEL[g.tier].note}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
              {g.items.map((gift) => (
                <GiftCard key={gift.id} gift={gift} isMine={myIds.has(gift.id)} onChoose={onChoose} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
