import type { Gift, ReactionCategory } from "@/lib/types";

/** Três frases por categoria, na voz do casal. Humor seco, sem exclamação. */
export const PHRASES: Record<ReactionCategory, string[]> = {
  eletro: ["Agora sim, tecnologia.", "Vai mudar nossa vida. Ou pelo menos o jantar.", "A tomada da cozinha agradece."],
  panelas: ["Alguém vai cozinhar. Nós, talvez.", "Agora não tem mais desculpa.", "Prometemos usar. Pelo menos no domingo."],
  louca: ["A mesa está ficando séria.", "Visita agora tem onde comer.", "Prometemos não lascar. Muito."],
  utensilios: ["Era exatamente o que faltava.", "Agora a gaveta faz sentido.", "Cada coisa no seu lugar. Finalmente."],
  organizacao: ["Organização também é amor.", "Tudo no pote. Tudo em paz.", "A despensa agora tem futuro."],
  limpeza: ["A casa agradece. Ela vai precisar.", "Romance também é chão limpo.", "Já dá pra receber a sogra."],
};

export function pickPhrase(gift: Pick<Gift, "category" | "phrase">, rnd = Math.random): string {
  const pool = gift.phrase ? [gift.phrase, ...PHRASES[gift.category]] : PHRASES[gift.category];
  if (gift.phrase && rnd() < 0.6) return gift.phrase;
  return pool[Math.floor(rnd() * pool.length)];
}

export type Pose = "idle" | "olhar" | "palma" | "maos-no-peito" | "abraco" | "surpresa";

/** Sequência de poses de reação por categoria. */
export const REACTION_POSES: Record<ReactionCategory, Pose[]> = {
  eletro: ["palma", "surpresa"],
  panelas: ["abraco"],
  louca: ["abraco"],
  utensilios: ["palma"],
  organizacao: ["maos-no-peito"],
  limpeza: ["maos-no-peito"],
};
