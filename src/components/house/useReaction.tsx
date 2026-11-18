"use client";

import { useEffect, useRef, useState } from "react";
import type { GiftView, Room } from "@/lib/types";
import { useGifts } from "@/lib/repository/context";
import { REACTION_POSES, pickPhrase } from "@/lib/phrases";
import { AnimatePresence, motion } from "framer-motion";
import { Couple } from "@/components/characters/Couple";
import { ROOM_BOXES } from "./geometry";
import { SLOTS } from "./slots";
import { CAMERA_MS } from "./camera";

/** Linha do tempo da reação (ms desde o início). */
export const T = {
  drop: CAMERA_MS, // item cai no slot
  enter: CAMERA_MS + 600, // personagens entram
  look: CAMERA_MS + 1000, // olham o item
  pose: CAMERA_MS + 1300, // pose da categoria + frase
  exit: CAMERA_MS + 3000, // saem
  back: CAMERA_MS + 3400, // câmera volta
} as const;

export type Stage = "idle" | "zoom" | "drop" | "enter" | "look" | "pose" | "exit";

/** Altura de onde o item cai (unidades do SVG) e duração da queda. */
const DROP_FROM = -60;
const DROP_MS = 560;

/** Ease-out com um leve quique no fim (sem passar de ~4 unidades). */
function dropOffset(p: number): number {
  const t = Math.min(1, Math.max(0, p));
  const c1 = 1.25;
  const c3 = c1 + 1;
  const back = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  return DROP_FROM * (1 - back);
}

/**
 * Queda do item no slot. A posição é função só do tempo decorrido (não de um
 * passo a passo de física): fica igual a 30, 60 ou 120 quadros por segundo.
 * Antes, com quadros lentos (comum no iPhone durante o zoom), a mola "explodia",
 * o item ia para posições gigantes e o Safari deixava de desenhar o cômodo inteiro.
 */
function animateDrop(el: SVGGElement, onDone: () => void): () => void {
  let raf = 0;
  const t0 = performance.now();
  const step = (now: number) => {
    const elapsed = now - t0;
    const y = Math.max(DROP_FROM, Math.min(6, dropOffset(elapsed / DROP_MS)));
    el.setAttribute("opacity", String(Math.min(1, elapsed / 140)));
    el.setAttribute("transform", `translate(0 ${y.toFixed(2)})`);
    if (elapsed < DROP_MS) raf = requestAnimationFrame(step);
    else {
      el.removeAttribute("transform");
      el.removeAttribute("opacity");
      onDone();
    }
  };
  raf = requestAnimationFrame(step);
  return () => {
    cancelAnimationFrame(raf);
    el.removeAttribute("transform");
    el.removeAttribute("opacity");
  };
}

export function useReaction({ giftMap, reduce }: { giftMap: Map<string, GiftView>; reduce: boolean }) {
  const { reaction, clearReaction } = useGifts();
  const [stage, setStage] = useState<Stage>("idle");
  const [gift, setGift] = useState<GiftView | null>(null);
  const [phrase, setPhrase] = useState("");
  const dropRef = useRef<SVGGElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const giftMapRef = useRef(giftMap);
  useEffect(() => {
    giftMapRef.current = giftMap;
  }, [giftMap]);

  useEffect(() => {
    if (!reaction) return;
    const g = giftMapRef.current.get(reaction.giftId);
    clearReaction();
    if (!g) return;
    const p = pickPhrase(g);
    // Mesmo com "Reduzir movimento" ligado (comum no iPhone) os noivos aparecem:
    // a reação é o ponto alto. Nesse modo só a câmera e a queda do item ficam sem animação.
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    setGift(g);
    setPhrase(p);
    setStage("zoom");
    at(T.drop, () => setStage("drop"));
    at(T.enter, () => setStage("enter"));
    at(T.look, () => setStage("look"));
    at(T.pose, () => setStage("pose"));
    at(T.exit, () => setStage("exit"));
    at(T.back, () => {
      setStage("idle");
      setGift(null);
    });
  }, [reaction, clearReaction]);

  // Dispara a queda quando o item entra no DOM (sem queda se "Reduzir movimento").
  useEffect(() => {
    if (stage !== "drop" || !dropRef.current || reduce) return;
    return animateDrop(dropRef.current, () => {});
  }, [stage, reduce]);

  const active = stage !== "idle";
  const focus: Room | null = active && gift ? gift.room : null;

  let overlay: Partial<Record<Room, React.ReactNode>> | undefined;
  if (active && gift) {
    const box = ROOM_BOXES[gift.room];
    const slot = SLOTS[gift.room]?.[gift.slot];
    overlay = {
      [gift.room]: (
        <Couple
          key={gift.id}
          stage={stage}
          poses={REACTION_POSES[gift.category]}
          itemX={slot?.x ?? box.w / 2}
          roomW={box.w}
          roomH={box.h}
        />
      ),
    };
  }
  const showLabel = active && (stage === "pose" || stage === "exit");
  const label = (
    <AnimatePresence>
      {showLabel && (
        <motion.p
          key={phrase}
          className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#5a6030]/95 via-[#5a6030]/75 to-transparent px-6 pt-3 pb-8 text-center"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          aria-hidden="true"
        >
          <span className="hand inline-block text-[1.75rem] leading-[1.15] text-white sm:text-[2.3rem]">
            {phrase}
          </span>
        </motion.p>
      )}
    </AnimatePresence>
  );
  return {
    active,
    stage,
    gift,
    phrase,
    focus,
    hiddenGiftId: stage === "zoom" ? gift?.id ?? null : null,
    dropGiftId: stage === "drop" ? gift?.id ?? null : null,
    dropRef,
    overlay,
    label,
  };
}
