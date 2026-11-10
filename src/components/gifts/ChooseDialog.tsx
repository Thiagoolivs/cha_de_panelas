"use client";

import { useState } from "react";
import type { GiftView } from "@/lib/types";
import { Dialog } from "@/components/ui/Dialog";
import { GiftIcon } from "@/components/icons/GiftIcon";
import { giftsCopy } from "@/content/gifts-copy";

interface Props {
  gift: GiftView | null;
  guestName: string | null;
  onSaveName(name: string): void;
  onConfirm(gift: GiftView): Promise<void>;
  onClose(): void;
}

/**
 * Modal de escolha: pede o nome na primeira vez e confirma o presente.
 * O pai monta com key={gift.id} para recomeçar o fluxo a cada presente.
 */
export function ChooseDialog({ gift, guestName, onSaveName, onConfirm, onClose }: Props) {
  const [step, setStep] = useState<"name" | "confirm">(guestName ? "confirm" : "name");
  const [name, setName] = useState(guestName ?? "");
  const [busy, setBusy] = useState(false);

  const nameOk = name.trim().length >= 2;

  return (
    <Dialog open={!!gift} onClose={onClose} title={step === "name" ? giftsCopy.nameTitle : giftsCopy.confirmTitle}>
      {gift && step === "name" && (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!nameOk) return;
            onSaveName(name);
            setStep("confirm");
          }}
        >
          <label htmlFor="guest-name" className="block text-[0.9rem] font-medium">
            {giftsCopy.nameLabel}
          </label>
          <input
            id="guest-name"
            data-autofocus
            className="field mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={60}
            required
          />
          <p className="mt-2 text-[0.85rem] text-olive-900">{giftsCopy.nameHint}</p>
          <button type="submit" className="btn btn-primary mt-5 w-full" disabled={!nameOk}>
            {giftsCopy.continue}
          </button>
        </form>
      )}

      {gift && step === "confirm" && (
        <div className="mt-4">
          <div className="flex items-center gap-4">
            <GiftIcon iconKey={gift.iconKey} className="h-16 w-16 shrink-0" />
            <p className="text-[1.02rem] leading-snug">
              {giftsCopy.confirm(gift.title)[0]}
              <em className="font-serif text-[1.2rem] font-medium not-italic text-olive-700">{gift.title}</em>
              {giftsCopy.confirm(gift.title)[2]}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              data-autofocus
              className="btn btn-primary w-full"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await onConfirm(gift);
              }}
            >
              {busy ? "Um instante" : giftsCopy.confirmBtn}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              {giftsCopy.cancel}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
