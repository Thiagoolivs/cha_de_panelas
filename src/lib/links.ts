import type { Gift } from "@/lib/types";

export interface StoreLink {
  label: string;
  href: string;
}

/** Links de busca gerados a partir de searchQuery (+ "Sugestão" quando houver featuredUrl). */
export function storeLinks(gift: Pick<Gift, "searchQuery" | "featuredUrl">): StoreLink[] {
  const q = gift.searchQuery.trim();
  const enc = encodeURIComponent(q);
  const hyphen = q
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const links: StoreLink[] = [
    { label: "Amazon", href: `https://www.amazon.com.br/s?k=${enc}` },
    { label: "Mercado Livre", href: `https://lista.mercadolivre.com.br/${hyphen}` },
    { label: "Magalu", href: `https://www.magazineluiza.com.br/busca/${enc}/` },
  ];
  if (gift.featuredUrl) links.unshift({ label: "Sugestão", href: gift.featuredUrl });
  return links;
}
