"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";
import assets from "@/generated/assets.json";
import { copy } from "@/content/copy";
import { BorderLine } from "@/components/ornaments/BorderLine";

const spring = { type: "spring" as const, stiffness: 170, damping: 16 };

/** Página 1 do convite, animada. */
export function Hero() {
  const reduce = !!useReducedMotion();
  const pop = (delay: number, from: Record<string, number> = { y: 24, scale: 0.85 }) =>
    reduce ? {} : { initial: { opacity: 0, ...from }, animate: { opacity: 1, y: 0, scale: 1, rotate: 0, x: 0 }, transition: { ...spring, delay } };
  const float = (d: number) =>
    reduce ? {} : { animate: { y: [0, -6, 0] }, transition: { duration: 4 + d, repeat: Infinity, ease: "easeInOut" as const, delay: 1.6 + d } };

  return (
    <header className="relative overflow-hidden px-4 pt-4 pb-6">
      {/* utensílios pendurados do topo */}
      <motion.img
        src="/assets/convite/utensilios-pote.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-1 left-[6%] w-[22%] max-w-[120px] origin-top"
        {...(reduce ? {} : { initial: { y: -80, rotate: -18 }, animate: { y: 0, rotate: 0 }, transition: { type: "spring", stiffness: 90, damping: 9, delay: 0.1 } })}
      />
      <motion.img
        src="/assets/convite/utensilios-panelas.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-[3%] w-[34%] max-w-[190px] origin-top"
        {...(reduce ? {} : { initial: { y: -90, rotate: 16 }, animate: { y: 0, rotate: 0 }, transition: { type: "spring", stiffness: 80, damping: 9, delay: 0.25 } })}
      />

      <div className="relative mx-auto max-w-[460px] pt-[27vw] text-center sm:pt-[130px]">
        <motion.p className="hand ml-[24%] -mb-1 w-fit -rotate-12 text-[clamp(1.3rem,6vw,1.8rem)]" {...pop(0.5, { y: -10 })}>
          {copy.hero.kicker}
        </motion.p>
        <motion.h1
          className="title-caps text-[clamp(2.35rem,10.6vw,4.2rem)] whitespace-nowrap"
          {...(reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] as const, delay: 0.3 } })}
        >
          {copy.hero.title}
        </motion.h1>
        <motion.p
          className="script relative -mt-[0.3em] text-[clamp(3rem,14vw,5.4rem)] text-ink"
          aria-label={site.couple.short}
          {...(reduce
            ? {}
            : { initial: { clipPath: "inset(0 100% 0 0)" }, animate: { clipPath: "inset(0 0% 0 0)" }, transition: { duration: 1.4, ease: "easeInOut" as const, delay: 0.7 } })}
        >
          {site.couple.short}
        </motion.p>

        {/* o casal, nas proporções da página 1 do convite: rosto em foto, véu e gravata */}
        <div className="relative mx-auto mt-[2%] aspect-[500/235] w-full">
          <motion.div className="absolute top-[4%] left-[8%] w-[48%]" {...pop(1.0)}>
            <motion.div {...float(0)} className="relative">
              <img src="/assets/convite/veu.webp" alt="" aria-hidden="true" className="absolute -top-[7%] left-[14%] w-[76%] max-w-none" />
              <img src={assets.faces.kawany.sorriso ?? "/assets/convite/rosto-kawany.webp"} alt="Kawany" className="relative w-full" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute top-[2%] left-[58%] w-[21%]" {...pop(1.2)}>
            <motion.div {...float(0.6)} className="relative">
              <img src={assets.faces.nathan.sorriso ?? "/assets/convite/rosto-nathan.webp"} alt="Nathan" className="relative w-full" />
              <img src="/assets/convite/gravata.svg" alt="" aria-hidden="true" className="absolute top-[93%] left-[10%] w-[80%] max-w-none" />
            </motion.div>
          </motion.div>
        </div>

        {/* tábua com a data */}
        <motion.div
          className="relative mx-auto mt-[6%] w-[min(58vw,250px)] -rotate-[11deg]"
          {...(reduce ? {} : { initial: { opacity: 0, y: -40, rotate: 10 }, animate: { opacity: 1, y: 0, rotate: -11 }, transition: { type: "spring", stiffness: 120, damping: 11, delay: 1.5 } })}
        >
          <img src="/assets/convite/tabua.svg" alt="" aria-hidden="true" className="w-full drop-shadow-[0_6px_10px_rgba(31,28,24,0.18)]" />
          <p className="absolute inset-y-0 left-[9%] flex w-[58%] flex-col items-center justify-center font-display leading-[1.05] text-cream">
            <span className="text-[clamp(1.15rem,5.4vw,1.6rem)] uppercase">
              {site.event.dayLabel} de {site.event.monthLabel}
            </span>
            <span className="hand text-[clamp(1.1rem,5vw,1.5rem)]">{site.event.timeLabel}</span>
          </p>
        </motion.div>

        <motion.p className="hand mt-5 text-[1.3rem]" {...pop(1.8, { y: 8 })}>
          {site.event.address ?? copy.hero.addressSoon}
        </motion.p>

        <motion.div className="mt-6 flex flex-col items-center gap-1" {...pop(2.0, { y: 10 })}>
          <Link href="/presentes" className="btn btn-primary w-full max-w-[300px]">
            {copy.hero.ctaGifts}
          </Link>
          <Link href="/recado" className="btn btn-ghost">
            {copy.hero.ctaMessage}
          </Link>
        </motion.div>
      </div>

      <BorderLine className="mt-6" delay={1.2} />
    </header>
  );
}
