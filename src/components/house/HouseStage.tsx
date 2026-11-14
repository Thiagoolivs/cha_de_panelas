"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Room } from "@/lib/types";
import { ROOMS } from "@/lib/types";
import { useGifts } from "@/lib/repository/context";
import { ROOM_LABEL } from "@/content/gifts-copy";
import { Dialog } from "@/components/ui/Dialog";
import { GiftIcon } from "@/components/icons/GiftIcon";
import { House } from "./House";
import { HOUSE_CAMERA, roomCamera } from "./geometry";
import { useCamera } from "./camera";
import { useReaction } from "./useReaction";

export function HouseStage() {
  const { house, gifts } = useGifts();
  const reduce = !!useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [userFocus, setUserFocus] = useState<Room | null>(null);
  const [card, setCard] = useState<string | null>(null);

  const giftMap = useMemo(() => new Map((gifts ?? []).map((g) => [g.id, g])), [gifts]);
  const reaction = useReaction({ giftMap, reduce });

  const focus = reaction.focus ?? userFocus;
  const target = useMemo(() => (focus ? roomCamera(focus) : HOUSE_CAMERA), [focus]);
  useCamera(svgRef, target, reduce);

  const onRoom = useCallback((r: Room) => setUserFocus(r), []);
  const onItem = useCallback((id: string) => setCard(id), []);
  const cardGift = card ? giftMap.get(card) : null;

  const counts = useMemo(() => {
    const m = new Map<Room, number>(ROOMS.map((r) => [r, 0]));
    for (const it of house) m.set(it.room, (m.get(it.room) ?? 0) + 1);
    return m;
  }, [house]);
  const totals = useMemo(() => {
    const m = new Map<Room, number>(ROOMS.map((r) => [r, 0]));
    for (const g of gifts ?? []) m.set(g.room, (m.get(g.room) ?? 0) + 1);
    return m;
  }, [gifts]);

  return (
    <section aria-labelledby="casinha-title" className="relative">
      <h2 id="casinha-title" className="sr-only">
        A casinha
      </h2>
      <div className="house-theme relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-[2px] sm:shadow-[0_20px_50px_-24px_rgba(38,42,25,0.6)]">
        <House
          ref={svgRef}
          items={house}
          gifts={giftMap}
          focus={focus}
          hiddenGiftId={reaction.hiddenGiftId}
          onRoom={onRoom}
          onItem={onItem}
          overlay={reaction.overlay}
          dropRef={reaction.dropRef}
          dropGiftId={reaction.dropGiftId}
        />
        {reaction.label}
        {userFocus && !reaction.active && (
          <button
            type="button"
            onClick={() => setUserFocus(null)}
            className="absolute top-2 right-2 inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-gold-light/40 bg-olive-900/80 px-3 text-[0.78rem] text-cream backdrop-blur"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M10 3L5 8l5 5" />
            </svg>
            Voltar à casa
          </button>
        )}
      </div>

      <nav aria-label="Cômodos da casinha" className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {ROOMS.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={focus === r}
            onClick={() => setUserFocus(focus === r ? null : r)}
            className={`min-h-[40px] shrink-0 rounded-full border px-3.5 text-[0.8rem] whitespace-nowrap ${
              focus === r ? "border-olive-900 bg-olive-900 text-cream" : "border-olive-900/20 text-olive-900"
            }`}
          >
            {ROOM_LABEL[r]} <span className="opacity-75">{counts.get(r)}/{totals.get(r)}</span>
          </button>
        ))}
      </nav>

      {/* Equivalente textual da casa para leitores de tela */}
      <div className="sr-only">
        <p>A casa mostra os presentes já escolhidos, sem dizer quem deu.</p>
        {ROOMS.map((r) => {
          const list = house.filter((h) => h.room === r);
          return (
            <div key={r}>
              <h3>{ROOM_LABEL[r]}</h3>
              {list.length ? (
                <ul>
                  {list.map((h) => (
                    <li key={h.giftId}>
                      {giftMap.get(h.giftId)?.title ?? h.giftId}
                      {h.count > 1 ? ` (${h.count})` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum presente ainda.</p>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={!!cardGift} onClose={() => setCard(null)} title={cardGift?.title ?? ""}>
        {cardGift && (
          <div className="mt-3 flex items-start gap-4">
            <GiftIcon iconKey={cardGift.iconKey} className="h-16 w-16 shrink-0" />
            <div>
              <p className="text-[0.98rem]">{cardGift.description}</p>
              <p className="mt-2 text-[0.82rem] text-olive-900">
                {ROOM_LABEL[cardGift.room]}
                {cardGift.quantity > 1 ? ` · ${cardGift.reserved} de ${cardGift.quantity}` : ""}
              </p>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  );
}
