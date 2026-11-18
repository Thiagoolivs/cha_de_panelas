"use client";

import { useState } from "react";
import type { GiftView } from "@/lib/types";
import { GiftIcon } from "@/components/icons/GiftIcon";
import { giftsCopy } from "@/content/gifts-copy";

interface Props {
  gifts: GiftView[];
  counts: Map<string, number>;
  onUndo(gift: GiftView): Promise<void>;
}

export function MyGifts({ gifts, counts, onUndo }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  return (
    <section aria-labelledby="my-gifts" className="card p-4">
      <h2 id="my-gifts" className="title-caps text-[1.2rem]">
        {giftsCopy.myTitle}
      </h2>
      {gifts.length === 0 ? (
        <p className="mt-2 text-[0.9rem] text-olive-900">{giftsCopy.myEmpty}</p>
      ) : (
        <>
          <ul className="mt-3 divide-y divide-olive-700/15">
            {gifts.map((g) => (
              <li key={g.id} className="flex items-center gap-3 py-2">
                <GiftIcon iconKey={g.iconKey} className="h-10 w-10 shrink-0" />
                <span className="flex-1 font-serif text-[1.12rem] leading-tight">
                  {(counts.get(g.id) ?? 1) > 1 && <span className="mr-1 font-sans text-[0.85rem] text-olive-700">{counts.get(g.id)}×</span>}
                  {g.title}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={busy === g.id}
                  onClick={async () => {
                    setBusy(g.id);
                    await onUndo(g);
                    setBusy(null);
                  }}
                >
                  {giftsCopy.undo}
                  <span className="sr-only"> {g.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[0.8rem] text-gray">{giftsCopy.myHint}</p>
        </>
      )}
    </section>
  );
}
