"use client";

import { useEffect, useRef, useState } from "react";
import type { GiftView, Room } from "@/lib/types";
import { useGifts } from "@/lib/repository/context";
import { useToast } from "@/components/ui/Toast";
import { pickPhrase } from "@/lib/phrases";
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

/** Queda curta (~600 ms) com mola bem amortecida: sem bounce exagerado. */
function animateDrop(el: SVGGElement, onDone: () => void): () => void {
  let raf = 0;
  let y = -60;
  let v = 0;
  let last = performance.now();
  const t0 = last;
  const k = 170; // rigidez
  const c = 2 * Math.sqrt(k) * 0.82; // amortecimento (ζ≈0,82)
  const step = (now: number) => {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    const a = -k * y - c * v;
    v += a * dt * 4;
    y += v * dt * 4;
    const elapsed = now - t0;
    el.style.opacity = String(Math.min(1, elapsed / 140));
    el.setAttribute("transform", `translate(0 ${y.toFixed(2)})`);
    if (elapsed < 650 && (Math.abs(y) > 0.05 || Math.abs(v) > 0.05)) raf = requestAnimationFrame(step);
    else {
      el.removeAttribute("transform");
      el.style.opacity = "";
      onDone();
    }
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

export function useReaction({ giftMap, reduce }: { giftMap: Map<string, GiftView>; reduce: boolean }) {
  const { reaction, clearReaction } = useGifts();
  const toast = useToast();
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
    if (reduce) {
      toast(p, "script");
      return;
    }
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
  }, [reaction, clearReaction, reduce, toast]);

  // Dispara a queda quando o item entra no DOM.
  useEffect(() => {
    if (stage !== "drop" || !dropRef.current) return;
    return animateDrop(dropRef.current, () => {});
  }, [stage]);

  const active = stage !== "idle";
  const focus: Room | null = active && gift ? gift.room : null;
  return {
    active,
    stage,
    gift,
    phrase,
    focus,
    hiddenGiftId: stage === "zoom" ? gift?.id ?? null : null,
    dropGiftId: stage === "drop" ? gift?.id ?? null : null,
    dropRef,
    overlay: undefined as Partial<Record<Room, React.ReactNode>> | undefined,
    label: null as React.ReactNode,
  };
}
