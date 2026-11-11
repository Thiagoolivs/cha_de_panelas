import Link from "next/link";
import { site } from "@/config/site";
import { copy } from "@/content/copy";
import { DateBoard } from "@/components/ornaments/Board";
import { UtensilBand, UtensilCorner } from "@/components/ornaments/Utensils";

const GOLD = "var(--gold-light)";

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-olive-900 px-4 pt-7 pb-16 text-cream sm:pt-9">
      {/* moldura de filete dourado, como um cartão de papelaria */}
      <div className="pointer-events-none absolute inset-3 border border-gold/40 sm:inset-5" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-[18px] border border-gold/20 sm:inset-[26px]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(107,115,64,0.35), transparent 70%)" }}
        aria-hidden="true"
      />

      <UtensilBand className="relative mx-auto block h-[92px] w-full max-w-[400px] sm:h-[120px] sm:max-w-[520px]" mode="hang" color={GOLD} />
      <UtensilCorner className="pointer-events-none absolute top-44 left-10 hidden w-[140px] opacity-50 md:block lg:left-[9%]" color={GOLD} />
      <UtensilCorner className="pointer-events-none absolute top-44 right-10 hidden w-[140px] opacity-50 md:block lg:right-[9%]" flip color={GOLD} />

      <div className="relative mx-auto mt-6 max-w-md text-center">
        <p className="text-[0.68rem] font-medium tracking-[0.34em] text-gold-light uppercase">{copy.hero.eyebrow}</p>
        <h1 className="mt-4 font-serif text-[2.9rem] leading-[0.95] font-medium tracking-[0.08em] uppercase sm:text-[3.8rem]">
          {copy.hero.title}
        </h1>
        <p className="script mt-5 text-[4.6rem] text-gold-light sm:text-[5.6rem]" aria-label={site.couple.short}>
          {site.couple.short}
        </p>

        <div className="mt-7">
          <DateBoard day={site.event.dayLabel} month={site.event.monthLabel} time={site.event.timeLabel} />
        </div>

        <p className="mt-6 font-serif text-[1.15rem] italic text-cream">
          {site.event.address ?? copy.hero.addressSoon}
        </p>

        <div className="mt-9 flex flex-col items-center gap-2">
          <Link href="/presentes" className="btn btn-light w-full max-w-[300px]">
            {copy.hero.ctaGifts}
          </Link>
          <Link href="/recado" className="btn btn-ghost text-gold-light decoration-gold-light/50">
            {copy.hero.ctaMessage}
          </Link>
        </div>
      </div>
    </header>
  );
}
