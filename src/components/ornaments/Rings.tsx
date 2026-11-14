/** Alianças entrelaçadas em line-art creme. Reserva para a foto das mãos do convite. */
export function Rings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true" fill="none" stroke="var(--gold-light)" strokeWidth={1.4} strokeLinecap="round">
      <ellipse cx="80" cy="96" rx="44" ry="44" />
      <ellipse cx="80" cy="96" rx="38" ry="38" opacity=".6" />
      <ellipse cx="124" cy="96" rx="44" ry="44" />
      <ellipse cx="124" cy="96" rx="38" ry="38" opacity=".6" />
      <path d="M124 52l-9-14h18z" />
      <path d="M115 38l9-8 9 8M120 38l4 14 4-14" opacity=".8" />
      <path d="M40 20c6 4 8 9 8 14M160 18c-5 4-7 9-7 13M100 8v12" opacity=".5" />
    </svg>
  );
}
