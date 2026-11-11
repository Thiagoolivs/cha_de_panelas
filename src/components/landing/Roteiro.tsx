import { copy } from "@/content/copy";
import { Sprig } from "@/components/ornaments/Utensils";

export function Roteiro() {
  return (
    <section aria-labelledby="roteiro-title" className="bg-olive-900 px-4 py-16 text-cream">
      <div className="mx-auto max-w-xl">
        <h2 id="roteiro-title" className="text-center font-serif text-[2rem] tracking-[0.16em] uppercase">
          {copy.roteiro.title}
        </h2>
        <ol className="mt-8 space-y-0">
          {copy.roteiro.items.map((it, i) => (
            <li key={it.title} className="grid grid-cols-[3.2rem_1fr] gap-4 border-t border-gold/30 py-5 first:border-t-0">
              <span className="font-serif text-[1.7rem] leading-none italic text-gold-light">
                {it.time || String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-[0.82rem] font-medium tracking-[0.18em] uppercase">{it.title}</span>
                <span className="mt-1 block text-[0.98rem] text-cream">{it.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <Sprig className="mx-auto mt-6 w-28" color="var(--gold-light)" />
      </div>
    </section>
  );
}
