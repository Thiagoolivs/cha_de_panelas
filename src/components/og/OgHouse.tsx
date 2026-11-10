"use client";

import { defaultGifts } from "@/data/gifts.default";
import { House } from "@/components/house/House";

const items = defaultGifts
  .filter((_, i) => i % 2 === 0)
  .map((g) => ({ giftId: g.id, room: g.room, slot: g.slot, iconKey: g.iconKey, count: 1 }));

/** Casinha estática (meio cheia) para a imagem de compartilhamento. */
export function OgHouse() {
  return <House items={items} gifts={new Map()} focus={null} onRoom={() => {}} onItem={() => {}} />;
}
