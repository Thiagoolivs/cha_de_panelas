import { site } from "@/config/site";

/** Endereço completo em uma linha (para rota e agenda), ou null se ainda não definido. */
export function eventPlace(): string | null {
  const { address, area } = site.event;
  if (!address) return null;
  return area ? `${address} - ${area.replace(/\s*·\s*/g, ", ")}` : address;
}
