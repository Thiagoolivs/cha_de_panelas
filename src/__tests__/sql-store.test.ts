import { PGlite } from "@electric-sql/pglite";
import { beforeEach, describe, expect, it } from "vitest";
import { defaultGifts } from "@/data/gifts.default";
import { SqlGiftsStore, ValidationError, type Db } from "@/server/store";

function pglite(): Db {
  const pg = new PGlite();
  return {
    query: (sql, params) => (params?.length ? pg.query(sql, params) : pg.exec(sql).then((r) => r[r.length - 1] ?? { rows: [] })) as never,
    tx: (fn) => pg.transaction((t) => fn({ query: (sql, params) => t.query(sql, params) as never })),
  };
}

let store: SqlGiftsStore;
beforeEach(() => {
  store = new SqlGiftsStore(pglite(), defaultGifts);
});

describe("SqlGiftsStore (Postgres)", () => {
  it("reserva, esgota e desfaz com o token", async () => {
    const r = await store.reserve("airfryer", "Ana");
    expect(r.status).toBe("ok");
    expect((await store.reserve("airfryer", "Bruno")).status).toBe("taken");
    if (r.status !== "ok") throw new Error();
    expect(await store.undo("airfryer", "token-errado")).toBe(false);
    expect(await store.undo("airfryer", r.token)).toBe(true);
    expect((await store.listGifts()).find((g) => g.id === "airfryer")?.remaining).toBe(1);
  });

  it("reservas simultâneas nunca passam da quantidade", async () => {
    const results = await Promise.all(["A1", "B2", "C3", "D4", "E5"].map((n) => store.reserve("tabua-de-corte", n)));
    expect(results.filter((r) => r.status === "ok")).toHaveLength(2);
    expect((await store.houseState()).find((h) => h.giftId === "tabua-de-corte")?.count).toBe(2);
  });

  it("valida nome, presente e recado", async () => {
    await expect(store.reserve("airfryer", "x")).rejects.toBeInstanceOf(ValidationError);
    await expect(store.reserve("nao-existe", "Ana")).rejects.toBeInstanceOf(ValidationError);
    await expect(store.sendMessage({ authorName: "Ana", text: "curto" })).rejects.toBeInstanceOf(ValidationError);
  });

  it("adminView não expõe quem deu, tokens nem datas", async () => {
    await store.reserve("bule", "Pessoa Secreta");
    await store.sendMessage({ authorName: "Bia", text: "Que a casa de vocês seja cheia de café e de risada.", relation: "Prima" });
    const snap = await store.adminView();
    const giftsJson = JSON.stringify(snap.gifts);
    expect(giftsJson).not.toContain("Pessoa Secreta");
    expect(JSON.stringify(snap)).not.toMatch(/token|created|\d{4}-\d{2}-\d{2}T/i);
    for (const g of snap.gifts) expect(Object.keys(g).sort()).toEqual(["id", "quantity", "reserved", "room", "status", "title"]);
    expect(snap.guests.map((g) => g.name)).toEqual(["Bia", "Pessoa Secreta"]);
    expect(snap.gifts.find((g) => g.id === "bule")?.status).toBe("reservado");
  });

  it("zera reservas e recados uma única vez por chave", async () => {
    const db = pglite();
    const a = new SqlGiftsStore(db, defaultGifts);
    await a.reserve("bule", "Teste");
    await a.sendMessage({ authorName: "Teste", text: "Recado de teste antes do convite sair." });
    const b = new SqlGiftsStore(db, defaultGifts, "convite-2026-11-14");
    expect((await b.houseState()).length).toBe(0);
    expect((await b.adminView()).messages.length).toBe(0);
    await b.reserve("bule", "Convidada de verdade");
    const c = new SqlGiftsStore(db, defaultGifts, "convite-2026-11-14");
    expect((await c.houseState()).find((h) => h.giftId === "bule")?.count).toBe(1);
  });

  it("listGifts e houseState nunca trazem nomes", async () => {
    await store.reserve("mixer", "Nome Único");
    expect(JSON.stringify(await store.listGifts())).not.toContain("Nome Único");
    expect(JSON.stringify(await store.houseState())).not.toContain("Nome Único");
  });
});
