import type { Metadata } from "next";
import Link from "next/link";
import { defaultGifts, giftPhotos } from "@/data/gifts.default";

export const metadata: Metadata = { title: "Créditos das fotos · Kaw e Than" };

/** Atribuição das fotos dos presentes (licenças Creative Commons, via Openverse). */
export default function CreditosPage() {
  const rows = defaultGifts.filter((g) => giftPhotos[g.id]);
  return (
    <main className="mx-auto max-w-lg px-5 pt-6 pb-20">
      <Link href="/presentes" className="eyebrow inline-flex min-h-[44px] items-center">
        Voltar à lista
      </Link>
      <h1 className="title-caps text-[2.2rem]">Créditos das fotos</h1>
      <p className="mt-3 text-[0.92rem]">
        As fotos dos presentes são ilustrativas e vêm de bancos de imagens com licença Creative Commons, encontradas pelo Openverse.
      </p>
      <ul className="mt-6 space-y-3 text-[0.85rem]">
        {rows.map((g) => {
          const p = giftPhotos[g.id];
          return (
            <li key={g.id}>
              <span className="font-medium">{g.title}</span>: {p.title ? `“${p.title}” ` : ""}por {p.author} ·{" "}
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {p.license}
              </a>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
