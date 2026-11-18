/**
 * Motor de interpolação do rig (rAF). Cada personagem tem juntas numéricas que
 * perseguem a pose-alvo com suavização exponencial, e o resultado é escrito direto
 * no atributo `transform` dos grupos SVG, com pivôs explícitos em unidades locais
 * (sem depender de transform-origin em CSS).
 *
 * Coordenadas locais: origem no meio dos pés, y para cima negativo, altura ~150.
 */
import type { Pose } from "@/lib/phrases";

export const PIVOT = {
  hip: { x: 0, y: -62 },
  neck: { x: 0, y: -104 },
  shoulderL: { x: -12, y: -99 },
  shoulderR: { x: 12, y: -99 },
  upperArm: 24,
} as const;

export interface Joints {
  /** deslocamento horizontal (entrada/saída, abraço) */
  x: number;
  op: number;
  torso: number;
  head: number;
  /** ângulos "para fora" (positivo afasta a mão do corpo); cotovelo negativo dobra para dentro */
  lSh: number;
  lEl: number;
  rSh: number;
  rEl: number;
}

export const REST: Joints = { x: 0, op: 1, torso: 0, head: 0, lSh: 0, lEl: 0, rSh: 0, rEl: 0 };

type Side = "left" | "right";

const L1 = PIVOT.upperArm;
const L2 = 22;
const DEG = 180 / Math.PI;

/**
 * IK de dois segmentos: ângulos de ombro e cotovelo que levam a mão até (hx, hy)
 * (coordenadas locais do personagem), com o cotovelo sempre para fora do corpo.
 * Devolve os ângulos na convenção "para fora" usada em Joints.
 */
export function reach(arm: "l" | "r", hx: number, hy: number): { sh: number; el: number } {
  const S = arm === "l" ? PIVOT.shoulderL : PIVOT.shoulderR;
  let vx = hx - S.x;
  let vy = hy - S.y;
  let d = Math.hypot(vx, vy);
  const dMax = L1 + L2 - 0.5;
  const dMin = Math.abs(L1 - L2) + 0.5;
  if (d > dMax || d < dMin) {
    const k = (d > dMax ? dMax : dMin) / (d || 1);
    vx *= k;
    vy *= k;
    d = Math.hypot(vx, vy);
  }
  const alpha = Math.atan2(-vx, vy);
  const beta = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const best = [alpha + beta, alpha - beta]
    .map((t1) => {
      const ex = S.x - L1 * Math.sin(t1);
      const ey = S.y + L1 * Math.cos(t1);
      const t2 = Math.atan2(-(S.x + vx - ex), S.y + vy - ey);
      return { t1, t2, ex };
    })
    .sort((a, b) => (arm === "l" ? a.ex - b.ex : b.ex - a.ex))[0];
  let rel = (best.t2 - best.t1) * DEG;
  while (rel > 180) rel -= 360;
  while (rel < -180) rel += 360;
  return arm === "l" ? { sh: best.t1 * DEG, el: rel } : { sh: -best.t1 * DEG, el: -rel };
}

function hands(l: [number, number], r: [number, number]): Partial<Joints> {
  const a = reach("l", l[0], l[1]);
  const b = reach("r", r[0], r[1]);
  return { lSh: a.sh, lEl: a.el, rSh: b.sh, rEl: b.el };
}

export const REST_HANDS = hands([-15, -55], [15, -55]);
Object.assign(REST, REST_HANDS);

/**
 * Poses, definidas pela posição das mãos. `side` é o lado no par (Kawany à
 * esquerda); `partnerDx` é a distância com sinal até o outro (para o abraço);
 * `clap` abre e fecha as mãos nas palmas.
 */
export function poseJoints(pose: Pose, side: Side, lookTilt: number, partnerDx = 26, clap = 0): Partial<Joints> {
  const s = side === "left" ? 1 : -1; // direção do parceiro
  switch (pose) {
    case "idle":
      return { ...REST_HANDS, head: 0, torso: 0 };
    case "olhar":
      return { ...REST_HANDS, head: lookTilt, torso: lookTilt * 0.25 };
    case "palma":
      return { ...hands([-2.5 - clap, -88], [2.5 + clap, -88]), head: lookTilt * 0.5, torso: 0 };
    case "maos-no-peito":
      return { ...hands([1, -91], [4, -88]), head: 6 * s, torso: 1.5 * s };
    case "surpresa":
      return { ...hands([-11, -116], [11, -116]), head: -4 * s, torso: 0 };
    case "abraco": {
      // braço de dentro passa pelas costas do outro; o de fora descansa na frente
      const inner: [number, number] = [partnerDx + 9 * s, -95];
      const outer: [number, number] = [6 * s, -80];
      const hj = side === "left" ? hands(outer, inner) : hands(inner, outer);
      return { ...hj, head: 10 * s, torso: 4 * s };
    }
  }
}

export interface RigRefs {
  root: SVGGElement | null;
  torso: SVGGElement | null;
  head: SVGGElement | null;
  lArm: SVGGElement | null;
  lFore: SVGGElement | null;
  rArm: SVGGElement | null;
  rFore: SVGGElement | null;
}

export function emptyRefs(): RigRefs {
  return { root: null, torso: null, head: null, lArm: null, lFore: null, rArm: null, rFore: null };
}

const f = (n: number) => n.toFixed(2);

export function applyJoints(r: RigRefs, j: Joints, baseX: number, baseY: number) {
  r.root?.setAttribute("transform", `translate(${f(baseX + j.x)} ${f(baseY)})`);
  if (r.root) r.root.style.opacity = f(j.op);
  r.torso?.setAttribute("transform", `rotate(${f(j.torso)} ${PIVOT.hip.x} ${PIVOT.hip.y})`);
  r.head?.setAttribute("transform", `rotate(${f(j.head)} ${PIVOT.neck.x} ${PIVOT.neck.y})`);
  r.lArm?.setAttribute("transform", `translate(${PIVOT.shoulderL.x} ${PIVOT.shoulderL.y}) rotate(${f(j.lSh)})`);
  r.lFore?.setAttribute("transform", `translate(0 ${PIVOT.upperArm}) rotate(${f(j.lEl)})`);
  r.rArm?.setAttribute("transform", `translate(${PIVOT.shoulderR.x} ${PIVOT.shoulderR.y}) rotate(${f(-j.rSh)})`);
  r.rFore?.setAttribute("transform", `translate(0 ${PIVOT.upperArm}) rotate(${f(-j.rEl)})`);
}

/** Suaviza `cur` em direção a `target` (constante de tempo em ms). */
export function approach(cur: Joints, target: Joints, dtMs: number) {
  const kFast = 1 - Math.exp(-dtMs / 110);
  const kSlow = 1 - Math.exp(-dtMs / 170);
  (Object.keys(cur) as (keyof Joints)[]).forEach((key) => {
    const k = key === "x" || key === "op" ? kSlow : kFast;
    cur[key] += (target[key] - cur[key]) * k;
  });
}
