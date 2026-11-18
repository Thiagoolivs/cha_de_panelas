import { copy } from "@/content/copy";
import { BAMBU_BG } from "@/content/palette";

/** Aviso da paleta dos utensílios (pedido da noiva): branco, cinza, preto ou cabo de bambu. */
export function PaletteNote({ compact = false }: { compact?: boolean }) {
  const dots = ["#ffffff", "#737373", "#000000", "bambu"];
  return (
    <p className={`flex items-center gap-2 ${compact ? "mt-2 text-[0.8rem]" : "mt-3 rounded-xl bg-white/70 px-3 py-2 text-[0.88rem]"}`}>
      <span className="flex shrink-0 -space-x-1" aria-hidden="true">
        {dots.map((d) => (
          <span key={d} className="h-4 w-4 rounded-full border border-ink/60" style={{ background: d === "bambu" ? BAMBU_BG : d }} />
        ))}
      </span>
      <span>{copy.paleta.short}</span>
    </p>
  );
}
