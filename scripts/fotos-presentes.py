"""Aplica as fotos escolhidas dos presentes (busca feita no Openverse, licenças CC).

Uso: python3 scripts/fotos-presentes.py <pasta com {id}__{n}.jpg e meta.json> <escolhas.json>
escolhas.json: {"airfryer": 2, ...}  (índice da candidata; ausente = fica o ícone line-art)
Gera public/assets/presentes/{id}.webp (quadrada, 480 px) e src/data/gift-photos.json (com crédito).
"""
import json
import os
import sys

from PIL import Image, ImageOps

src, choices_path = sys.argv[1], sys.argv[2]
meta = json.load(open(os.path.join(src, "meta.json")))
choices = json.load(open(choices_path))
out_dir = "public/assets/presentes"
os.makedirs(out_dir, exist_ok=True)
photos = {}
LIC = {"by": "CC BY", "by-sa": "CC BY-SA", "cc0": "CC0", "pdm": "Domínio público", "by-nd": "CC BY-ND"}
for gid, idx in sorted(choices.items()):
    m = meta[gid][idx]
    im = Image.open(os.path.join(src, f"{gid}__{idx}.jpg")).convert("RGB")
    im = ImageOps.fit(im, (480, 480), Image.LANCZOS, centering=(0.5, 0.5))
    im.save(os.path.join(out_dir, f"{gid}.webp"), "WEBP", quality=78, method=6)
    lic = LIC.get(m["license"], m["license"].upper())
    if m.get("license_version") and m["license"] not in ("cc0", "pdm"):
        lic += f" {m['license_version']}"
    photos[gid] = {
        "src": f"/assets/presentes/{gid}.webp",
        "title": (m.get("title") or "")[:80],
        "author": m.get("creator") or "autor desconhecido",
        "license": lic,
        "url": m.get("foreign_landing_url") or m.get("license_url") or "",
    }
json.dump(photos, open("src/data/gift-photos.json", "w"), ensure_ascii=False, indent=1)
print(len(photos), "fotos aplicadas")
