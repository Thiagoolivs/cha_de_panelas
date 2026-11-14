"use client";

import { useEffect, useRef, useState } from "react";
import assets from "@/generated/assets.json";
import type { Pose } from "@/lib/phrases";
import type { Stage } from "@/components/house/useReaction";
import { REST, applyJoints, approach, emptyRefs, poseJoints, type Joints, type RigRefs } from "./rig";

type Expr = "sorriso" | "surpresa" | "gargalhada";
type Who = "kawany" | "nathan";

const CREAM = "#ffffff";
const SKIN = "#f3e2cf";
const TAN = "#737373"; // colete cinza (paleta do convite)

/* ---------- rostos ---------- */

function facePhoto(who: Who, expr: Expr): string | null {
  const f = assets.faces[who] as Record<Expr, string | null>;
  return f[expr] ?? f.sorriso ?? null;
}

/** Cachos: círculos em volta da cabeça, do topo até os ombros. */
const CURLS: [number, number, number][] = [
  [0, -139, 13], [-11, -138, 9], [11, -138, 9], [-6, -147, 6.5], [6, -147, 6.5], [-16, -130, 7], [16, -130, 7],
  [-19, -121, 6.5], [19, -121, 6.5], [-20, -112, 6], [20, -112, 6], [-18, -104, 5.5], [18, -104, 5.5],
  [-14, -100, 4.5], [14, -100, 4.5],
];

function DrawnFace({ who, expr }: { who: Who; expr: Expr }) {
  const mouth =
    expr === "surpresa" ? <ellipse cx={0} cy={-115} rx={2} ry={2.6} /> : expr === "gargalhada" ? <path d="M-5 -117q5 6 10 0z" fill={CREAM} /> : <path d="M-4.5 -117q4.5 3.5 9 0" />;
  const eyes =
    expr === "surpresa" ? (
      <>
        <circle cx={-5.5} cy={-125} r={1.2} fill="var(--olive-700)" />
        <circle cx={5.5} cy={-125} r={1.2} fill="var(--olive-700)" />
      </>
    ) : (
      <path d="M-8 -125q2.5-2.5 5 0M3 -125q2.5-2.5 5 0" />
    );
  if (who === "kawany") {
    return (
      <g>
        {/* Silhueta dos cachos: contorno só por fora (traço largo embaixo, preenchimento por cima). */}
        <g strokeWidth={2.6}>
          {CURLS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="none" />
          ))}
        </g>
        <g fill="#8a6440" stroke="none">
          {CURLS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} />
          ))}
        </g>
        <path d="M-15 -112c-2 2-2 5 0 6M15 -112c2 2 2 5 0 6M-17 -125c-2 2-2 4 0 6M17 -125c2 2 2 4 0 6M-6 -146c2-2 4-2 5 0M4 -146c2-2 4-2 5 0" opacity={0.55} />
        <ellipse cx={0} cy={-123} rx={12} ry={14.5} fill={SKIN} />
        <path d="M-12 -129c2-6 7-9 12-9s10 3 12 9c-4-3-8-4-12-4s-8 1-12 4z" fill="#8a6440" />
        {eyes}
        {mouth}
        <path d="M-8 -119h.1M8 -119h.1" stroke="#d9a796" strokeWidth={2.4} opacity={0.35} />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx={-13} cy={-123} rx={2.4} ry={3.6} fill={SKIN} />
      <ellipse cx={13} cy={-123} rx={2.4} ry={3.6} fill={SKIN} />
      <ellipse cx={0} cy={-124} rx={12.5} ry={15.5} fill={SKIN} />
      <path d="M-13 -127c-1-10 4-17 13-17s14 6 13 17c-2-6-6-9-13-9s-11 3-13 9z" fill="#3a3324" />
      {eyes}
      {mouth}
    </g>
  );
}

/**
 * Geometria do recorte de cada rosto: centro do rosto (fração da imagem), largura
 * do rosto (fração) e proporção. Medido nos recortes do convite (scripts/extract_assets.py).
 */
const PHOTO = {
  kawany: { cx: 0.51, cy: 0.4, face: 0.42, aspect: 516 / 560 },
  nathan: { cx: 0.5, cy: 0.58, face: 0.88, aspect: 467 / 320 },
} as const;
const FACE_W = 26; // largura do rosto em unidades do personagem (cabeça ~1/3 do corpo)

function Face({ who, expr }: { who: Who; expr: Expr }) {
  const photo = facePhoto(who, expr);
  if (photo) {
    // Foto do convite: pouca resolução, por isso a cabeça nunca passa de ~120 px CSS.
    const g = PHOTO[who];
    const w = FACE_W / g.face;
    const h = w * g.aspect;
    return <image href={photo} x={-g.cx * w} y={-124 - g.cy * h} width={w} height={h} preserveAspectRatio="none" />;
  }
  return <DrawnFace who={who} expr={expr} />;
}

const HAS_PHOTO = { kawany: !!facePhoto("kawany", "sorriso"), nathan: !!facePhoto("nathan", "sorriso") };

/* ---------- braços ---------- */

function Arm({ sleeve, bindForearm, side, slim = false }: { sleeve: string; bindForearm: (el: SVGGElement | null) => void; side: "l" | "r"; slim?: boolean }) {
  const w = slim ? 2.7 : 3.4; // meia largura no ombro
  return (
    <g data-joint={`${side}-shoulder`}>
      <path d={`M${-w} 0C${-w - 0.3} 8 ${-w + 0.2} 16 ${-w + 0.6} 24H${w - 0.6}C${w - 0.2} 16 ${w + 0.3} 8 ${w} 0Q0 ${-w} ${-w} 0z`} fill={sleeve} />
      <g ref={bindForearm} data-joint={`${side}-elbow`}>
        <path d={`M${-w + 0.6} 0C${-w + 0.4} 7 ${-w + 0.9} 14 ${-w + 1.2} 19H${w - 1.2}C${w - 0.9} 14 ${w - 0.4} 7 ${w - 0.6} 0z`} fill={SKIN} />
        {/* mão: palma e polegar */}
        <path d={`M${-w + 0.8} 18.5c-0.6 2.6-0.2 6 2.4 6.6 2.4 0.5 4-1.6 3.8-4.6l-0.2-2z`} fill={SKIN} />
      </g>
    </g>
  );
}

/** Sombra suave no chão, para os dois "pisarem" no cômodo. */
function GroundShadow({ rx }: { rx: number }) {
  return <ellipse cx={0} cy={-0.5} rx={rx} ry={3.2} fill="#1f1c18" fillOpacity={0.22} stroke="none" />;
}

/* ---------- corpos ---------- */

/** Referências do rig num objeto estável (escrito pelos callback refs, lido no laço rAF). */
function useRigRefs() {
  const [rig] = useState(() => {
    const refs: RigRefs = emptyRefs();
    const set = (k: keyof RigRefs) => (el: SVGGElement | null) => {
      refs[k] = el;
    };
    return { refs, set };
  });
  return rig;
}

interface FigureProps {
  who: Who;
  expr: Expr;
  set: (k: keyof RigRefs) => (el: SVGGElement | null) => void;
}

function Kawany({ expr, set }: FigureProps) {
  return (
    <g ref={set("root")} style={{ opacity: 0 }}>
      <GroundShadow rx={30} />
      <g ref={set("torso")}>
        {/* véu atrás de tudo: o desenhado do convite, ou um traço simples de reserva */}
        {HAS_PHOTO.kawany ? (
          <image href="/assets/convite/veu.webp" x={-31} y={-162} width={68} height={88} preserveAspectRatio="none" />
        ) : (
          <>
            <path d="M-13 -142C-30 -118-34-86-31-56Q0-48 31-56C34-86 30-118 13-142Q0-148-13-142z" fill={CREAM} fillOpacity={0.9} strokeOpacity={0.55} />
            <path d="M-18 -110C-22 -92-23 -76-22 -60M18 -110C22 -92 23 -76 22 -60" opacity={0.3} />
          </>
        )}
        {/* saia rodada, com barra ondulada e dobras */}
        <path d="M-8 -85C-14 -62-29 -28-34 -3Q-28 0-22 -2Q-17 1-11 -1Q-5 2 0 -1Q5 2 11 -1Q17 1 22 -2Q28 0 34 -3C29 -28 14 -62 8 -85z" fill={CREAM} />
        <path d="M-4 -80C-9 -58-15 -32-17 -2M3 -80C6 -56 9 -30 9 -1M-1 -82C-2 -60-4 -30-5 -1" opacity={0.28} />
        {/* ombros, colo e pescoço */}
        <path d="M-10.5 -100Q-10 -103.5-5 -103.5L-3.2 -107H3.2L5 -103.5Q10 -103.5 10.5 -100C7 -99 4.5 -98 2.2 -96.6Q0 -98.6-2.2 -96.6C-4.5 -98-7 -99-10.5 -100z" fill={SKIN} />
        {/* corpete com decote coração */}
        <path d="M-10.5 -100C-11.5 -94-10.5 -89-8 -84.5H8C10.5 -89 11.5 -94 10.5 -100C7 -99 4.5 -98 2.2 -96.6Q0 -98.6-2.2 -96.6C-4.5 -98-7 -99-10.5 -100z" fill={CREAM} />
        <path d="M-6 -95.5C-5.5 -92-5 -89-4 -86M6 -95.5C5.5 -92 5 -89 4 -86" opacity={0.25} />
        {/* faixa na cintura com laço */}
        <path d="M-8.4 -86.5H8.4V-83.6H-8.4z" fill="#f1ede4" />
        <path d="M-5 -85l-4.5-2.6v5.2zM-5 -85l4.5-2.6v5.2z" fill="#f1ede4" />
        <circle cx={-5} cy={-85} r={1} fill="#f1ede4" />
        <g ref={set("head")}>
          <Face who="kawany" expr={expr} />
          {/* três florzinhas no véu (só no rosto desenhado; o véu do convite já tem) */}
          {!HAS_PHOTO.kawany && [-11, 0, 11].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i === 1 ? -150 : -147})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={2.4 * Math.cos((a * Math.PI) / 180)} cy={2.4 * Math.sin((a * Math.PI) / 180)} r={1.7} fill={CREAM} />
              ))}
              <circle r={1} fill="var(--tan)" stroke="none" />
            </g>
          ))}
        </g>
        <g ref={set("lArm")}>
          <Arm side="l" sleeve={SKIN} slim bindForearm={set("lFore")} />
        </g>
        <g ref={set("rArm")}>
          <Arm side="r" sleeve={SKIN} slim bindForearm={set("rFore")} />
        </g>
      </g>
    </g>
  );
}

function Nathan({ expr, set }: FigureProps) {
  return (
    <g ref={set("root")} style={{ opacity: 0 }}>
      <GroundShadow rx={16} />
      {/* calça com vinco e sapatos (fora do giro do tronco) */}
      <path d="M-11.5 -64L-10.5 -3.5H-1.8L0 -46 1.8 -3.5H10.5L11.5 -64z" fill="#2b2b24" />
      <path d="M-6 -60V-5M6 -60V-5" stroke="#4a4a40" />
      <path d="M-12.5 -0.8c0-3 2.6-4.6 6-4.6h4.8v5.4h-10.8zM12.5 -0.8c0-3-2.6-4.6-6-4.6H1.7v5.4h10.8z" fill="#141410" />
      <g ref={set("torso")}>
        {/* pescoço */}
        <path d="M-3.6 -108V-101H3.6V-108z" fill={SKIN} />
        {/* camisa com colarinho */}
        <path d="M-12.5 -99L-11.8 -62H11.8L12.5 -99Q7 -102 3.4 -103H-3.4Q-7 -102-12.5 -99z" fill={CREAM} />
        <path d="M-3.4 -103L0 -98.5 3.4 -103L5.5 -99.5 1.4 -96.5M-3.4 -103L-5.5 -99.5-1.4 -96.5" fill={CREAM} />
        {/* colete com lapela, bolso e botões */}
        <path d="M-11.8 -97L-11.2 -64L0 -59.5L11.2 -64L11.8 -97L5.6 -100.5L0 -83L-5.6 -100.5z" fill={TAN} />
        <path d="M-5.6 -100.5L-2.6 -91M5.6 -100.5L2.6 -91" opacity={0.45} />
        <path d="M5 -76h4.5" opacity={0.6} />
        {[-79, -73.5, -68].map((y) => (
          <circle key={y} cx={0} cy={y} r={0.9} fill="#fff" />
        ))}
        <g ref={set("head")}>
          <Face who="nathan" expr={expr} />
        </g>
        {/* gravata-borboleta do convite */}
        <image href="/assets/convite/gravata.svg" x={-9.5} y={-106.5} width={19} height={14.8} preserveAspectRatio="none" />
        <g ref={set("lArm")}>
          <Arm side="l" sleeve={CREAM} bindForearm={set("lFore")} />
        </g>
        <g ref={set("rArm")}>
          <Arm side="r" sleeve={CREAM} bindForearm={set("rFore")} />
        </g>
      </g>
    </g>
  );
}

/* ---------- par animado ---------- */

export interface CoupleProps {
  stage: Stage;
  poses: Pose[];
  /** posição do item no cômodo (local) e dimensões do cômodo */
  itemX: number;
  roomW: number;
  roomH: number;
}

function exprFor(stage: Stage, poses: Pose[], who: Who): Expr {
  if (stage !== "pose") return "sorriso";
  if (poses.includes("surpresa")) return who === "kawany" ? "surpresa" : "gargalhada";
  if (poses.includes("abraco") || poses.includes("palma")) return "gargalhada";
  return "sorriso";
}

/**
 * Kawany e Nathan entram no cômodo, olham o item, reagem e saem.
 * Toda a animação roda num laço rAF que escreve transforms nos grupos.
 */
export function Couple({ stage, poses, itemX, roomW, roomH }: CoupleProps) {
  const kaw = useRigRefs();
  const nat = useRigRefs();
  const stageRef = useRef(stage);
  const stageStart = useRef(0);
  useEffect(() => {
    stageRef.current = stage;
    stageStart.current = performance.now();
  }, [stage]);

  // Posições: um de cada lado do item, sempre dentro do cômodo.
  const gap = 58;
  const margin = 30;
  let kx = itemX - gap;
  let nx = itemX + gap;
  if (kx < margin) {
    nx += margin - kx;
    kx = margin;
  }
  if (nx > roomW - margin) {
    kx -= nx - (roomW - margin);
    nx = roomW - margin;
  }
  const baseY = roomH - 5;

  useEffect(() => {
    const cur: Record<Who, Joints> = { kawany: { ...REST, x: -26, op: 0 }, nathan: { ...REST, x: 26, op: 0 } };
    let raf = 0;
    let last = performance.now();
    const start = last;
    const loop = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const st = stageRef.current;
      const inStage = now - stageStart.current;
      (["kawany", "nathan"] as Who[]).forEach((who) => {
        const side = who === "kawany" ? "left" : "right";
        const myX = who === "kawany" ? kx : nx;
        const tilt = Math.max(-12, Math.min(12, (itemX - myX) / 5));
        let pose: Pose = "idle";
        if (st === "look") pose = "olhar";
        if (st === "pose") pose = poses[Math.min(poses.length - 1, Math.floor(inStage / 750))] ?? "idle";
        // abraço: os dois se aproximam do meio
        // abraço: ao lado do item, nunca na frente dele
        const mid = Math.max(margin + 18, Math.min(roomW - margin - 18, itemX < roomW / 2 ? itemX + 74 : itemX - 74));
        const hugX = (side === "left" ? mid - 23 : mid + 23) - myX;
        const clap = pose === "palma" ? Math.max(0, Math.sin((inStage / 1000) * Math.PI * 2 * 3)) * 4 : 0;
        const target: Joints = { ...REST, ...poseJoints(pose, side, tilt, side === "left" ? 46 : -46, clap) };
        if (pose === "abraco") target.x = hugX;
        const hidden = st === "zoom" || st === "drop" || st === "exit" || st === "idle";
        target.op = hidden ? 0 : 1;
        if (hidden) target.x = side === "left" ? -26 : 26;
        // respiração sutil
        const t = (now - start) / 1000;
        target.torso += Math.sin(t * 1.6 + (side === "left" ? 0 : 1.3)) * 0.6;
        approach(cur[who], target, dt);
        applyJoints((who === "kawany" ? kaw : nat).refs, cur[who], myX, baseY);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [kx, nx, itemX, baseY, poses, kaw, nat, roomW]);

  // No abraço o Nathan fica na frente (o braço dele envolve a Kawany).
  const hugging = stage === "pose" && poses.includes("abraco");
  const n = <Nathan key="n" who="nathan" expr={exprFor(stage, poses, "nathan")} set={nat.set} />;
  const k = <Kawany key="k" who="kawany" expr={exprFor(stage, poses, "kawany")} set={kaw.set} />;
  return (
    <g aria-hidden="true" className="pointer-events-none" strokeWidth={1.2} stroke="#1f1c18">
      {hugging ? [k, n] : [n, k]}
    </g>
  );
}
