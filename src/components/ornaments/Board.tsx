/** Selo da data em forma de tábua de corte (marrom #966639), como no convite. */
export function DateBoard({ day, month, time }: { day: string; month: string; time: string }) {
  return (
    <div className="relative mx-auto w-[150px]" role="img" aria-label={`${day} de dezembro, ${time}`}>
      <svg viewBox="0 0 150 210" className="block w-full" aria-hidden="true">
        <defs>
          <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.4" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .10 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <path
          d="M60 6h30c6 0 10 4 10 10v20c0 4 3 7 7 7h13c12 0 22 10 22 22v115c0 18-14 30-30 30H38c-16 0-30-12-30-30V65c0-12 10-22 22-22h13c4 0 7-3 7-7V16c0-6 4-10 10-10z"
          fill="var(--board)"
        />
        <path
          d="M60 6h30c6 0 10 4 10 10v20c0 4 3 7 7 7h13c12 0 22 10 22 22v115c0 18-14 30-30 30H38c-16 0-30-12-30-30V65c0-12 10-22 22-22h13c4 0 7-3 7-7V16c0-6 4-10 10-10z"
          filter="url(#grain)"
        />
        <circle cx="75" cy="22" r="7" fill="var(--cream)" />
        <path d="M22 70c0-8 6-12 12-12h82c6 0 12 4 12 12v100c0 12-8 20-20 20H42c-12 0-20-8-20-20z" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
      </svg>
      <div className="absolute inset-x-0 top-[34%] text-center text-white">
        <div className="font-serif text-[3.4rem] leading-none font-medium">{day}</div>
        <div className="mt-1 text-[0.8rem] font-medium tracking-[0.34em]">DE {month}</div>
        <div className="mt-3 font-serif text-[1.35rem] italic leading-none">{time}</div>
      </div>
    </div>
  );
}
