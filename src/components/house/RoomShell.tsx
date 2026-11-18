import type { Box } from "./geometry";
import { K, perspective } from "./geometry";

const WALL = "var(--h-wall)";
const BACK = "var(--h-back)";
const CEIL = "var(--h-ceil)";
const FLOOR = "var(--h-floor)";

interface Props {
  box: Box;
  floor: "wood" | "tile";
}

/**
 * Caixa aberta na frente: parede de fundo menor, piso, teto e paredes laterais em
 * trapézio, com tábuas (ou rejunte) convergindo ao ponto de fuga.
 * Desenhada em coordenadas locais do cômodo.
 */
export function RoomShell({ box, floor }: Props) {
  const { w, h } = box;
  const { vp, back } = perspective(box);
  const { x0, x1, y0, y1 } = back;
  const toBackX = (fx: number) => vp.x + K * (fx - vp.x);

  const boards: React.ReactNode[] = [];
  const n = floor === "wood" ? Math.round(w / 34) : Math.round(w / 46);
  for (let i = 1; i < n; i++) {
    const fx = (i * w) / n;
    boards.push(<path key={`b${i}`} d={`M${fx} ${h}L${toBackX(fx)} ${y1}`} />);
  }
  if (floor === "tile") {
    // Linhas de profundidade em progressão (mais próximas ao fundo).
    for (const t of [0.22, 0.5, 0.82]) {
      const y = y1 + (h - y1) * t;
      const xl = x0 * (1 - t);
      const xr = x1 + (w - x1) * t;
      boards.push(<path key={`t${t}`} d={`M${xl} ${y}H${xr}`} />);
    }
  }

  return (
    <g>
      <path d={`M0 0H${w}L${x1} ${y0}H${x0}z`} fill={CEIL} stroke="none" />
      <path d={`M0 0L${x0} ${y0}V${y1}L0 ${h}z`} fill={WALL} stroke="none" />
      <path d={`M${w} 0L${x1} ${y0}V${y1}L${w} ${h}z`} fill={WALL} stroke="none" />
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={BACK} stroke="none" />
      <path d={`M0 ${h}H${w}L${x1} ${y1}H${x0}z`} fill={FLOOR} stroke="none" />
      <g opacity={0.22}>{boards}</g>
      <g opacity={0.55}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} />
        <path d={`M0 0L${x0} ${y0}M${w} 0L${x1} ${y0}M0 ${h}L${x0} ${y1}M${w} ${h}L${x1} ${y1}`} />
      </g>
      {/* rodapé da parede de fundo */}
      <path d={`M${x0} ${y1 - 4}H${x1}`} opacity={0.35} />
    </g>
  );
}

/** Luminária pendente no centro do teto. */
export function Pendant({ x, y0, y }: { x: number; y0: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y0}V${y - 8}`} opacity={0.7} />
      <ellipse cx={x} cy={y + 10} rx={26} ry={16} fill="var(--h-gift)" opacity={0.08} stroke="none" />
      <path d={`M${x - 11} ${y}c0-6 5-9 11-9s11 3 11 9z`} fill="var(--h-fill)" />
      <path d={`M${x - 9} ${y}h18`} stroke="var(--h-gift)" />
      <path d={`M${x - 3} ${y + 2}h6`} opacity={0.6} />
    </g>
  );
}
