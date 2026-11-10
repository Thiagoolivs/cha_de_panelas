import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { ICONS } from "@/components/icons/catalog";
import { GiftIcon } from "@/components/icons/GiftIcon";

export const metadata: Metadata = { title: "Ícones · Kaw e Than", robots: { index: false } };

/** Folha de ícones (só no modo demo), para revisar traço e legibilidade a 40 px. */
export default function IconesPage() {
  if (!site.demo) notFound();
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="title-caps text-[1.6rem]">Ícones da casinha</h1>
      <ul className="mt-6 grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8">
        {Object.keys(ICONS).map((k) => (
          <li key={k} className="flex flex-col items-center gap-1 text-center">
            <GiftIcon iconKey={k} className="h-[72px] w-[72px]" />
            <GiftIcon iconKey={k} className="h-10 w-10" />
            <span className="text-[0.65rem] leading-tight text-olive-900">{k}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
