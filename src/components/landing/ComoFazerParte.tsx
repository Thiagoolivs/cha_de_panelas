import { site } from "@/config/site";
import { copy } from "@/content/copy";

const stroke = {
  fill: "none",
  stroke: "var(--olive-700)",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const STEP_ART = [
  // Escolha: caixa de presente
  <svg key="a" viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true" {...stroke}>
    <rect x="12" y="28" width="40" height="28" />
    <rect x="9" y="20" width="46" height="9" />
    <path d="M32 20v36M32 20c-4-9-15-11-15-4 0 4 8 4 15 4zM32 20c4-9 15-11 15-4 0 4-8 4-15 4z" />
  </svg>,
  // Marque: lista com check
  <svg key="b" viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true" {...stroke}>
    <rect x="14" y="8" width="36" height="48" rx="2" />
    <path d="M22 22h20M22 32h20M22 42h10" />
    <path d="M34 44l5 5 11-13" />
  </svg>,
  // Pronto: casinha
  <svg key="c" viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true" {...stroke}>
    <path d="M8 30L32 10l24 20" />
    <path d="M14 26v30h36V26" />
    <rect x="27" y="40" width="10" height="16" />
    <path d="M20 34h6v6h-6zM38 34h6v6h-6z" />
  </svg>,
];

export function ComoFazerParte() {
  return (
    <section aria-labelledby="como-title" className="px-4 py-14">
      <div className="mx-auto max-w-4xl">
        <h2 id="como-title" className="title-caps text-center text-[1.9rem]">
          {copy.comoFazerParte.title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-ink/90">{copy.comoFazerParte.intro}</p>

        <div className="mx-auto mt-8 aspect-video w-full max-w-2xl overflow-hidden border border-olive-700/30 bg-white/60">
          {site.videoUrl ? (
            <video src={site.videoUrl} controls preload="none" playsInline className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-olive-900">
              <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true" {...stroke}>
                <circle cx="24" cy="24" r="20" />
                <path d="M20 16l12 8-12 8z" />
              </svg>
              <span className="text-sm">{copy.comoFazerParte.videoSoon}</span>
            </div>
          )}
        </div>

        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {copy.comoFazerParte.steps.map((s, i) => (
            <li key={s.title} className="flex flex-col items-center text-center">
              {STEP_ART[i]}
              <span className="mt-3 font-serif text-[1.35rem] tracking-[0.12em] text-olive-700 uppercase">
                {s.title}
              </span>
              <span className="mt-1 max-w-[16rem] text-[0.95rem]">{s.text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-center font-serif text-[1.25rem] italic text-olive-900">
          {copy.comoFazerParte.privacy}
        </p>
      </div>
    </section>
  );
}
