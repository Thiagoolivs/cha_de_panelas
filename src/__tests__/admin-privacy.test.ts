import { describe, expect, it } from "vitest";
import { defaultGifts } from "@/data/gifts.default";
import { MockGiftsRepository } from "@/lib/repository/mock";
import { memoryStore } from "@/lib/repository/storage";

const FORBIDDEN = /^(guestName|guestId|guest|token|reservedBy|createdAt|updatedAt|date|timestamp|time|at)$/i;
const DATE_LIKE = /\d{4}-\d{2}-\d{2}T|\b\d{13}\b/;

function walk(value: unknown, path: string, out: string[]) {
  if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (FORBIDDEN.test(k) || /date|time|guestid|guestname/i.test(k)) out.push(`${path}.${k}`);
      if (v instanceof Date) out.push(`${path}.${k} (Date)`);
      walk(v, `${path}.${k}`, out);
    }
  } else if (typeof value === "string" && DATE_LIKE.test(value)) out.push(`${path} (valor com data)`);
}

describe("adminView: privacidade", () => {
  it("não expõe nome de quem deu, ids de convidado nem datas", async () => {
    const repo = new MockGiftsRepository(defaultGifts, memoryStore());
    await repo.reserve("airfryer", "Maria Secreta");
    await repo.reserve("jogo-de-copos", "João Oculto");
    await repo.sendMessage({ authorName: "Ana", text: "Felicidades ao casal, que a casa seja cheia de amor.", relation: "Prima" });
    await repo.demo.fillHouse();

    const snap = await repo.adminView();
    const problems: string[] = [];
    walk(snap, "snap", problems);
    expect(problems).toEqual([]);

    // Nenhum presente carrega texto do nome de quem escolheu.
    const giftsJson = JSON.stringify(snap.gifts);
    expect(giftsJson).not.toContain("Maria Secreta");
    expect(giftsJson).not.toContain("João Oculto");

    // Presentes só têm os campos permitidos.
    for (const g of snap.gifts) {
      expect(Object.keys(g).sort()).toEqual(["id", "quantity", "reserved", "room", "status", "title"]);
    }
    for (const g of snap.guests) expect(Object.keys(g).sort()).toEqual(["attending", "name"]);
    for (const m of snap.messages) {
      expect(Object.keys(m).every((k) => ["authorName", "relation", "text"].includes(k))).toBe(true);
    }
  });

  it("convidados em ordem alfabética e recados em ordem estável, independente da chegada", async () => {
    const a = new MockGiftsRepository(defaultGifts, memoryStore());
    const b = new MockGiftsRepository(defaultGifts, memoryStore());
    const m1 = { authorName: "Zé", text: "Que vocês sejam muito felizes, sempre." };
    const m2 = { authorName: "Bia", text: "Amo vocês, contem comigo para tudo." };
    await a.sendMessage(m1);
    await a.sendMessage(m2);
    await b.sendMessage(m2);
    await b.sendMessage(m1);
    const [sa, sb] = [await a.adminView(), await b.adminView()];
    expect(sa.messages).toEqual(sb.messages);
    const names = sa.guests.map((g) => g.name);
    expect(names).toEqual([...names].sort((x, y) => x.localeCompare(y, "pt-BR")));
  });
});
