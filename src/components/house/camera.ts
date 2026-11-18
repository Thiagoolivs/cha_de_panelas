import { useEffect, useRef } from "react";
import type { Box } from "./geometry";
import { HOUSE_CAMERA } from "./geometry";

export const CAMERA_MS = 700;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Anima o viewBox do SVG até o alvo (~700 ms, ease-in-out), escrevendo o atributo
 * direto no DOM a cada quadro (sem re-render do React).
 */
export function useCamera(svg: React.RefObject<SVGSVGElement | null>, target: Box, reduce: boolean) {
  const current = useRef<Box>({ ...HOUSE_CAMERA });

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const from = { ...current.current };
    const apply = (b: Box) => {
      current.current = b;
      el.setAttribute("viewBox", `${b.x.toFixed(2)} ${b.y.toFixed(2)} ${b.w.toFixed(2)} ${b.h.toFixed(2)}`);
    };
    if (reduce) {
      apply(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / CAMERA_MS);
      const e = easeInOut(t);
      apply({
        x: lerp(from.x, target.x, e),
        y: lerp(from.y, target.y, e),
        w: lerp(from.w, target.w, e),
        h: lerp(from.h, target.h, e),
      });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [svg, target, reduce]);
}
