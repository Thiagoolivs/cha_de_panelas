"use client";

import { useEffect } from "react";
import { useGifts } from "@/lib/repository/context";
import { useToast } from "@/components/ui/Toast";
import { pickPhrase } from "@/lib/phrases";

/** Fase 1: sem casinha ainda. A reação vira um toast com a frase. */
export function HouseStage() {
  const { reaction, gifts, clearReaction } = useGifts();
  const toast = useToast();
  useEffect(() => {
    if (!reaction) return;
    const g = gifts?.find((x) => x.id === reaction.giftId);
    if (g) toast(pickPhrase(g), "script");
    clearReaction();
  }, [reaction, gifts, toast, clearReaction]);
  return <div className="aspect-[760/700] w-full bg-olive-700/5" aria-hidden="true" />;
}
