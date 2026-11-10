"use client";

import { useEffect, useRef, useState } from "react";
import assets from "@/generated/assets.json";
import type { Pose } from "@/lib/phrases";
import type { Stage } from "@/components/house/useReaction";
import { REST, applyJoints, approach, emptyRefs, poseJoints, type Joints, type RigRefs } from "./rig";

type Expr = "sorriso" | "surpresa" | "gargalhada";
type Who = "kawany" | "nathan";

const CREAM = "#fdfbf7";
const SKIN = "#f8efe4";
const TAN = "rgba(195,169,132,0.38)";

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
        <g fill="#cdb594" stroke="none">
          {CURLS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} />
          ))}
        </g>
        <path d="M-15 -112c-2 2-2 5 0 6M15 -112c2 2 2 5 0 6M-17 -125c-2 2-2 4 0 6M17 -125c2 2 2 4 0 6M-6 -146c2-2 4-2 5 0M4 -146c2-2 4-2 5 0" opacity={0.55} />
        <ellipse cx={0} cy={-123} rx={12} ry={14.5} fill={SKIN} />
        <path d="M-12 -129c2-6 7-9 12-9s10 3 12 9c-4-3-8-4-12-4s-8 1-12 4z" fill="#cdb594" />
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
      <path d="M-13 -127c-1-10 4-17 13-17s14 6 13 17c-2-6-6-9-13-9s-11 3-13 9z" fill="rgba(90,96,48,0.55)" />
      {eyes}
      {mouth}
    </g>
  );
}

function Face({ who, expr }: { who: Who; expr: Expr }) {
  const photo = facePhoto(who, expr);
  if (photo) {
    // Foto do convite: pouca resolução, por isso a cabeça nunca passa de ~120 px CSS.
    const w = who === "kawany" ? 58 : 46;
    return <image href={photo} x={-w / 2} y={-152} width={w} height={54} preserveAspectRatio="xMidYMax meet" />;
  }
  return <DrawnFace who={who} expr={expr} />;
}

/* ---------- braços ---------- */

function Arm({ sleeve, bindForearm, side }: { sleeve: string; bindForearm: (el: SVGGElement | null) => void; side: "l" | "r" }) {
  return (
    <g data-joint={`${side}-shoulder`}>
      <path d="M-3.4 0C-3.6 8-3.4 16-3 24H3C3.4 16 3.6 8 3.4 0Q0-3-3.4 0z" fill={sleeve} />
      <g ref={bindForearm} data-joint={`${side}-elbow`}>
        <path d="M-2.8 0L-2.4 19H2.4L2.8 0z" fill={SKIN} />
        <ellipse cx={0} cy={22} rx={3.2} ry={3.8} fill={SKIN} />
      </g>
    </g>
  );
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
      {/* véu atrás de tudo */}
      <path d="M-13 -142C-30 -118-34-86-31-56Q0-48 31-56C34-86 30-118 13-142Q0-148-13-142z" fill={CREAM} fillOpacity={0.9} strokeOpacity={0.55} />
      <path d="M-18 -110C-22 -92-23 -76-22 -60M18 -110C22 -92 23 -76 22 -60" opacity={0.3} />
      <g ref={set("torso")}>
        {/* saia evasê */}
        <path d="M-9 -86C-13 -58-26 -28-31 -2Q0 4 31 -2C26 -28 13 -58 9 -86z" fill={CREAM} />
        <path d="M-4 -80C-8 -56-12 -30-13 -2M4 -80C8 -56 12 -30 13 -2" opacity={0.35} />
        {/* corpete */}
        <path d="M-11 -99C-12 -95-11 -90-9 -86H9C11 -90 12 -95 11 -99C7 -97 3 -96 0 -98C-3 -96-7 -97-11 -99z" fill={CREAM} />
        <path d="M-9 -86H9" strokeWidth={1.6} />
        <path d="M-3 -104v5M3 -104v5" />
        <path d="M-3 -100h6" stroke={SKIN} strokeWidth={3} />
        <g ref={set("lArm")}>
          <Arm side="l" sleeve={CREAM} bindForearm={set("lFore")} />
        </g>
        <g ref={set("rArm")}>
          <Arm side="r" sleeve={CREAM} bindForearm={set("rFore")} />
        </g>
        <g ref={set("head")}>
          <Face who="kawany" expr={expr} />
          {/* três florzinhas no véu */}
          {[-11, 0, 11].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i === 1 ? -150 : -147})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={2.4 * Math.cos((a * Math.PI) / 180)} cy={2.4 * Math.sin((a * Math.PI) / 180)} r={1.7} fill={CREAM} />
              ))}
              <circle r={1} fill="var(--tan)" stroke="none" />
            </g>
          ))}
        </g>
      </g>
    </g>
  );
}

function Nathan({ expr, set }: FigureProps) {
  return (
    <g ref={set("root")} style={{ opacity: 0 }}>
      {/* calça e sapatos (fora do giro do tronco) */}
      <path d="M-11 -64L-10 -3H-2L0 -48 2 -3H10L11 -64z" fill="rgba(195,169,132,0.22)" />
      <path d="M-11 -2c0-3 3-4 6-4h3v5h-9zM11 -2c0-3-3-4-6-4H2v5h9z" fill="var(--olive-700)" fillOpacity={0.55} />
      <g ref={set("torso")}>
        {/* camisa */}
        <path d="M-12 -99L-11.5 -62H11.5L12 -99Q6 -102 3 -103H-3Q-6 -102-12 -99z" fill={CREAM} />
        <path d="M-3 -107v4M3 -107v4" />
        {/* colete */}
        <path d="M-11.5 -97L-11 -65L0 -61L11 -65L11.5 -97L5 -100L0 -84L-5 -100z" fill={TAN} />
        <circle cx={0} cy={-78} r={0.9} fill="var(--olive-700)" />
        <circle cx={0} cy={-72} r={0.9} fill="var(--olive-700)" />
        <circle cx={0} cy={-66} r={0.9} fill="var(--olive-700)" />
        {/* gravata-borboleta */}
        <path d="M0 -101.5l-6.5-3.5v7zM0 -101.5l6.5-3.5v7z" fill="var(--olive-700)" fillOpacity={0.75} />
        <circle cx={0} cy={-101.5} r={1.4} fill="var(--olive-700)" />
        <g ref={set("lArm")}>
          <Arm side="l" sleeve={CREAM} bindForearm={set("lFore")} />
        </g>
        <g ref={set("rArm")}>
          <Arm side="r" sleeve={CREAM} bindForearm={set("rFore")} />
        </g>
        <g ref={set("head")}>
          <Face who="nathan" expr={expr} />
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
        const hugX = (side === "left" ? mid - 18 : mid + 18) - myX;
        const clap = pose === "palma" ? Math.max(0, Math.sin((inStage / 1000) * Math.PI * 2 * 3)) * 4 : 0;
        const target: Joints = { ...REST, ...poseJoints(pose, side, tilt, side === "left" ? 36 : -36, clap) };
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
    <g aria-hidden="true" className="pointer-events-none" strokeWidth={1.2}>
      {hugging ? [k, n] : [n, k]}
    </g>
  );
}
