"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { GiftView, GiftsRepository, HouseItem, Message, ReserveResult } from "@/lib/types";
import { hasDemo } from "@/lib/types";
import { createRepository } from "./index";
import { browserStore } from "./storage";

const NAME_KEY = "chadosnoivos:guest-name";
const MINE_KEY = "chadosnoivos:my-gifts";
const POLL_MS = 20_000;

export interface MyGift {
  giftId: string;
  token: string;
}

export interface ReactionRequest {
  giftId: string;
  nonce: number;
}

interface GiftsContextValue {
  repo: GiftsRepository;
  gifts: GiftView[] | null;
  house: HouseItem[];
  guestName: string | null;
  setGuestName(name: string): void;
  myGifts: MyGift[];
  reserve(giftId: string): Promise<ReserveResult>;
  undo(giftId: string): Promise<void>;
  sendMessage(m: Message): Promise<void>;
  refresh(): Promise<void>;
  reaction: ReactionRequest | null;
  requestReaction(giftId: string): void;
  clearReaction(): void;
  demoEnabled: boolean;
}

const GiftsContext = createContext<GiftsContextValue | null>(null);

export function GiftsProvider({ children, repository }: { children: React.ReactNode; repository?: GiftsRepository }) {
  const repo = useMemo(() => repository ?? createRepository(), [repository]);
  const store = useMemo(() => browserStore(), []);
  const [gifts, setGifts] = useState<GiftView[] | null>(null);
  const [house, setHouse] = useState<HouseItem[]>([]);
  const [guestName, setName] = useState<string | null>(null);
  const [myGifts, setMyGifts] = useState<MyGift[]>([]);
  const [reaction, setReaction] = useState<ReactionRequest | null>(null);
  const nonce = useRef(0);

  const refresh = useCallback(async () => {
    const [g, h] = await Promise.all([repo.listGifts(), repo.houseState()]);
    setGifts(g);
    setHouse(h);
  }, [repo]);

  // Estado local do convidado (nome e escolhas) + carga inicial.
  // Lido após a montagem para não divergir do HTML estático (hidratação).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(store.get(NAME_KEY));
    try {
      const raw = store.get(MINE_KEY);
      if (raw) setMyGifts(JSON.parse(raw) as MyGift[]);
    } catch {
      /* ignora */
    }
    void refresh();
  }, [store, refresh]);

  // Estado coletivo: polling de 20 s e revalidação ao voltar o foco.
  useEffect(() => {
    const id = window.setInterval(() => void refresh(), POLL_MS);
    const onFocus = () => void refresh();
    const onVisible = () => document.visibilityState === "visible" && void refresh();
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const persistMine = useCallback(
    (next: MyGift[]) => {
      setMyGifts(next);
      store.set(MINE_KEY, JSON.stringify(next));
    },
    [store],
  );

  const setGuestName = useCallback(
    (name: string) => {
      const n = name.trim();
      setName(n);
      store.set(NAME_KEY, n);
    },
    [store],
  );

  const requestReaction = useCallback((giftId: string) => {
    nonce.current += 1;
    setReaction({ giftId, nonce: nonce.current });
  }, []);

  const reserve = useCallback(
    async (giftId: string) => {
      const name = guestName ?? "";
      const result = await repo.reserve(giftId, name);
      if (result.status === "ok") {
        persistMine([...myGifts, { giftId, token: result.token }]);
        requestReaction(giftId);
      }
      await refresh();
      return result;
    },
    [repo, guestName, myGifts, persistMine, refresh, requestReaction],
  );

  const undo = useCallback(
    async (giftId: string) => {
      const mine = myGifts.find((m) => m.giftId === giftId);
      if (!mine) return;
      await repo.undo(giftId, mine.token);
      persistMine(myGifts.filter((m) => m.giftId !== giftId));
      await refresh();
    },
    [repo, myGifts, persistMine, refresh],
  );

  const sendMessage = useCallback((m: Message) => repo.sendMessage(m), [repo]);
  const clearReaction = useCallback(() => setReaction(null), []);

  const value: GiftsContextValue = {
    repo,
    gifts,
    house,
    guestName,
    setGuestName,
    myGifts,
    reserve,
    undo,
    sendMessage,
    refresh,
    reaction,
    requestReaction,
    clearReaction,
    demoEnabled: hasDemo(repo),
  };

  return <GiftsContext.Provider value={value}>{children}</GiftsContext.Provider>;
}

export function useGifts(): GiftsContextValue {
  const ctx = useContext(GiftsContext);
  if (!ctx) throw new Error("useGifts precisa estar dentro de <GiftsProvider>");
  return ctx;
}
