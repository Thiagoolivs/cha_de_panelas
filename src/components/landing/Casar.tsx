"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { copy } from "@/content/copy";
import { wavyPath } from "@/components/ornaments/Wavy";

const W = 300;
const H = 380;
const WAVE = wavyPath(W, H);

/** Página 2 do convite: texto e a foto das mãos em moldura ondulada, com parallax. */
export function Casar() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const rotFront = useTransform(scrollYProgress, [0, 1], reduce ? [-4, -4] : [-10, 4]);
  const rotBack = useTransform(scrollYProgress, [0, 1], reduce ? [6, 6] : [12, 2]);

  return (
    <section ref={ref} aria-label={copy.casar.title} className="bg-green-ui px-6 pt-4 pb-20 text-white">
      <div className="mx-auto max-w-md">
        {/* Com movimento, o título aparece no fim da aliança 3D; aqui fica para leitores de tela. */}
        <h2 className={reduce ? "title-caps pt-10 pb-6 text-[3.6rem] text-white" : "sr-only"}>{copy.casar.title}</h2>
        <motion.p
          className="text-[1.05rem] leading-relaxed font-light"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
        >
          {copy.casar.body}
        </motion.p>

        <div className="relative mx-auto mt-12 w-[78%] max-w-[300px]" style={{ aspectRatio: `${W}/${H}` }}>
          <motion.svg viewBox={`-12 -12 ${W + 24} ${H + 24}`} className="absolute inset-0 h-full w-full" style={{ y: yBack, rotate: rotBack }} aria-hidden="true">
            <path d={WAVE} fill="#fff" opacity={0.9} />
          </motion.svg>
          <motion.svg viewBox={`-12 -12 ${W + 24} ${H + 24}`} className="absolute inset-0 h-full w-full drop-shadow-[0_10px_24px_rgba(0,0,0,0.25)]" style={{ rotate: rotFront }} role="img" aria-label={copy.casar.photoAlt}>
            <defs>
              <clipPath id="wavy-clip">
                <path d={WAVE} transform={`translate(${W * 0.04} ${H * 0.04}) scale(0.92)`} />
              </clipPath>
            </defs>
            <path d={WAVE} fill="#fff" />
            <image href="/assets/convite/maos.webp" x={0} y={0} width={W} height={H} preserveAspectRatio="xMidYMid slice" clipPath="url(#wavy-clip)" />
          </motion.svg>
        </div>
      </div>
    </section>
  );
}
