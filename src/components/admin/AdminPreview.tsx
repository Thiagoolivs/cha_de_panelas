"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminSnapshot, Tier } from "@/lib/types";
import { TIERS } from "@/lib/types";
import { useGifts } from "@/lib/repository/context";
import { ADMIN_KEY, UnauthorizedError } from "@/lib/repository/api";
import { TIER_LABEL } from "@/content/gifts-copy";
import { defaultGifts } from "@/data/gifts.default";
import { GiftIcon } from "@/components/icons/GiftIcon";

type Tab = "presentes" | "recados" | "pessoas";
type Filter = "todos" | "disponivel" | "parcial" | "reservado";
const FAV_KEY = "chadosnoivos:admin-favoritos";

const tierOf = new Map(defaultGifts.map((g) => [g.id, g.tier]));
const iconOf = new Map(defaultGifts.map((g) => [g.id, g.iconKey]));
const imageOf = new Map(defaultGifts.map((g) => [g.id, g.image]));

function readFavs(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

/** Painel da noiva: o que vai ganhar (nunca quem deu), recados e quem participou. */
export function AdminPreview() {
  const { repo, house } = useGifts();
  const [snap, setSnap] = useState<AdminSnapshot | null>(null);
  const [tab, setTab] = useState<Tab>("presentes");
  const [filter, setFilter] = useState<Filter>("todos");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [locked, setLocked] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    repo
      .adminView()
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavs(readFavs());
  }, []);

  const toggleFav = (key: string) =>
    setFavs((f) => {
      const n = new Set(f);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify([...n]));
      } catch {
        /* ignora */
      }
      return n;
    });

  const byTier = useMemo(() => {
    if (!snap) return [];
    return TIERS.map((t) => {
      const all = snap.gifts.filter((g) => tierOf.get(g.id) === t);
      const shown = all.filter((g) =>
        filter === "todos"
          ? true
          : filter === "reservado"
            ? g.status === "reservado"
            : filter === "parcial"
              ? g.status !== "reservado" && g.reserved > 0
              : g.reserved === 0,
      );
      const got = all.reduce((a, g) => a + g.reserved, 0);
      const total = all.reduce((a, g) => a + g.quantity, 0);
      return { tier: t as Tier, shown, got, total };
    });
  }, [snap, filter]);

  if (locked)
    return (
      <form
        className="card mt-8 max-w-sm space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            sessionStorage.setItem(ADMIN_KEY, pass);
          } catch {
            /* ignora */
          }
          setAttempt((n) => n + 1);
        }}
      >
        <label htmlFor="admin-pass" className="block text-[0.95rem] font-medium">
          Senha do painel
        </label>
        <input id="admin-pass" type="password" className="field" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" />
        {attempt > 0 && <p className="text-[0.85rem] text-board">Senha incorreta.</p>}
        <button type="submit" className="btn btn-primary w-full">
          Entrar
        </button>
      </form>
    );
  if (!snap) return <p className="mt-8 text-olive-900">Carregando…</p>;

  const total = snap.gifts.reduce((a, g) => a + g.quantity, 0);
  const got = snap.gifts.reduce((a, g) => a + g.reserved, 0);
  const pct = total ? Math.round((got / total) * 100) : 0;

  return (
    <div>
      <p className="mt-3 rounded-xl bg-white/70 px-4 py-3 text-[0.92rem]">
        Aqui você vê <b>o que vai ganhar</b>, nunca quem deu cada presente.
      </p>

      {/* resumo */}
      <section className="card mt-5 p-5" aria-label="Resumo">
        <div className="flex items-end justify-between">
          <div>
            <p className="hand text-[1.2rem] text-olive-700">presentes escolhidos</p>
            <p className="font-display text-[2.6rem] leading-none text-olive-700">
              {got}
              <span className="text-[1.3rem] text-gray"> de {total}</span>
            </p>
          </div>
          <p className="font-display text-[1.8rem] text-olive-700">{pct}%</p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-olive-700/15" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-olive-700 transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-cream p-2">
            <p className="font-display text-[1.6rem] text-olive-700">{snap.messages.length}</p>
            <p className="text-[0.78rem]">recados</p>
          </div>
          <div className="rounded-xl bg-cream p-2">
            <p className="font-display text-[1.6rem] text-olive-700">{snap.guests.length}</p>
            <p className="text-[0.78rem]">pessoas participaram</p>
          </div>
        </div>
      </section>

      <div role="tablist" aria-label="Painéis" className="mt-6 flex rounded-full bg-white/70 p-1">
        {(
          [
            ["presentes", "Presentes"],
            ["recados", "Recados"],
            ["pessoas", "Pessoas"],
          ] as const
        ).map(([t, label]) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)}
            className={`min-h-[42px] flex-1 rounded-full text-[0.85rem] font-medium transition-colors ${tab === t ? "bg-olive-700 text-white" : "text-olive-900"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "presentes" && (
        <div role="tabpanel" id="panel-presentes" aria-labelledby="tab-presentes" className="mt-4">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtrar presentes">
            {(
              [
                ["todos", "Todos"],
                ["reservado", "Reservados"],
                ["parcial", "Em parte"],
                ["disponivel", "Disponíveis"],
              ] as const
            ).map(([f, label]) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`min-h-[38px] shrink-0 rounded-full border px-4 text-[0.82rem] ${filter === f ? "border-olive-700 bg-olive-700 text-white" : "border-olive-700/30 text-olive-900"}`}
              >
                {label}
              </button>
            ))}
            <button type="button" onClick={load} className="ml-auto min-h-[38px] shrink-0 rounded-full px-3 text-[0.82rem] text-olive-700 underline underline-offset-4" disabled={loading}>
              {loading ? "Atualizando…" : "Atualizar"}
            </button>
          </div>

          {byTier.map(({ tier, shown, got: g, total: t }) => (
            <section key={tier} className="mt-6">
              <div className="flex items-baseline justify-between">
                <h2 className="title-caps text-[1.35rem]">{TIER_LABEL[tier].title}</h2>
                <span className="text-[0.82rem] text-olive-900">
                  {g} de {t}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-olive-700/15">
                <div className="h-full rounded-full bg-olive-700" style={{ width: `${t ? (g / t) * 100 : 0}%` }} />
              </div>
              {shown.length === 0 ? (
                <p className="mt-3 text-[0.85rem] text-gray">Nada aqui com esse filtro.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {shown.map((gift) => {
                    const img = imageOf.get(gift.id);
                    const done = gift.status === "reservado";
                    return (
                      <li key={gift.id} className="card flex items-center gap-3 p-2.5 pr-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream">
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <GiftIcon iconKey={iconOf.get(gift.id) ?? "caixa-presente"} className="h-10 w-10" />
                          )}
                        </span>
                        <span className="flex-1 text-[0.95rem] leading-tight">{gift.title}</span>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-[0.75rem] font-medium ${
                            done ? "bg-olive-700 text-white" : gift.reserved > 0 ? "border border-olive-700 text-olive-700" : "border border-olive-700/25 text-olive-900"
                          }`}
                        >
                          {done ? "Reservado" : gift.reserved > 0 ? `${gift.reserved} de ${gift.quantity}` : "Disponível"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {tab === "recados" && (
        <div role="tabpanel" id="panel-recados" aria-labelledby="tab-recados" className="mt-4 space-y-4">
          {snap.messages.length === 0 && <p className="text-[0.92rem] text-olive-900">Ainda não chegou nenhum recado.</p>}
          {[...snap.messages]
            .map((m) => ({ ...m, key: `${m.authorName}|${m.text}` }))
            .sort((a, b) => Number(favs.has(b.key)) - Number(favs.has(a.key)))
            .map((m) => (
              <article key={m.key} className="card relative p-5 pr-12">
                <p className="hand text-[1.3rem] leading-snug">{m.text}</p>
                <p className="mt-3 text-[0.85rem] text-olive-900">
                  {m.authorName}
                  {m.relation ? ` · ${m.relation}` : ""}
                </p>
                <button
                  type="button"
                  aria-pressed={favs.has(m.key)}
                  aria-label={favs.has(m.key) ? "Desfavoritar recado" : "Favoritar recado"}
                  onClick={() => toggleFav(m.key)}
                  className="absolute top-2 right-2 flex h-11 w-11 items-center justify-center text-olive-700"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill={favs.has(m.key) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.6}>
                    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                  </svg>
                </button>
              </article>
            ))}
        </div>
      )}

      {tab === "pessoas" && (
        <div role="tabpanel" id="panel-pessoas" aria-labelledby="tab-pessoas" className="mt-4">
          <p className="text-[0.88rem] text-olive-900">
            Quem escolheu presente ou deixou recado, em ordem alfabética. Não diz quem deu o quê.
          </p>
          {snap.guests.length === 0 ? (
            <p className="mt-3 text-[0.92rem]">Ninguém ainda.</p>
          ) : (
            <ul className="card mt-3 divide-y divide-olive-700/10 px-4">
              {snap.guests.map((g) => (
                <li key={g.name} className="py-2.5 text-[0.95rem]">
                  {g.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        type="button"
        className="btn btn-ghost mt-10"
        onClick={() => {
          try {
            sessionStorage.removeItem(ADMIN_KEY);
          } catch {
            /* ignora */
          }
          setSnap(null);
          setLocked(true);
        }}
      >
        Sair do painel
      </button>
    </div>
  );
}
