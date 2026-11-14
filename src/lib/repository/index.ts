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
  // Latência simulada do mock (útil para testar como fica no celular com internet lenta).
  const latency = Number(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS ?? 250);
  return new MockGiftsRepository(defaultGifts, browserStore(), Number.isFinite(latency) ? latency : 250);
}
