"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { hasDemo } from "@/lib/types";
import { useGifts } from "@/lib/repository/context";

/** Painel discreto do modo demonstração (NEXT_PUBLIC_DEMO=true). */
export function DemoPanel() {
  const { repo, refresh, house, gifts, requestReaction } = useGifts();
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState("");
  const path = usePathname();
  const demo = hasDemo(repo) ? repo.demo : null;
  const reserved = (gifts ?? []).filter((g) => house.some((h) => h.giftId === g.id));

  return (
    <div className="fixed right-3 bottom-3 z-40 text-[0.82rem]" data-demo-panel>
      {open ? (
        <div className="w-[260px] border border-olive-700/30 bg-cream/95 p-3 shadow-[0_6px_24px_rgba(43,43,36,0.15)] backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Modo demonstração</span>
            <button type="button" className="h-9 w-9 text-olive-900" aria-label="Fechar painel de demonstração" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <div className="mt-2 grid gap-1.5">
            {demo ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline min-h-[38px] py-1 text-[0.72rem]"
                  onClick={async () => {
                    const id = await demo.simulateGuest();
                    await refresh();
                    if (id) requestReaction(id);
                  }}
                >
                  Simular convidado
                </button>
                <button type="button" className="btn btn-outline min-h-[38px] py-1 text-[0.72rem]" onClick={async () => { await demo.fillHouse(); await refresh(); }}>
                  Encher a casa
                </button>
                <button type="button" className="btn btn-outline min-h-[38px] py-1 text-[0.72rem]" onClick={async () => { await demo.clearHouse(); await refresh(); }}>
                  Esvaziar a casa
                </button>
              </>
            ) : (
              <p className="text-[0.75rem] text-olive-900">Dados reais (banco). Simular e encher ficam só no modo local.</p>
            )}
            <label className="mt-1 block text-[0.75rem] text-olive-900" htmlFor="demo-replay">
              Rever reação
            </label>
            <div className="flex gap-1.5">
              <select id="demo-replay" className="field min-h-[38px] flex-1 py-1 text-[0.8rem]" value={pick} onChange={(e) => setPick(e.target.value)}>
                <option value="">Escolha um item</option>
                {(reserved.length ? reserved : gifts ?? []).map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
              <button type="button" className="btn btn-primary min-h-[38px] px-3 py-1 text-[0.72rem]" disabled={!pick} onClick={() => requestReaction(pick)}>
                Ver
              </button>
            </div>
            {path !== "/presentes" && (
              <Link href="/presentes" className="btn btn-ghost min-h-[36px] text-[0.8rem]">
                Ir para a casinha
              </Link>
            )}
            <Link href="/admin-preview" className="btn btn-ghost min-h-[36px] text-[0.8rem]">
              Prévia do admin
            </Link>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-[36px] rounded-full border border-olive-700/40 bg-cream/90 px-3 text-[0.72rem] tracking-[0.14em] text-olive-900 uppercase backdrop-blur"
        >
          Demo
        </button>
      )}
    </div>
  );
}
