"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminSnapshot } from "@/lib/types";
import { ROOMS } from "@/lib/types";
import { useGifts } from "@/lib/repository/context";
import { ROOM_LABEL } from "@/content/gifts-copy";

export function AdminPreview() {
  const { repo, house } = useGifts();
  const [snap, setSnap] = useState<AdminSnapshot | null>(null);
  const [tab, setTab] = useState<"presentes" | "convidados" | "recados">("presentes");
  const [fav, setFav] = useState<Set<number>>(new Set());

  useEffect(() => {
    void repo.adminView().then(setSnap);
  }, [repo, house]);

  const byRoom = useMemo(() => {
    if (!snap) return [];
    return ROOMS.map((r) => ({ room: r, gifts: snap.gifts.filter((g) => g.room === r) })).filter((x) => x.gifts.length);
  }, [snap]);

  if (!snap) return <p className="mt-8 text-olive-900">Carregando…</p>;

  const total = snap.gifts.reduce((a, g) => a + g.quantity, 0);
  const got = snap.gifts.reduce((a, g) => a + g.reserved, 0);
  const confirmed = snap.guests.filter((g) => g.attending).length;

  return (
    <div>
      <p className="mt-4 border-l-2 border-olive-700 bg-white/60 py-2 pl-3 text-[0.92rem] text-olive-900">
        Aqui você vê o que vai ganhar, não quem deu.
      </p>

      <dl className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className="card p-3">
          <dt className="text-[0.72rem] tracking-[0.14em] text-olive-900 uppercase">Presentes</dt>
          <dd className="font-serif text-[1.8rem] text-olive-700">
            {got}
            <span className="text-[1rem] text-gray">/{total}</span>
          </dd>
        </div>
        <div className="card p-3">
          <dt className="text-[0.72rem] tracking-[0.14em] text-olive-900 uppercase">Confirmados</dt>
          <dd className="font-serif text-[1.8rem] text-olive-700">{confirmed}</dd>
        </div>
        <div className="card p-3">
          <dt className="text-[0.72rem] tracking-[0.14em] text-olive-900 uppercase">Recados</dt>
          <dd className="font-serif text-[1.8rem] text-olive-700">{snap.messages.length}</dd>
        </div>
      </dl>

      <div role="tablist" aria-label="Painéis" className="mt-6 flex border-b border-olive-700/25">
        {(["presentes", "convidados", "recados"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)}
            className={`min-h-[44px] flex-1 text-[0.8rem] tracking-[0.14em] uppercase ${
              tab === t ? "border-b-2 border-olive-700 font-medium text-olive-700" : "text-olive-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "presentes" && (
        <div role="tabpanel" id="panel-presentes" aria-labelledby="tab-presentes" className="mt-4 space-y-6">
          {byRoom.map(({ room, gifts }) => (
            <section key={room}>
              <h2 className="title-caps text-[1.15rem]">{ROOM_LABEL[room]}</h2>
              <ul className="mt-2 divide-y divide-olive-700/15">
                {gifts.map((g) => (
                  <li key={g.id} className="flex items-center justify-between gap-3 py-2 text-[0.94rem]">
                    <span>{g.title}</span>
                    <span
                      className={`shrink-0 rounded-full px-3 py-0.5 text-[0.75rem] ${
                        g.status === "reservado"
                          ? "bg-olive-700 text-cream"
                          : g.reserved > 0
                            ? "border border-olive-700 text-olive-700"
                            : "border border-olive-700/30 text-olive-900"
                      }`}
                    >
                      {g.status === "reservado" ? "Reservado" : g.reserved > 0 ? `${g.reserved} de ${g.quantity}` : "Disponível"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {tab === "convidados" && (
        <div role="tabpanel" id="panel-convidados" aria-labelledby="tab-convidados" className="mt-4">
          <p className="text-[0.9rem] text-olive-900">
            {confirmed} {confirmed === 1 ? "confirmado" : "confirmados"}
          </p>
          <ul className="mt-2 divide-y divide-olive-700/15">
            {snap.guests.map((g) => (
              <li key={g.name} className="flex justify-between py-2 text-[0.94rem]">
                <span>{g.name}</span>
                <span className={g.attending ? "text-olive-700" : "text-gray"}>{g.attending ? "vai" : "não vai"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "recados" && (
        <div role="tabpanel" id="panel-recados" aria-labelledby="tab-recados" className="mt-4 space-y-4">
          {snap.messages.map((m, i) => (
            <article key={i} className="card relative p-5 pr-12">
              <p className="font-serif text-[1.15rem] leading-snug">{m.text}</p>
              <p className="mt-3 text-[0.85rem] text-olive-900">
                {m.authorName}
                {m.relation ? ` · ${m.relation}` : ""}
              </p>
              <button
                type="button"
                aria-pressed={fav.has(i)}
                aria-label={fav.has(i) ? "Desfavoritar recado" : "Favoritar recado"}
                onClick={() =>
                  setFav((f) => {
                    const n = new Set(f);
                    if (n.has(i)) n.delete(i);
                    else n.add(i);
                    return n;
                  })
                }
                className="absolute top-2 right-2 flex h-11 w-11 items-center justify-center text-olive-700"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill={fav.has(i) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.4}>
                  <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                </svg>
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
