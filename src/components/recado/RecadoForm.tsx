"use client";

import Link from "next/link";
import { useState } from "react";
import { useGifts } from "@/lib/repository/context";

const MIN = 20;
const MAX = 1000;

export function RecadoForm() {
  const { sendMessage, guestName } = useGifts();
  const [name, setName] = useState<string | null>(null);
  const [relation, setRelation] = useState("");
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [touched, setTouched] = useState(false);

  const author = name ?? guestName ?? "";
  const len = text.trim().length;
  const valid = author.trim().length >= 2 && len >= MIN && len <= MAX;

  if (state === "sent") {
    return (
      <div className="py-10 text-center" role="status">
        <p className="script text-[3.4rem] text-olive-700">Obrigada</p>
        <p className="mx-auto mt-4 max-w-sm">Seu recado chegou. A Kawany vai ler com calma, provavelmente com um café.</p>
        <div className="mt-8 flex flex-col items-center gap-2">
          <Link href="/presentes" className="btn btn-outline w-full max-w-[300px]">
            Ver a lista de presentes
          </Link>
          <Link href="/" className="btn btn-ghost">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="mt-6 space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setTouched(true);
        if (!valid) return;
        setState("sending");
        try {
          await sendMessage({ authorName: author, text, relation: relation || undefined });
          setState("sent");
        } catch {
          setState("error");
        }
      }}
    >
      <div>
        <label htmlFor="r-name" className="block text-[0.9rem] font-medium">
          Seu nome
        </label>
        <input
          id="r-name"
          className="field mt-2"
          value={author}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          maxLength={60}
          required
          aria-invalid={touched && author.trim().length < 2}
        />
      </div>
      <div>
        <label htmlFor="r-rel" className="block text-[0.9rem] font-medium">
          Como você conhece o casal? <span className="font-normal text-gray">(opcional)</span>
        </label>
        <input
          id="r-rel"
          className="field mt-2"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          maxLength={80}
          placeholder="Família, trabalho, faculdade..."
        />
      </div>
      <div>
        <label htmlFor="r-text" className="block text-[0.9rem] font-medium">
          Recado
        </label>
        <textarea
          id="r-text"
          className="field mt-2 min-h-[180px] resize-y"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX}
          required
          aria-describedby="r-count"
          aria-invalid={touched && (len < MIN || len > MAX)}
        />
        <p id="r-count" className={`mt-1 text-right text-[0.8rem] ${touched && len < MIN ? "text-board" : "text-gray"}`}>
          {len < MIN ? `Mínimo de ${MIN} caracteres (${len}/${MIN})` : `${len}/${MAX}`}
        </p>
      </div>
      {state === "error" && (
        <p role="alert" className="text-[0.9rem] text-board">
          Não deu para enviar agora. Tente de novo em instantes.
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full" disabled={state === "sending"}>
        {state === "sending" ? "Enviando" : "Enviar recado"}
      </button>
    </form>
  );
}
