import { FALLBACK_ICON, ICONS, iconFor } from "./catalog";

/**
 * Topo do desenho para ícones baixos (frigideira, travessas, tapete...). Fora da casa,
 * o ícone isolado é recortado a partir daqui para não ficar minúsculo a 40 px.
 */
const TOP: Record<string, number> = {
  frigideira: 76, "travessa-grande": 76, "travessa-media": 78, assadeira: 79, "tapete-cozinha": 84,
  "tabua-de-frios": 72, sanduicheira: 63, "jogo-de-pratos": 70, "pratos-sobremesa": 66,
  "kit-mesa-posta": 58, "porta-frios": 66, manteigueira: 60, "potes-temperos": 70, "jogo-de-bowls": 58,
  "jogo-de-xicaras": 62, "potes-de-vidro": 46, "porta-mantimentos": 50, "kit-temperos": 46, leiteira: 55,
  "jogo-de-copos": 60, "porta-pao": 46, "kit-pia": 52, "faqueiro-servir": 50,
};

function viewBoxFor(key: string): string {
  const k = ICONS[key] ? key : FALLBACK_ICON;
  const top = TOP[k];
  if (top === undefined) return "0 0 100 100";
  const y0 = Math.min(top - 8, 50);
  return `0 ${y0} 100 ${102 - y0}`;
}

/** Ícone isolado (lista de presentes, modais). Decorativo: aria-hidden. */
export function GiftIcon({ iconKey, className, strokeWidth = 1.5 }: { iconKey: string; className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox={viewBoxFor(iconKey)}
      className={`lineart ${className ?? ""}`}
      aria-hidden="true"
      fill="none"
      stroke="var(--olive-700)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconFor(iconKey).body}
    </svg>
  );
}
