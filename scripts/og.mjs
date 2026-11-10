// Gera src/app/opengraph-image.png (1200×630) a partir da rota /og (modo demo).
// Uso: com o site rodando (npm run dev), `npm run og [url-base]`.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`${base}/og`, { waitUntil: "networkidle" });
await page.addStyleTag({ content: "[data-demo-panel], nextjs-portal { display: none !important; }" });
await page.waitForTimeout(500);
await page.locator("#og").screenshot({ path: "src/app/opengraph-image.png" });
await browser.close();
console.log("ok: src/app/opengraph-image.png");
