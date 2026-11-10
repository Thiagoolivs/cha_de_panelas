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
    <div id="og" className="relative flex h-[630px] w-[1200px] items-center overflow-hidden" style={{ backgroundImage: "var(--paper)" }}>
      <div className="flex w-[560px] flex-col items-center pl-10 text-center">
        <UtensilBand className="h-[96px] w-[420px]" mode="hang" />
        <p className="eyebrow mt-4">Chá de panela</p>
        <h1 className="title-caps mt-2 text-[4.2rem]">Chá dos Noivos</h1>
        <p className="script mt-3 text-[6rem] text-olive-700">{site.couple.short}</p>
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
