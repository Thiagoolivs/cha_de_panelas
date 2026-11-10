// Gera src/generated/assets.json com os assets opcionais que existem em public/.
// Assim o código funciona só com as ilustrações de reserva e usa fotos quando elas aparecem.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const pub = join(root, "public");
const has = (p) => (existsSync(join(pub, p)) ? "/" + p : null);

const expr = (who) => ({
  sorriso: has(`assets/fotos/${who}-sorriso.webp`) ?? has(`assets/convite/${who}.webp`),
  surpresa: has(`assets/fotos/${who}-surpresa.webp`),
  gargalhada: has(`assets/fotos/${who}-gargalhada.webp`),
});

const manifest = {
  faces: { kawany: expr("kawany"), nathan: expr("nathan") },
  hands: has("assets/convite/maos.webp"),
  utensils: {
    top: has("assets/convite/utensilios-topo.png"),
    bottom: has("assets/convite/utensilios-rodape.png"),
  },
};

mkdirSync(join(root, "src/generated"), { recursive: true });
writeFileSync(join(root, "src/generated/assets.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("assets.json:", JSON.stringify(manifest));
