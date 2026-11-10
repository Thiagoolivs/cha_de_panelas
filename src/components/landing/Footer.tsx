import { copy } from "@/content/copy";
import { UtensilBand } from "@/components/ornaments/Utensils";

export function Footer() {
  return (
    <footer className="px-4 pt-6 pb-10 text-center">
      <UtensilBand className="mx-auto block h-[110px] w-full max-w-[380px]" mode="stand" items={["colher", "faca", "garfo", "rolo", "concha", "espatula", "fouet"]} />
      <p className="script mt-4 text-[2.6rem] text-olive-700">{copy.footer}</p>
    </footer>
  );
}
