import { describe, expect, it } from "vitest";
import { storeLinks } from "@/lib/links";
import { buildIcs } from "@/lib/ics";

describe("storeLinks", () => {
  it("gera Amazon, Mercado Livre e Magalu (+ Sugestão)", () => {
    const l = storeLinks({ searchQuery: "jogo de taças", featuredUrl: null });
    expect(l.map((x) => x.href)).toEqual([
      "https://www.amazon.com.br/s?k=jogo%20de%20ta%C3%A7as",
      "https://lista.mercadolivre.com.br/jogo-de-tacas",
      "https://www.magazineluiza.com.br/busca/jogo%20de%20ta%C3%A7as/",
    ]);
    expect(storeLinks({ searchQuery: "x", featuredUrl: "https://a.b" })[0].label).toBe("Sugestão");
  });
});

describe("buildIcs", () => {
  it("converte 14h de Brasília para 17h UTC", () => {
    const ics = buildIcs({
      uid: "u",
      title: "Chá; dos, Noivos",
      description: "d",
      location: null,
      startISO: "2026-12-12T14:00:00-03:00",
      endISO: "2026-12-12T18:00:00-03:00",
    });
    expect(ics).toContain("DTSTART:20261212T170000Z");
    expect(ics).toContain("DTEND:20261212T210000Z");
    expect(ics).toContain(String.raw`SUMMARY:Chá\; dos\, Noivos`);
    expect(ics).not.toContain("LOCATION");
  });
});
