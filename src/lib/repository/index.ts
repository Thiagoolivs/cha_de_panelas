import { defaultGifts } from "@/data/gifts.default";
import type { GiftsRepository } from "@/lib/types";
import { ApiGiftsRepository } from "./api";
import { MockGiftsRepository } from "./mock";
import { browserStore } from "./storage";

/**
 * Ponto único de troca da camada de dados.
 * NEXT_PUBLIC_DATA_SOURCE=api usa o backend (Postgres); qualquer outro valor, o mock local.
 */
export function createRepository(): GiftsRepository {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "api") return new ApiGiftsRepository();
  return new MockGiftsRepository(defaultGifts, browserStore(), 250);
}
