import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("landing mostra o convite e oferece a agenda", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 1, name: /Chá dos Noivos/i })).toBeVisible();
  await expect(page.getByText("Kaw e Than").first()).toBeVisible();
  await expect(page.getByText("endereço em breve")).toBeVisible();
  await expect(page.getByText(/os noivos não verão quem escolheu cada presente/i).first()).toBeAttached();
  const ics = await request.get("/agenda.ics");
  expect(ics.headers()["content-type"]).toContain("text/calendar");
  expect(await ics.text()).toContain("DTSTART:20261212T163000Z");
});

test("escolher um presente em até 4 toques com o nome salvo, ver na lista e desfazer", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("chadosnoivos:guest-name", "Convidada Teste"));
  await page.goto("/");
  // 1: abrir a lista
  await page.getByRole("link", { name: "Ver a lista de presentes" }).first().click();
  await expect(page).toHaveURL(/\/presentes/);
  const card = page.locator('[data-gift="airfryer"]');
  // 2: escolher
  await card.getByRole("button", { name: /Escolher este presente/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Os noivos não vão saber que foi você.");
  // 3: confirmar
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  await expect(page.getByText("Presente escolhido: Air fryer. Já está na casa.").first()).toBeVisible();
  await expect(card).toContainText("Você escolheu");
  await expect(page.getByRole("region", { name: "Meus presentes" })).toContainText("Air fryer");
  await expect(page.getByText(/Fale com a Ra/)).toBeVisible();
  // a casa mostra o item (lista textual)
  await expect(page.locator("section[aria-labelledby=casinha-title] li", { hasText: "Air fryer" })).toHaveCount(1);
  // desfazer
  await page.getByRole("region", { name: "Meus presentes" }).getByRole("button", { name: /Desfazer/ }).click();
  await expect(card.getByRole("button", { name: /Escolher este presente/ })).toBeVisible();
});

test("primeira vez pede o nome; conflito mostra mensagem simpática", async ({ page, context }) => {
  await page.goto("/presentes");
  const other = await context.newPage();
  await other.goto("/presentes");
  await expect(other.locator('[data-gift="bule"] button')).toBeVisible();

  await page.locator('[data-gift="bule"]').getByRole("button", { name: /Escolher/ }).click();
  await page.getByRole("textbox", { name: "Seu nome" }).fill("Primeira");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  await expect(page.locator('[data-gift="bule"]')).toContainText("Você escolheu");

  // a outra aba ainda vê o bule livre; ao tentar, recebe "taken"
  await other.locator('[data-gift="bule"]').getByRole("button", { name: /Escolher/ }).click();
  await other.getByRole("textbox", { name: "Seu nome" }).fill("Segunda");
  await other.getByRole("button", { name: "Continuar" }).click();
  await other.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  await expect(other.getByText("Alguém acabou de escolher este. Que tal outro?").first()).toBeVisible();
});

test("item com quantidade 2 aceita duas pessoas", async ({ page }) => {
  await page.goto("/presentes");
  await page.evaluate(() => localStorage.setItem("chadosnoivos:guest-name", "Ana"));
  await page.reload();
  const card = page.locator('[data-gift="tabua-de-corte"]');
  await expect(card).toContainText("Faltam 2 de 2");
  await card.getByRole("button", { name: /Escolher/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  await expect(card).toContainText("Você escolheu");
});

test("recado: valida o tamanho e agradece", async ({ page }) => {
  await page.goto("/recado");
  await expect(page.getByText("Este recado vai só para a Kawany e não tem ligação com o presente que você escolheu.")).toBeVisible();
  await page.getByLabel("Seu nome").fill("Beatriz");
  await page.getByLabel("Recado").fill("Curto");
  await page.getByRole("button", { name: "Enviar recado" }).click();
  await expect(page.getByText(/Mínimo de 20 caracteres/)).toBeVisible();
  await page.getByLabel("Recado").fill("Que a casa de vocês seja cheia de café e de risada.");
  await page.getByRole("button", { name: "Enviar recado" }).click();
  await expect(page.getByText("Obrigada")).toBeVisible();
});

test("prévia do admin não mostra quem deu", async ({ page }) => {
  await page.goto("/presentes");
  await page.evaluate(() => localStorage.setItem("chadosnoivos:guest-name", "Nome Secreto"));
  await page.reload();
  await page.locator('[data-gift="mixer"]').getByRole("button", { name: /Escolher/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  await expect(page.locator('[data-gift="mixer"]')).toContainText("Você escolheu");
  await page.goto("/admin-preview");
  await expect(page.getByText(/o que vai ganhar/)).toBeVisible();
  const panel = page.getByRole("tabpanel");
  await expect(panel).toContainText("Mixer de mão");
  await expect(panel).not.toContainText("Nome Secreto");
});

test("teclado: cômodo da casa abre com Enter e Esc fecha o card", async ({ page }) => {
  await page.goto("/presentes");
  await page.getByRole("button", { name: "Ver Cozinha" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Voltar à casa" })).toBeVisible();
  await page.getByRole("button", { name: "Voltar à casa" }).click();
  await expect(page.getByRole("button", { name: "Voltar à casa" })).toHaveCount(0);
});

test("Pix anônimo: marca o valor, a noiva vê só o total, e dá para desfazer", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "R$ 100,00" }).click();
  await page.getByRole("button", { name: "Confirmar R$ 100,00" }).click();
  await expect(page.getByText("Anotado: R$ 100,00. Obrigado!")).toBeVisible();
  await expect(page.getByText(/ninguém fica sabendo quem mandou nem quanto/)).toBeVisible();
  await page.goto("/admin");
  await expect(page.getByText("R$ 100,00", { exact: true })).toBeVisible();
  await page.goto("/");
  await page.getByRole("button", { name: "Desfazer" }).click();
  await expect(page.getByText("Anotado: R$ 100,00. Obrigado!")).toHaveCount(0);
});

test("organizador vê quem escolheu cada presente", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("chadosnoivos:guest-name", "Convidada Teste"));
  await page.goto("/presentes");
  await page.locator('[data-gift="airfryer"]').getByRole("button", { name: /Escolher este presente/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  await expect(page.getByRole("region", { name: "Meus presentes" })).toContainText("Air fryer");
  await page.goto("/organizador");
  await expect(page.getByText(/^Air fryer/)).toBeVisible();
  await expect(page.getByText("Convidada Teste")).toBeVisible();
});

test("os noivos aparecem ao escolher, mesmo com 'Reduzir movimento', e dá para ver de novo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("chadosnoivos:guest-name", "Convidada Teste"));
  await page.goto("/presentes");
  await page.locator('[data-gift="mixer"]').getByRole("button", { name: /Escolher este presente/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  // um ombro esquerdo para cada um dos noivos
  const couple = page.locator('[data-joint="l-shoulder"]');
  await expect(couple).toHaveCount(2, { timeout: 6000 });
  await expect(couple).toHaveCount(0, { timeout: 8000 });
  await page.getByRole("button", { name: "Ver os noivos de novo" }).click();
  await expect(couple).toHaveCount(2, { timeout: 6000 });
});

test("queda do presente não sai do lugar com o celular lento (bug do Safari: cômodo sumia)", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("chadosnoivos:guest-name", "Convidada Teste"));
  await page.goto("/presentes");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    const w = window as unknown as { __maxDrop: number };
    w.__maxDrop = 0;
    const orig = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name: string, value: string) {
      if (name === "transform" && this.hasAttribute("data-item")) {
        const m = String(value).match(/translate\(0 ([^)]+)\)/);
        const y = m ? Math.abs(Number(m[1])) : 0;
        w.__maxDrop = Number.isFinite(y) ? Math.max(w.__maxDrop, y) : Infinity;
      }
      return orig.call(this, name, value);
    };
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 8 });
  await page.locator('[data-gift="kit-corte"]').getByRole("button", { name: /Escolher este presente/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
  await expect(page.locator('[data-joint="l-shoulder"]')).toHaveCount(2, { timeout: 10000 });
  await page.waitForTimeout(2500);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  const maxDrop = await page.evaluate(() => (window as unknown as { __maxDrop: number }).__maxDrop);
  expect(maxDrop).toBeLessThanOrEqual(60);
});
