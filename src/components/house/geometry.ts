import type { Room } from "@/lib/types";

/** Casa em corte: viewBox 760×700. Telhado 20–120, andar de cima 120–380, térreo 380–640, grama 640–660. */
export const VIEW = { x: 0, y: 0, w: 760, h: 700 } as const;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ROOM_BOXES: Record<Room, Box> = {
  copa: { x: 30, y: 120, w: 420, h: 260 },
  despensa: { x: 450, y: 120, w: 280, h: 260 },
  cozinha: { x: 30, y: 380, w: 490, h: 260 },
  servico: { x: 520, y: 380, w: 210, h: 260 },
};

/**
 * Perspectiva de um ponto. A parede de fundo é o retângulo do cômodo escalado por K
 * em torno do ponto de fuga (centro em x, um pouco acima do meio em y).
 */
export const K = 0.72;
export const VP_Y = 0.4;

export interface Perspective {
  vp: { x: number; y: number };
  /** Parede de fundo em coordenadas locais do cômodo. */
  back: { x0: number; x1: number; y0: number; y1: number };
}

export function perspective(b: Box): Perspective {
  const vx = b.w / 2;
  const vy = b.h * VP_Y;
  return {
    vp: { x: vx, y: vy },
    back: {
      x0: vx + K * (0 - vx),
      x1: vx + K * (b.w - vx),
      y0: vy + K * (0 - vy),
      y1: vy + K * (b.h - vy),
    },
  };
}

/** Caixa de câmera para um cômodo (com respiro), em coordenadas da casa. */
export function roomCamera(room: Room): Box {
  const b = ROOM_BOXES[room];
  const pad = 8;
  return { x: b.x - pad, y: b.y - pad, w: b.w + pad * 2, h: b.h + pad * 2 };
}

export const HOUSE_CAMERA: Box = { x: VIEW.x, y: VIEW.y, w: VIEW.w, h: VIEW.h };
