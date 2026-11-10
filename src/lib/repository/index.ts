import { defaultGifts } from "@/data/gifts.default";
import type { GiftsRepository } from "@/lib/types";
import { MockGiftsRepository } from "./mock";
import { browserStore } from "./storage";

/**
 * Ponto único de troca da camada de dados.
 * Para usar o backend real: implemente GiftsRepository (ex.: ApiGiftsRepository)
 * e devolva-o aqui. Nenhum componente precisa mudar.
 */
export function createRepository(): GiftsRepository {
  return new MockGiftsRepository(defaultGifts, browserStore(), 250);
}
