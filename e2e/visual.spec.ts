/**
 * Capturas para revisão visual (não comparam pixels): 4 viewports × casa vazia,
 * parcial e cheia, mais quadros-chave da reação. Saída em e2e/__screens__/.
 */
import { test, type Page } from "@playwright/test";
import { defaultGifts } from "../src/data/gifts.default";

const VIEWPORTS = [
  { w: 375, h: 812 },
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1280, h: 800 },
];
const KEY = "chadosnoivos:mock:v1";
const OUT = "e2e/__screens__";

function state(ids: string[]) {
  const reservations = ids.flatMap((id) => {
    const g = defaultGifts.find((x) => x.id === id)!;
    return Array.from({ length: g.quantity }, (_, i) => ({ token: `${id}-${i}`, giftId: id, guestName: `Convidado ${i}` }));
  });
  return JSON.stringify({ reservations, messages: [] });
}

const PARTIAL = defaultGifts.filter((_, i) => i % 3 === 0).map((g) => g.id);
const FULL = defaultGifts.map((g) => g.id);

async function load(page: Page, ids: string[]) {
  await page.goto("/presentes");
  await page.evaluate(([k, v]) => {
    localStorage.setItem(k, v);
    localStorage.setItem("chadosnoivos:guest-name", "Ana");
  }, [KEY, state(ids)] as const);
  await page.reload({ waitUntil: "networkidle" });
  await page.locator('section[aria-labelledby="casinha-title"] svg').waitFor();
  await page.waitForTimeout(600);
}

for (const vp of VIEWPORTS) {
  test.describe(`${vp.w}x${vp.h}`, () => {
    test.use({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 });

    test("landing", async ({ page }) => {
      await page.goto("/", { waitUntil: "networkidle" });
      await page.screenshot({ path: `${OUT}/${vp.w}-landing.png`, fullPage: true });
    });

    for (const [name, ids] of [["vazia", []], ["parcial", PARTIAL], ["cheia", FULL]] as const) {
      test(`casa ${name}`, async ({ page }) => {
        await load(page, [...ids]);
        await page.screenshot({ path: `${OUT}/${vp.w}-casa-${name}.png` });
      });
    }

    test("reação", async ({ page }) => {
      await load(page, PARTIAL.filter((id) => id !== "airfryer"));
      await page.locator('[data-gift="airfryer"]').getByRole("button", { name: /Escolher/ }).click();
      const t0 = Date.now();
      await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
      const stage = page.locator('section[aria-labelledby="casinha-title"] > div').first();
      for (const t of [500, 1100, 1900, 2400, 3300, 4600]) {
        const wait = t - (Date.now() - t0);
        if (wait > 0) await page.waitForTimeout(wait);
        await stage.screenshot({ path: `${OUT}/${vp.w}-reacao-${t}.png` });
      }
    });
  });
}
