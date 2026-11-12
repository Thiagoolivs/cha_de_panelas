"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/config/site";
import { copy } from "@/content/copy";

/** Página 4 do convite: o celular com o vídeo explicativo, que se inclina em 3D na rolagem. */
export function ComoFazerParte() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [38, 0]);
  const rotZ = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-8, 0]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, 0]);

  return (
    <section ref={ref} aria-labelledby="como-title" className="bg-green-ui px-6 py-16 text-center text-white">
      <h2 id="como-title" className="font-display text-[2.6rem] leading-[0.95] uppercase">
        {copy.comoFazerParte.title}
      </h2>
      <p className="mx-auto mt-4 max-w-xs text-[0.95rem] font-bold">{copy.comoFazerParte.body}</p>
      <Link href="/presentes" className="btn btn-light mt-6">
        {copy.comoFazerParte.cta}
      </Link>

      <div className="mt-10 [perspective:900px]">
        <motion.div
          style={{ rotateX: rotX, rotateZ: rotZ, y }}
          className="relative mx-auto aspect-[9/19] w-[58%] max-w-[240px] rounded-[2.4rem] border-[7px] border-ink bg-ink shadow-[0_30px_50px_-20px_rgba(0,0,0,0.6)]"
        >
          <div className="absolute top-2 left-1/2 z-10 h-5 w-[36%] -translate-x-1/2 rounded-full bg-ink" />
          <div className="absolute inset-0 overflow-hidden rounded-[1.9rem] bg-green">
            {site.videoUrl ? (
              <video src={site.videoUrl} controls playsInline preload="none" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="-rotate-90 text-[0.8rem] whitespace-nowrap text-white">{copy.comoFazerParte.videoSoon}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <p className="mt-10 text-[0.85rem]">{copy.comoFazerParte.privacy}</p>
    </section>
  );
}
