import type { Metadata } from "next";
import Link from "next/link";
import { RecadoForm } from "@/components/recado/RecadoForm";
import { Sprig } from "@/components/ornaments/Utensils";

export const metadata: Metadata = { title: "Recado para a Kawany · Kaw e Than" };

export default function RecadoPage() {
  return (
    <main className="mx-auto max-w-lg px-4 pt-4 pb-20">
      <Link href="/" className="eyebrow inline-flex min-h-[44px] items-center">
        Kaw e Than · Chá dos Noivos
      </Link>
      <h1 className="title-caps text-[2.1rem]">Um recado</h1>
      <Sprig className="mt-3 w-28" />
      <p className="mt-4 border-l-2 border-olive-700 pl-4 text-[0.98rem]">
        Este recado vai só para a Kawany e não tem ligação com o presente que você escolheu.
      </p>
      <RecadoForm />
    </main>
  );
}
