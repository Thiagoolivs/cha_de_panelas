import { describe, expect, it } from "vitest";
import { defaultGifts } from "@/data/gifts.default";
import { MockGiftsRepository } from "@/lib/repository/mock";
import { memoryStore } from "@/lib/repository/storage";
import { ICONS } from "@/components/icons/catalog";
import { SLOTS } from "@/components/house/slots";

const repo = () => new MockGiftsRepository(defaultGifts, memoryStore());

describe("MockGiftsRepository", () => {
  it("reserva, conflita quando esgota e desfaz", async () => {
    const r = repo();
    const ok = await r.reserve("airfryer", "Ana");
    expect(ok.status).toBe("ok");
    expect((await r.reserve("airfryer", "Bruno")).status).toBe("taken");
    if (ok.status === "ok") await r.undo("airfryer", ok.token);
    expect((await r.listGifts()).find((g) => g.id === "airfryer")?.remaining).toBe(1);
  });

  it("respeita a quantidade pedida (2) e empilha na casa", async () => {
    const r = repo();
    expect((await r.reserve("jogo-de-copos", "Ana")).status).toBe("ok");
    expect((await r.reserve("jogo-de-copos", "Bruno")).status).toBe("ok");
    expect((await r.reserve("jogo-de-copos", "Caio")).status).toBe("taken");
    const house = await r.houseState();
    expect(house.find((h) => h.giftId === "jogo-de-copos")?.count).toBe(2);
  });

  it("listGifts e houseState nunca trazem nome", async () => {
    const r = repo();
    await r.reserve("bule", "Nome Muito Específico");
    expect(JSON.stringify(await r.listGifts())).not.toContain("Nome Muito Específico");
    expect(JSON.stringify(await r.houseState())).not.toContain("Nome Muito Específico");
  });

  it("encher e esvaziar a casa (modo demo)", async () => {
    const r = repo();
    await r.demo.fillHouse();
    expect((await r.listGifts()).every((g) => g.remaining === 0)).toBe(true);
    await r.demo.clearHouse();
    expect(await r.houseState()).toEqual([]);
  });
});

describe("lista padrão", () => {
  it("ids únicos, ícones e slots válidos, sem dois itens no mesmo slot", () => {
    const ids = new Set(defaultGifts.map((g) => g.id));
    expect(ids.size).toBe(defaultGifts.length);
    const used = new Set<string>();
    for (const g of defaultGifts) {
      expect(ICONS[g.iconKey], `ícone ${g.iconKey}`).toBeDefined();
      expect(SLOTS[g.room][g.slot], `slot ${g.room}/${g.slot}`).toBeDefined();
      const key = `${g.room}/${g.slot}`;
      expect(used.has(key), `slot repetido ${key}`).toBe(false);
      used.add(key);
      expect(g.quantity).toBeGreaterThanOrEqual(1);
    }
  });
});
