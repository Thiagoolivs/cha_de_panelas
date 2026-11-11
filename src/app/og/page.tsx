import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { DateBoard } from "@/components/ornaments/Board";
import { UtensilBand } from "@/components/ornaments/Utensils";
import { OgHouse } from "@/components/og/OgHouse";

export const metadata: Metadata = { robots: { index: false } };

/** Composição 1200×630 usada por `npm run og` para gerar src/app/opengraph-image.png. */
export default function OgPage() {
  if (!site.demo) notFound();
  return (
    <div id="og" className="house-theme relative flex h-[630px] w-[1200px] items-center overflow-hidden text-cream">
      <div className="pointer-events-none absolute inset-4 border border-gold/40" aria-hidden="true" />
      <div className="flex w-[560px] flex-col items-center pl-10 text-center">
        <UtensilBand className="h-[96px] w-[420px]" mode="hang" color="var(--gold-light)" />
        <p className="mt-4 text-[0.8rem] tracking-[0.34em] text-gold-light uppercase">Chá de panela</p>
        <h1 className="mt-2 font-serif text-[4.2rem] leading-none font-medium tracking-[0.08em] uppercase">Chá dos Noivos</h1>
        <p className="script mt-3 text-[6rem] text-gold-light">{site.couple.short}</p>
        <div className="mt-4 scale-[0.85]">
          <DateBoard day={site.event.dayLabel} month={site.event.monthLabel} time={site.event.timeLabel} />
        </div>
      </div>
      <div className="w-[600px] pr-10">
        <OgHouse />
      </div>
    </div>
  );
}
