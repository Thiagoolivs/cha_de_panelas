import { copy } from "@/content/copy";
import { UtensilBand } from "@/components/ornaments/Utensils";

export function Footer() {
  return (
    <footer className="bg-olive-900 px-4 pt-10 pb-12 text-center">
      <UtensilBand className="mx-auto block h-[110px] w-full max-w-[380px]" mode="stand" color="var(--gold-light)" items={["colher", "faca", "garfo", "rolo", "concha", "espatula", "fouet"]} />
      <p className="script mt-4 text-[2.8rem] text-gold-light">{copy.footer}</p>
    </footer>
  );
}
