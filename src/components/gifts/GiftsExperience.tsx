"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import type { GiftView } from "@/lib/types";
import { useGifts } from "@/lib/repository/context";
import { useToast } from "@/components/ui/Toast";
import { giftsCopy } from "@/content/gifts-copy";
import { GiftList } from "./GiftList";
import { ChooseDialog } from "./ChooseDialog";
import { MyGifts } from "./MyGifts";
import { AfterChoice } from "./AfterChoice";

// A casinha carrega depois, sem bloquear a lista.
const HouseStage = dynamic(() => import("@/components/house/HouseStage").then((m) => m.HouseStage), {
  ssr: false,
  loading: () => <div className="aspect-[760/700] w-full animate-pulse bg-olive-700/5" aria-hidden="true" />,
});

export function GiftsExperience() {
  const { gifts, myGifts, guestName, setGuestName, reserve, undo } = useGifts();
  const toast = useToast();
  const [selected, setSelected] = useState<GiftView | null>(null);
  const [lastChosen, setLastChosen] = useState<GiftView | null>(null);
  const [announce, setAnnounce] = useState("");
  const houseRef = useRef<HTMLDivElement>(null);

  const myIds = useMemo(() => new Set(myGifts.map((m) => m.giftId)), [myGifts]);
  const mine = useMemo(() => (gifts ?? []).filter((g) => myIds.has(g.id)), [gifts, myIds]);

  async function confirm(gift: GiftView) {
    const result = await reserve(gift.id);
    setSelected(null);
    if (result.status === "ok") {
      setLastChosen(gift);
      setAnnounce(giftsCopy.ok(gift.title));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      houseRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    } else {
      setAnnounce(giftsCopy.taken);
      toast(giftsCopy.taken);
    }
  }

  async function onUndo(gift: GiftView) {
    await undo(gift.id);
    if (lastChosen?.id === gift.id) setLastChosen(null);
    setAnnounce(giftsCopy.undone(gift.title));
    toast(giftsCopy.undone(gift.title));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10">
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>

      <div ref={houseRef} className="scroll-mt-2 lg:sticky lg:top-4 lg:self-start">
        <HouseStage />
        {lastChosen && (
          <div className="mt-3">
            <AfterChoice gift={lastChosen} onDismiss={() => setLastChosen(null)} />
          </div>
        )}
      </div>

      <div className="mt-8 lg:mt-0">
        <header>
          <Link href="/" className="eyebrow inline-flex min-h-[44px] items-center">
            Kaw e Than · Chá dos Noivos
          </Link>
          <h1 className="title-caps text-[2.1rem]">{giftsCopy.title}</h1>
          <p className="mt-2 text-[0.98rem]">{giftsCopy.intro}</p>
          <p className="mt-1 text-[0.88rem] text-olive-900">Os noivos não verão quem escolheu cada presente.</p>
        </header>

        {mine.length > 0 && (
          <div className="mt-6">
            <MyGifts gifts={mine} onUndo={onUndo} />
          </div>
        )}

        <div className="mt-6">
          <GiftList gifts={gifts} myIds={myIds} onChoose={setSelected} />
        </div>
      </div>

      <ChooseDialog
        key={selected?.id ?? "fechado"}
        gift={selected}
        guestName={guestName}
        onSaveName={setGuestName}
        onConfirm={confirm}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
