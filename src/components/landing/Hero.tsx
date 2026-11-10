import Link from "next/link";
import { site } from "@/config/site";
import { copy } from "@/content/copy";
import { DateBoard } from "@/components/ornaments/Board";
import { UtensilBand, UtensilCorner } from "@/components/ornaments/Utensils";

export function Hero() {
  return (
    <header className="relative overflow-hidden px-4 pb-14 pt-0">
      <UtensilBand className="mx-auto block h-[92px] w-full max-w-[420px]" mode="hang" />
      <UtensilCorner className="pointer-events-none absolute -left-6 bottom-0 hidden w-[130px] opacity-80 sm:block" />
      <UtensilCorner className="pointer-events-none absolute -right-6 bottom-0 hidden w-[130px] opacity-80 sm:block" flip />

      <div className="mx-auto mt-6 max-w-md text-center">
        <p className="eyebrow">{copy.hero.eyebrow}</p>
        <h1 className="title-caps mt-3 text-[2.6rem] sm:text-[3.2rem]">{copy.hero.title}</h1>
        <p className="script mt-2 text-[4.4rem] text-olive-700 sm:text-[5.2rem]" aria-label={site.couple.short}>
          {site.couple.short}
        </p>

        <div className="mt-6">
          <DateBoard day={site.event.dayLabel} month={site.event.monthLabel} time={site.event.timeLabel} />
        </div>

        <p className="mt-6 text-[0.95rem] text-olive-900">
          {site.event.address ?? <span className="italic">{copy.hero.addressSoon}</span>}
        </p>

        <div className="mt-8 flex flex-col items-center gap-2">
          <Link href="/presentes" className="btn btn-primary w-full max-w-[300px]">
            {copy.hero.ctaGifts}
          </Link>
          <Link href="/recado" className="btn btn-ghost">
            {copy.hero.ctaMessage}
          </Link>
        </div>
      </div>
    </header>
  );
}
