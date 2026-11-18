"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { copy } from "@/content/copy";
import { useGifts } from "@/lib/repository/context";

const KEY = "chadosnoivos:my-pix";
const brl = (v: number) => `R$ ${v},00`;

interface Mine {
  token: string;
  amount: number;
}

function readMine(): Mine[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]") as Mine[];
    return Array.isArray(v) ? v.filter((m) => typeof m.token === "string" && typeof m.amount === "number") : [];
  } catch {
    return [];
  }
}

function saveMine(m: Mine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    /* sem localStorage: só não dá para desfazer depois */
  }
}

/** "Já fez o Pix?": o convidado marca só o valor, sem nome. A noiva vê apenas o total. */
export function PixMark() {
  const { repo } = useGifts();
  const [picked, setPicked] = useState<number | null>(null);
  const [mine, setMine] = useState<Mine[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const m = copy.pix.mark;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMine(readMine());
  }, []);

  async function confirm() {
    if (picked == null || busy) return;
    setBusy(true);
    setError(false);
    try {
      const { token } = await repo.contribute(picked);
      const next = [...readMine(), { token, amount: picked }];
      saveMine(next);
      setMine(next);
      setPicked(null);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function undo(item: Mine) {
    setBusy(true);
    try {
      await repo.undoContribution(item.token);
      const next = readMine().filter((x) => x.token !== item.token);
      saveMine(next);
      setMine(next);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-sm rounded-3xl bg-white p-5 text-center text-ink shadow-[0_10px_30px_rgba(0,0,0,0.18)]" aria-labelledby="pix-mark-title">
      <p id="pix-mark-title" className="title-caps text-[1.7rem] leading-none text-olive-700">
        {m.title}
      </p>
      <p className="mt-2 text-[0.95rem]">{mine.length ? m.another : m.lead}</p>

      <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Valor do Pix">
        {site.pix.quotas.map((q) => (
          <button
            key={q.value}
            type="button"
            role="radio"
            aria-checked={picked === q.value}
            onClick={() => setPicked(picked === q.value ? null : q.value)}
            className={`min-h-[52px] rounded-2xl border-2 font-display text-[1.25rem] transition-colors ${
              picked === q.value ? "border-olive-700 bg-olive-700 text-white" : "border-olive-700/25 text-olive-900"
            }`}
          >
            {brl(q.value)}
          </button>
        ))}
      </div>

      {picked != null && (
        <button type="button" onClick={confirm} disabled={busy} className="btn btn-primary mt-3 w-full">
          {busy ? "Anotando…" : m.confirm(brl(picked))}
        </button>
      )}

      <div aria-live="polite">
        {error && <p className="mt-3 text-[0.88rem] text-board">{m.error}</p>}
        {mine.map((x) => (
          <p key={x.token} className="mt-3 flex items-center justify-center gap-3 rounded-xl bg-cream px-3 py-2 text-[0.92rem]">
            <span className="text-olive-900">{m.done(brl(x.amount))}</span>
            <button type="button" onClick={() => undo(x)} disabled={busy} className="text-[0.85rem] text-olive-700 underline underline-offset-4">
              {m.undo}
            </button>
          </p>
        ))}
      </div>

      <p className="mt-4 flex items-start gap-2 text-left text-[0.82rem] leading-snug text-ink/70">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-olive-700" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        {m.privacy}
      </p>
    </div>
  );
}
