"use client";

import { useState } from "react";
import type { GiftView } from "@/lib/types";
import { Dialog } from "@/components/ui/Dialog";
import { GiftIcon } from "@/components/icons/GiftIcon";
import { giftsCopy } from "@/content/gifts-copy";

export interface ChooseDetails {
  name: string;
  /** Recado para os noivos (obrigatório na primeira escolha deste aparelho). */
  message: string | null;
}

interface Props {
  gift: GiftView | null;
  guestName: string | null;
  /** Este aparelho já mandou recado: não pede de novo. */
  messageSent: boolean;
  onConfirm(gift: GiftView, qty: number, details: ChooseDetails): Promise<void>;
  onClose(): void;
}

/**
 * Modal de escolha: nome e recado para os noivos (obrigatórios) e confirmação.
 * O pai monta com key={gift.id} para recomeçar o fluxo a cada presente.
 */
export function ChooseDialog({ gift, guestName, messageSent, onConfirm, onClose }: Props) {
  const [name, setName] = useState(guestName ?? "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState(false);
  const [qty, setQty] = useState(1);
  const max = Math.max(1, gift?.remaining ?? 1);

  const MIN = giftsCopy.messageMin;
  const len = message.trim().length;
  const nameOk = name.trim().length >= 2;
  const messageOk = messageSent || (len >= MIN && len <= giftsCopy.messageMax);
  const ready = nameOk && messageOk;

  return (
    <Dialog open={!!gift} onClose={onClose} title={giftsCopy.confirmTitle}>
      {gift && (
        <form
          noValidate
          className="mt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setTouched(true);
            if (!ready || busy) return;
            setBusy(true);
            setError(false);
            try {
              await onConfirm(gift, Math.min(qty, max), { name: name.trim(), message: messageSent ? null : message.trim() });
            } catch {
              setError(true);
              setBusy(false);
            }
          }}
        >
          <div className="flex items-center gap-4">
            <GiftIcon iconKey={gift.iconKey} className="h-16 w-16 shrink-0" />
            <p className="text-[1.02rem] leading-snug">
              {giftsCopy.confirm(gift.title)[0]}
              <em className="font-serif text-[1.2rem] font-medium not-italic text-olive-700">{qty > 1 ? `${qty}× ${gift.title}` : gift.title}</em>
              {giftsCopy.confirm(gift.title)[2]}
            </p>
          </div>
          <p className="mt-3 rounded-xl bg-white px-3 py-2 text-[0.88rem] text-olive-900">{giftsCopy.buyAndBring}</p>

          {max > 1 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3">
              <span id="qty-label" className="text-[0.95rem] font-medium">
                {giftsCopy.howMany}
              </span>
              <div className="flex items-center gap-3" role="group" aria-labelledby="qty-label">
                <button type="button" aria-label="Menos um" className="h-10 w-10 rounded-full border border-olive-700/40 text-[1.3rem] text-olive-700 disabled:opacity-30" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <output aria-live="polite" className="w-6 text-center font-display text-[1.5rem] text-olive-700">
                  {qty}
                </output>
                <button type="button" aria-label="Mais um" className="h-10 w-10 rounded-full border border-olive-700/40 text-[1.3rem] text-olive-700 disabled:opacity-30" disabled={qty >= max} onClick={() => setQty((q) => Math.min(max, q + 1))}>
                  +
                </button>
              </div>
            </div>
          )}

          <label htmlFor="guest-name" className="mt-5 block text-[0.9rem] font-medium">
            {giftsCopy.nameLabel}
          </label>
          <input
            id="guest-name"
            data-autofocus={!guestName || undefined}
            className="field mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={60}
            required
            aria-invalid={touched && !nameOk}
          />

          {messageSent ? (
            <p className="mt-4 rounded-xl bg-white px-3 py-2 text-[0.88rem] text-olive-900">{giftsCopy.messageDone}</p>
          ) : (
            <>
              <label htmlFor="guest-message" className="mt-4 block text-[0.9rem] font-medium">
                {giftsCopy.messageLabel}
              </label>
              <textarea
                id="guest-message"
                data-autofocus={guestName ? true : undefined}
                className="field mt-2 min-h-[110px] resize-y"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={giftsCopy.messagePlaceholder}
                maxLength={giftsCopy.messageMax}
                required
                aria-describedby="guest-message-hint"
                aria-invalid={touched && !messageOk}
              />
              <p id="guest-message-hint" className="mt-1 flex justify-between gap-3 text-[0.8rem]">
                <span className="text-olive-900">{giftsCopy.messageHint}</span>
                <span className={`shrink-0 ${touched && len < MIN ? "text-board" : "text-gray"}`}>{len < MIN ? `${len}/${MIN}` : "✓"}</span>
              </p>
            </>
          )}

          {error && (
            <p role="alert" className="mt-3 text-[0.9rem] text-board">
              {giftsCopy.sendError}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <button type="submit" className={`btn btn-primary w-full ${ready ? "" : "opacity-50"}`} disabled={busy}>
              {busy ? "Um instante" : giftsCopy.confirmBtn}
            </button>
            {touched && !ready && (
              <p role="alert" className="text-center text-[0.85rem] text-board">
                {!nameOk ? "Escreva seu nome." : giftsCopy.messageCount(len, MIN)}
              </p>
            )}
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              {giftsCopy.cancel}
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
