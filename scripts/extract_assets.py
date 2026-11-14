"""Extrai os assets do convite (assets/CONVITE_CH_DE_PANELA.pdf, Canva, 7 páginas).

Uso: python3 scripts/extract_assets.py <dir com pdfimages -png -p> <svg da página 1> <saída>
(chamado por scripts/extract-assets.sh). Requer Pillow e svgelements.

Origem de cada arquivo gerado (documentado também em public/assets/convite/README.md):
  rosto-kawany.webp     p1 img 005 + smask 006 (cachos incluídos), recorte justo
  rosto-nathan.webp     p1 img 001 + smask 002, recorte justo
  veu.webp              p1 img 003 + smask 004 (véu desenhado do convite)
  maos.webp             p2 img 008 (mãos com a aliança)
  roteiro-1..3.webp     p3 img 011, 012, 013 (memes do roteiro)
  pix-50/100/150/250    p6 img 019, 023 (+smask 024), 020, 022 (memes das cotas)
  papel.jpg             p1 img 000 (textura de papel), reduzida
  utensilios-*.svg      p1, vetores #70773d (pote, panelas, borda contínua)
  gravata.svg, tabua.svg  p1, vetores (gravata-borboleta e tábua da data)
"""
import io
import os
import re
import sys

import svgelements as se
from PIL import Image, ImageFilter, ImageOps

src, page1_svg, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)


def img(n: int) -> Image.Image:
    page = {0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 8: 2, 11: 3, 12: 3, 13: 3, 19: 6, 20: 6, 22: 6, 23: 6, 24: 6}[n]
    return Image.open(os.path.join(src, f"img-{page:03d}-{n:03d}.png"))


def cutout(rgb_n: int, mask_n: int, width: int, name: str, q: int = 86):
    rgb = img(rgb_n).convert("RGB")
    alpha = img(mask_n).convert("L").resize(rgb.size)
    rgb.putalpha(alpha)
    # ignora pontinhos soltos da máscara: limiar alto + erosão antes do bbox
    solid = alpha.point(lambda v: 255 if v > 128 else 0).filter(ImageFilter.MinFilter(9))
    bbox = solid.getbbox()
    if bbox:
        pad = 6
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(rgb.width, bbox[2] + pad), min(rgb.height, bbox[3] + pad))
    im = rgb.crop(bbox) if bbox else rgb
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(os.path.join(out, name), "WEBP", quality=q, method=6)
    print("ok", name, im.size)


def photo(n: int, size: int, name: str, q: int = 80):
    im = ImageOps.contain(img(n).convert("RGB"), (size, size))
    im.save(os.path.join(out, name), "WEBP", quality=q, method=6)
    print("ok", name, im.size)


cutout(5, 6, 520, "rosto-kawany.webp")
cutout(1, 2, 300, "rosto-nathan.webp")
cutout(3, 4, 420, "veu.webp")
photo(8, 900, "maos.webp")
for i, n in enumerate((11, 12, 13), 1):
    photo(n, 420, f"roteiro-{i}.webp")
for value, n in ((50, 19), (100, 23), (150, 20), (250, 22)):
    photo(n, 420, f"pix-{value}.webp")
paper = img(0).convert("RGB").resize((576, 1024), Image.LANCZOS)
paper.save(os.path.join(out, "papel.jpg"), "JPEG", quality=72, optimize=True, progressive=True)
print("ok papel.jpg", paper.size)

# ---------- vetores da página 1 ----------
raw = re.sub(r"<image[^>]*/>", "", open(page1_svg).read())
svg = se.SVG.parse(io.StringIO(raw))
GROUPS = {
    "utensilios-pote": ((70, 10, 205, 215), {"#70773d"}),
    "utensilios-panelas": ((595, 5, 790, 222), {"#70773d"}),
    "utensilios-borda": ((0, 855, 810, 1005), {"#70773d"}),
    "gravata": ((440, 545, 540, 622), {"#38342e", "#1f1c18"}),
    "tabua": ((300, 658, 560, 808), {"#966639", "#854f25"}),
}
acc = {k: [] for k in GROUPS}
for e in svg.elements():
    if not (isinstance(e, se.Path) and e.fill is not None and e.fill.value is not None):
        continue
    bb = e.bbox()
    if not bb:
        continue
    for k, ((x0, y0, x1, y1), colors) in GROUPS.items():
        if e.fill.hexrgb in colors and bb[0] >= x0 - 1 and bb[1] >= y0 - 1 and bb[2] <= x1 + 1 and bb[3] <= y1 + 1:
            p = se.Path(e)
            p.reify()
            acc[k].append((p, e.fill.hexrgb))


def fmt(p):
    return re.sub(r"-?\d+\.\d+", lambda m: ("%.1f" % float(m.group())).rstrip("0").rstrip("."), p.d())


for k, paths in acc.items():
    bbs = [p.bbox() for p, _ in paths]
    x0 = min(b[0] for b in bbs) - 1
    y0 = min(b[1] for b in bbs) - 1
    x1 = max(b[2] for b in bbs) + 1
    y1 = max(b[3] for b in bbs) + 1
    mono = k.startswith("utensilios")
    body = "".join(f'<path d="{fmt(p)}"/>' if mono else f'<path fill="{c}" d="{fmt(p)}"/>' for p, c in paths)
    fill = ' fill="#70773d"' if mono else ""
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} {y0:.1f} {x1 - x0:.1f} {y1 - y0:.1f}"{fill}>{body}</svg>'
    open(os.path.join(out, f"{k}.svg"), "w").write(s)
    print("ok", f"{k}.svg", len(paths), "paths", len(s) // 1024, "KB")
