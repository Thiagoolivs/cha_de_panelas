import { iconFor } from "./catalog";

/** Ícone isolado (lista de presentes, modais). Decorativo: aria-hidden. */
export function GiftIcon({ iconKey, className, strokeWidth = 1.5 }: { iconKey: string; className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
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
