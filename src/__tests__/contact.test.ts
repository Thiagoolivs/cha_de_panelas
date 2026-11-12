import { describe, expect, it } from "vitest";
import { doubtMessage } from "@/lib/contact";

describe("tirar dúvida", () => {
  it("monta a mensagem com o nome do item", () => {
    const m = doubtMessage("Air fryer");
    expect(m).toContain("Rayssa");
    expect(m).toContain('"Air fryer"');
    expect(m).toMatch(/cor, tamanho, modelo/);
  });
});
