/**
 * Utensílios em line-art, desenhados à mão no traço do convite (oliva, ~1,5 px).
 * Substituem a extração vetorial do PDF enquanto ele não está no repositório.
 * Cada utensílio ocupa uma caixa 40×120, cabo para cima.
 */
const U: Record<string, React.ReactNode> = {
  fouet: (
    <>
      <path d="M20 4v34" />
      <rect x="16.5" y="4" width="7" height="34" rx="3.5" />
      <path d="M20 38c-10 14-12 40-8 62 2 10 6 16 8 16s6-6 8-16c4-22 2-48-8-62z" />
      <path d="M20 38c-4 18-4 50 0 78M20 38c4 18 4 50 0 78" />
      <path d="M20 38c-7 16-8 46-4 66M20 38c7 16 8 46 4 66" />
    </>
  ),
  concha: (
    <>
      <path d="M18 6h4v74h-4z" />
      <circle cx="20" cy="8" r="3" />
      <path d="M20 80c-12 0-16 8-16 16 0 12 7 18 16 18s16-6 16-18c0-8-4-16-16-16z" />
      <path d="M4 96h32" />
    </>
  ),
  espatula: (
    <>
      <path d="M17.5 4h5v66h-5z" />
      <path d="M12 70h16l3 42c0 3-2 5-5 5H14c-3 0-5-2-5-5z" />
      <path d="M15 80v28M20 80v28M25 80v28" />
    </>
  ),
  colher: (
    <>
      <path d="M18 4c0-1 4-1 4 0l1 76h-6z" />
      <ellipse cx="20" cy="98" rx="11" ry="18" />
      <path d="M14 92c2-6 5-8 6-8" />
    </>
  ),
  rolo: (
    <>
      <rect x="15" y="4" width="10" height="20" rx="5" />
      <rect x="10" y="24" width="20" height="72" rx="3" />
      <rect x="15" y="96" width="10" height="20" rx="5" />
      <path d="M14 36h12M14 84h12" />
    </>
  ),
  escumadeira: (
    <>
      <path d="M18 6h4v70h-4z" />
      <circle cx="20" cy="96" r="18" />
      <circle cx="14" cy="90" r="1.6" />
      <circle cx="20" cy="88" r="1.6" />
      <circle cx="26" cy="90" r="1.6" />
      <circle cx="14" cy="98" r="1.6" />
      <circle cx="20" cy="97" r="1.6" />
      <circle cx="26" cy="98" r="1.6" />
      <circle cx="17" cy="105" r="1.6" />
      <circle cx="23" cy="105" r="1.6" />
    </>
  ),
  faca: (
    <>
      <rect x="15" y="4" width="10" height="38" rx="3" />
      <circle cx="20" cy="14" r="1.4" />
      <circle cx="20" cy="30" r="1.4" />
      <path d="M15 42h10v4c0 20 2 46 0 70-6-10-10-30-10-56z" />
    </>
  ),
  garfo: (
    <>
      <path d="M18 4h4l1 66h-6z" />
      <path d="M11 78c0-6 4-8 9-8s9 2 9 8v8c0 6-4 9-9 9s-9-3-9-9z" />
      <path d="M12 86v30M17 88v28M23 88v28M28 86v30" />
    </>
  ),
};

const ORDER = ["fouet", "concha", "espatula", "colher", "rolo", "escumadeira", "faca", "garfo"] as const;

interface Props {
  className?: string;
  /** Quais utensílios, na ordem. Padrão: todos. */
  items?: readonly (keyof typeof U)[];
  /** "hang" pendura do topo (como no topo do convite); "stand" apoia na base. */
  mode?: "hang" | "stand";
  color?: string;
}

/** Faixa de utensílios usada como divisor de seção e borda decorativa. */
export function UtensilBand({ className, items = ORDER, mode = "hang", color = "var(--olive-700)" }: Props) {
  const gap = 46;
  const w = items.length * gap + 10;
  const tilt = [-6, 3, -2, 5, -4, 2, -5, 4];
  const drop = [0, 14, 4, 18, 8, 2, 16, 6];
  return (
    <svg
      viewBox={`0 0 ${w} 150`}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {mode === "hang" && <path d={`M0 3H${w}`} strokeWidth={1} opacity={0.6} />}
      {items.map((k, i) => {
        const x = 8 + i * gap;
        const y = mode === "hang" ? 6 + drop[i % drop.length] * 0.5 : 26 - drop[i % drop.length];
        return (
          <g key={k + i} transform={`translate(${x} ${y}) rotate(${tilt[i % tilt.length]} 20 0)`}>
            {mode === "hang" && <path d={`M20 ${-y + 3}V2`} strokeWidth={1} opacity={0.6} />}
            {U[k]}
          </g>
        );
      })}
    </svg>
  );
}

/** Canto decorativo: três utensílios em leque. */
export function UtensilCorner({ className, flip = false, color = "var(--olive-700)" }: { className?: string; flip?: boolean; color?: string }) {
  const set: (keyof typeof U)[] = ["concha", "fouet", "espatula"];
  return (
    <svg
      viewBox="0 0 150 150"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {set.map((k, i) => (
        <g key={k} transform={`translate(${18 + i * 30} ${-8 + i * 6}) rotate(${-38 + i * 18} 20 120) scale(0.95)`}>
          {U[k]}
        </g>
      ))}
    </svg>
  );
}

/** Ramo fino de folhas, para separar blocos de texto. */
export function Sprig({ className, color = "var(--tan)" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 120 20"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke={color}
      strokeWidth={1}
      strokeLinecap="round"
    >
      <path d="M4 10h112" opacity={0.7} />
      <path d="M60 10c-6-6-12-7-18-6 4 5 11 7 18 6zM60 10c6-6 12-7 18-6-4 5-11 7-18 6z" />
      <circle cx="60" cy="10" r="1.6" fill={color} />
    </svg>
  );
}
