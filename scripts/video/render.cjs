// Renderiza scripts/video/roteiro.html quadro a quadro (30 fps) e monta o mp4 com ffmpeg.
// Uso: com o site rodando (npm run dev) na porta 3100:
//   node scripts/video/render.cjs [http://localhost:3100]
// Saída: public/videos/como-funciona.mp4 e .jpg (capa).
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const base = process.argv[2] || "http://localhost:3100";
const FPS = 30;
const root = path.join(__dirname, "..", "..");
// Servido temporariamente como arquivo estático do site (para carregar fontes e imagens).
const tmpPage = path.join(root, "public", "_video-roteiro.html");
fs.copyFileSync(path.join(__dirname, "roteiro.html"), tmpPage);
process.on("exit", () => fs.rmSync(tmpPage, { force: true }));

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "video-"));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.4 });
  await p.goto(base + "/_video-roteiro.html", { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  const dur = await p.evaluate(() => window.DURATION);
  const n = Math.ceil(dur * FPS);
  for (let i = 0; i < n; i++) {
    await p.evaluate((t) => window.render(t), i / FPS);
    await p.screenshot({ path: path.join(tmp, `f${String(i).padStart(5, "0")}.png`) });
    if (i % 150 === 0) console.log(`quadro ${i}/${n}`);
  }
  await b.close();
  const out = path.join(root, "public/videos/como-funciona.mp4");
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(FPS), "-i", path.join(tmp, "f%05d.png"),
    "-vf", "scale=540:-2:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "24",
    "-profile:v", "main", "-movflags", "+faststart", "-an", out]);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(tmp, "f00060.png"), "-vf", "scale=540:-2", "-q:v", "4",
    path.join(root, "public/videos/como-funciona.jpg")]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log("ok", out);
})();
