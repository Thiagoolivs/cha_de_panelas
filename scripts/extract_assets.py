"""Pós-processamento dos assets do convite. Chamado por scripts/extract-assets.sh.

Origem de cada arquivo gerado (documentado também em public/assets/convite/README.md):
- nathan.webp   : página 1, imagem 908x1210 + smask (pdfimages), recorte justo, 260 px de largura
- kawany.webp   : página 1, imagem 1210x908 + smask (pdfimages), recorte justo, 340 px de largura
- maos.webp     : página 2, maior imagem da página (foto das mãos com a aliança), 900 px de largura
- utensilios-*.png : faixas de line-art das páginas 1 e 5 rasterizadas a 300 dpi,
                     luminância convertida em alpha tingida de #70773d
"""
import glob
import os
import re
import sys

from PIL import Image, ImageOps

OLIVE = (0x70, 0x77, 0x3D)


def parse_list(path):
    rows = []
    for line in open(path, encoding="utf-8"):
        parts = line.split()
        if len(parts) < 6 or not parts[0].isdigit():
            continue
        rows.append({"page": int(parts[0]), "num": int(parts[1]), "type": parts[2],
                     "w": int(parts[3]), "h": int(parts[4])})
    return rows


def find_file(tmp, page, num):
    hits = glob.glob(os.path.join(tmp, f"img-{page:03d}-{num:03d}.png"))
    return hits[0] if hits else None


def face(tmp, rows, w, h, target_w, out):
    for i, r in enumerate(rows):
        if r["page"] == 1 and r["type"] == "image" and r["w"] == w and r["h"] == h:
            mask = next((m for m in rows[i + 1:i + 3] if m["type"] == "smask"), None)
            rgb_path = find_file(tmp, r["page"], r["num"])
            if not rgb_path or not mask:
                continue
            rgb = Image.open(rgb_path).convert("RGB")
            alpha = Image.open(find_file(tmp, mask["page"], mask["num"])).convert("L").resize(rgb.size)
            rgb.putalpha(alpha)
            bbox = alpha.point(lambda v: 255 if v > 12 else 0).getbbox()
            img = rgb.crop(bbox) if bbox else rgb
            ratio = target_w / img.width
            img = img.resize((target_w, round(img.height * ratio)), Image.LANCZOS)
            img.save(out, "WEBP", quality=86, method=6)
            print("ok", out, img.size)
            return
    print("aviso: rosto", w, "x", h, "não encontrado")


def hands(tmp, rows, out):
    page2 = [r for r in rows if r["page"] == 2 and r["type"] == "image"]
    if not page2:
        print("aviso: foto das mãos não encontrada")
        return
    big = max(page2, key=lambda r: r["w"] * r["h"])
    img = Image.open(find_file(tmp, 2, big["num"])).convert("RGB")
    img = ImageOps.contain(img, (900, 900))
    img.save(out, "WEBP", quality=82, method=6)
    print("ok", out, img.size)


def lineart_band(png, top, bottom, out):
    """Recorta uma faixa (frações da altura) e transforma traço escuro em alpha oliva."""
    page = Image.open(png).convert("L")
    band = page.crop((0, round(page.height * top), page.width, round(page.height * bottom)))
    alpha = ImageOps.invert(band).point(lambda v: 0 if v < 40 else min(255, int(v * 1.6)))
    layer = Image.new("RGBA", band.size, OLIVE + (0,))
    layer.putalpha(alpha)
    bbox = alpha.getbbox()
    if bbox:
        layer = layer.crop(bbox)
    layer = ImageOps.contain(layer, (1400, 1400))
    layer.save(out, optimize=True)
    print("ok", out, layer.size)


def fotos(src, dst):
    os.makedirs(dst, exist_ok=True)
    pat = re.compile(r"^(kawany|nathan)-(sorriso|surpresa|gargalhada)\.(png|jpe?g|webp)$", re.I)
    for f in sorted(os.listdir(src)) if os.path.isdir(src) else []:
        if not pat.match(f):
            continue
        img = Image.open(os.path.join(src, f)).convert("RGBA")
        bbox = img.getchannel("A").getbbox()
        if bbox:
            img = img.crop(bbox)
        img = ImageOps.contain(img, (300, 300))
        out = os.path.join(dst, os.path.splitext(f.lower())[0] + ".webp")
        img.save(out, "WEBP", quality=86, method=6)
        print("ok", out, img.size)


def main():
    if sys.argv[1] == "--fotos":
        fotos(sys.argv[2], sys.argv[3])
        return
    tmp, out = sys.argv[1], sys.argv[2]
    rows = parse_list(os.path.join(tmp, "list.txt"))
    face(tmp, rows, 908, 1210, 260, os.path.join(out, "nathan.webp"))
    face(tmp, rows, 1210, 908, 340, os.path.join(out, "kawany.webp"))
    hands(tmp, rows, os.path.join(out, "maos.webp"))
    p1 = glob.glob(os.path.join(tmp, "p1*.png"))
    p5 = glob.glob(os.path.join(tmp, "p5*.png"))
    if p1:
        lineart_band(p1[0], 0.0, 0.16, os.path.join(out, "utensilios-topo.png"))
        lineart_band(p1[0], 0.84, 1.0, os.path.join(out, "utensilios-rodape.png"))
    if p5:
        lineart_band(p5[0], 0.84, 1.0, os.path.join(out, "utensilios-p5.png"))


if __name__ == "__main__":
    main()
