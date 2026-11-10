#!/usr/bin/env bash
# Extrai os assets do convite (Canva) para public/assets/convite/.
# Requer poppler-utils (pdfimages, pdftoppm, pdftocairo) e Python 3 com Pillow.
# Uso: npm run assets
set -euo pipefail
cd "$(dirname "$0")/.."

PDF="assets/CONVITE_CH_DE_PANELA.pdf"
OUT="public/assets/convite"
mkdir -p "$OUT" public/assets/fotos

if [[ ! -f "$PDF" ]]; then
  echo "Aviso: $PDF não encontrado. O site usa as ilustrações de reserva (ver DECISIONS.md)."
else
  TMP="$(mktemp -d)"
  trap 'rm -rf "$TMP"' EXIT
  pdfimages -list "$PDF" > "$TMP/list.txt"
  pdfimages -f 1 -l 2 -png -p "$PDF" "$TMP/img"
  pdftoppm -r 300 -f 1 -l 1 -png "$PDF" "$TMP/p1"
  pdftoppm -r 300 -f 5 -l 5 -png "$PDF" "$TMP/p5"
  pdftocairo -svg -f 1 -l 1 "$PDF" "$TMP/p1.svg" || true
  python3 -I scripts/extract_assets.py "$TMP" "$OUT"
fi

# Fotos opcionais de expressões: assets/fotos/{kawany,nathan}-{sorriso,surpresa,gargalhada}.(png|jpg|webp)
python3 -I scripts/extract_assets.py --fotos assets/fotos public/assets/fotos
