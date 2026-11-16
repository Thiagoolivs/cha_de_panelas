"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { OrganizerSnapshot } from "@/lib/types";
import { useGifts } from "@/lib/repository/context";
import { ORGANIZER_KEY, UnauthorizedError } from "@/lib/repository/api";
import { defaultGifts } from "@/data/gifts.default";
import { GiftIcon } from "@/components/icons/GiftIcon";

type View = "presente" | "pessoa";

const giftOrder = new Map(defaultGifts.map((g) => [g.id, g.order]));
const iconOf = new Map(defaultGifts.map((g) => [g.id, g.iconKey]));
const qtyOf = new Map(defaultGifts.map((g) => [g.id, g.quantity]));

const norm = (s: string) => s.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[̀-ͯ]/g, "");
const when = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })
    : "";

/** "Jogo de copos, Jogo de copos" vira "2× Jogo de copos". */
function summarize(gifts: { title: string }[]): string[] {
  const counts = new Map<string, number>();
  for (const g of gifts) counts.set(g.title, (counts.get(g.title) ?? 0) + 1);
  return [...counts].map(([t, n]) => (n > 1 ? `${n}× ${t}` : t));
}

/** Painel do organizador: nome ↔ presente. Senha própria, diferente da senha da noiva. */
export function OrganizerPanel() {
  const { repo, house } = useGifts();
  const [snap, setSnap] = useState<OrganizerSnapshot | null>(null);
  const [view, setView] = useState<View>("presente");
  const [q, setQ] = useState("");
  const [locked, setLocked] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    repo
      .organizerView()
      .then((s) => {
        setSnap(s);
        setLocked(false);
      })
      .catch((e) => {
        if (e instanceof UnauthorizedError) setLocked(true);
      })
      .finally(() => setLoading(false));
  }, [repo]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load, house, attempt]);

  const byGift = useMemo(() => {
    if (!snap) return [];
    const m = new Map<string, { giftId: string; title: string; people: { name: string; at: string | null }[] }>();
    for (const r of snap.reservations) {
      const e = m.get(r.giftId) ?? { giftId: r.giftId, title: r.giftTitle, people: [] };
      e.people.push({ name: r.guestName, at: r.at });
      m.set(r.giftId, e);
    }
    return [...m.values()].sort((a, b) => (giftOrder.get(a.giftId) ?? 0) - (giftOrder.get(b.giftId) ?? 0));
  }, [snap]);

  const byPerson = useMemo(() => {
    if (!snap) return [];
    const m = new Map<string, { name: string; gifts: { giftId: string; title: string }[] }>();
    for (const r of snap.reservations) {
      const k = norm(r.guestName.trim());
      const e = m.get(k) ?? { name: r.guestName.trim(), gifts: [] };
      e.gifts.push({ giftId: r.giftId, title: r.giftTitle });
      m.set(k, e);
    }
    return [...m.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, [snap]);

  const term = norm(q.trim());
  const giftsShown = term ? byGift.filter((g) => norm(g.title).includes(term) || g.people.some((p) => norm(p.name).includes(term))) : byGift;
  const peopleShown = term ? byPerson.filter((p) => norm(p.name).includes(term) || p.gifts.some((g) => norm(g.title).includes(term))) : byPerson;

  async function copyList() {
    const text = byPerson.map((p) => `${p.name}: ${summarize(p.gifts).join(", ")}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sem clipboard */
    }
  }

  if (locked)
    return (
      <form
        className="card mt-8 max-w-sm space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            sessionStorage.setItem(ORGANIZER_KEY, pass);
          } catch {
            /* ignora */
          }
          setAttempt((n) => n + 1);
        }}
      >
        <label htmlFor="org-pass" className="block text-[0.95rem] font-medium">
          Senha da organização
        </label>
        <input id="org-pass" type="password" className="field" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" />
        {attempt > 0 && <p className="text-[0.85rem] text-board">Senha incorreta.</p>}
        <button type="submit" className="btn btn-primary w-full">
          Entrar
        </button>
      </form>
    );
  if (!snap) return <p className="mt-8 text-olive-900">Carregando…</p>;

  return (
    <div>
      <p className="mt-3 rounded-xl bg-board/10 px-4 py-3 text-[0.92rem] text-ink">
        <b>Não mostre esta página para a noiva.</b> Aqui aparece quem escolheu cada presente. O Pix continua anônimo: só o total.
      </p>

      <section className="card mt-5 grid grid-cols-3 gap-2 p-4 text-center" aria-label="Resumo">
        <div>
          <p className="font-display text-[1.8rem] leading-none text-olive-700">{snap.reservations.length}</p>
          <p className="mt-1 text-[0.75rem]">presentes escolhidos</p>
        </div>
        <div>
          <p className="font-display text-[1.8rem] leading-none text-olive-700">{byPerson.length}</p>
          <p className="mt-1 text-[0.75rem]">pessoas</p>
        </div>
        <div>
          <p className="font-display text-[1.8rem] leading-none text-olive-700">R$ {snap.pix.total.toLocaleString("pt-BR")}</p>
          <p className="mt-1 text-[0.75rem]">em Pix ({snap.pix.count})</p>
        </div>
      </section>

      <div role="tablist" aria-label="Ver por" className="mt-6 flex rounded-full bg-white/70 p-1">
        {(
          [
            ["presente", "Por presente"],
            ["pessoa", "Por pessoa"],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`min-h-[42px] flex-1 rounded-full text-[0.85rem] font-medium transition-colors ${view === v ? "bg-olive-700 text-white" : "text-olive-900"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="search"
          className="field flex-1"
          placeholder="Buscar nome ou presente"
          aria-label="Buscar nome ou presente"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="button" onClick={load} disabled={loading} className="min-h-[44px] shrink-0 px-2 text-[0.85rem] text-olive-700 underline underline-offset-4">
          {loading ? "…" : "Atualizar"}
        </button>
      </div>

      {snap.reservations.length === 0 && <p className="mt-6 text-[0.95rem] text-olive-900">Ninguém escolheu presente ainda.</p>}

      {view === "presente" && (
        <ul className="mt-4 space-y-2">
          {giftsShown.map((g) => (
            <li key={g.giftId} className="card flex gap-3 p-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cream">
                <GiftIcon iconKey={iconOf.get(g.giftId) ?? "caixa-presente"} className="h-10 w-10" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline justify-between gap-2 text-[0.98rem] leading-tight font-medium">
                  {g.title}
                  <span className="shrink-0 text-[0.75rem] font-normal text-olive-900">
                    {g.people.length} de {qtyOf.get(g.giftId) ?? g.people.length}
                  </span>
                </p>
                <ul className="mt-1.5 space-y-0.5">
                  {g.people.map((p, i) => (
                    <li key={i} className="flex justify-between gap-2 text-[0.9rem]">
                      <span>{p.name}</span>
                      <span className="text-[0.75rem] text-gray">{when(p.at)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}

      {view === "pessoa" && (
        <>
          {byPerson.length > 0 && (
            <button type="button" onClick={copyList} className="btn btn-outline mt-4 w-full">
              {copied ? "Lista copiada!" : "Copiar lista (para WhatsApp)"}
            </button>
          )}
          <ul className="card mt-3 divide-y divide-olive-700/10 px-4">
            {peopleShown.map((p) => (
              <li key={p.name} className="py-3">
                <p className="font-medium">{p.name}</p>
                <p className="mt-0.5 text-[0.88rem] text-ink/75">{summarize(p.gifts).join(" · ")}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      <button
        type="button"
        className="btn btn-ghost mt-10"
        onClick={() => {
          try {
            sessionStorage.removeItem(ORGANIZER_KEY);
          } catch {
            /* ignora */
          }
          setSnap(null);
          setLocked(true);
        }}
      >
        Sair
      </button>
    </div>
  );
}
