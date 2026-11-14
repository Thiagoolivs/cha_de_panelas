#!/usr/bin/env bash
# Extrai os assets do convite para public/assets/convite/.
# Requer poppler-utils (pdfimages, pdftocairo) e Python 3 com Pillow e svgelements.
# Uso: npm run assets
set -euo pipefail
cd "$(dirname "$0")/.."
PDF="assets/CONVITE_CH_DE_PANELA.pdf"
OUT="public/assets/convite"
if [[ ! -f "$PDF" ]]; then
  echo "Aviso: $PDF não encontrado."
  exit 0
fi
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
pdfimages -png -p "$PDF" "$TMP/img"
pdftocairo -svg -f 1 -l 1 "$PDF" "$TMP/p1.svg"
python3 -I scripts/extract_assets.py "$TMP" "$TMP/p1.svg" "$OUT"
