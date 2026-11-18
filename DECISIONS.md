# Decisões

Registro das escolhas feitas onde o briefing (`PROMPT_VISUAL`) estava ambíguo, ou onde algo mudou depois.

## Assets

- **O PDF do convite (`assets/CONVITE_CH_DE_PANELA.pdf`) não estava no repositório.** O site funciona sem ele:
  - Os utensílios line-art foram **desenhados à mão em SVG** (`src/components/ornaments/Utensils.tsx`), no traço oliva de ~1,4 px, e servem de referência para os ícones da casinha.
  - A foto das mãos com a aliança tem como reserva uma ilustração de alianças em line-art creme sobre oliva (`Rings.tsx`).
  - Sem os rostos recortados, os personagens usam um **rosto ilustrado** em line-art (cabelo cacheado para a Kawany, curto para o Nathan).
  - Assim que o PDF estiver em `assets/`, rode `npm run assets`. O script (`scripts/extract-assets.sh` + `extract_assets.py`) extrai rostos (RGB + smask, recorte justo, WebP q86), a foto das mãos e as faixas de utensílios (300 dpi, luminância → alpha tingida de `#70773d`). Depois, `scripts/asset-manifest.mjs` gera `src/generated/assets.json`, e os componentes passam a usar as fotos sem mudar código.
  - **As frações de recorte das faixas de utensílios (topo 0–16 %, rodapé 84–100 %) são estimativas.** Confira o resultado depois de rodar o script.
- Fotos opcionais de expressão: `assets/fotos/{kawany,nathan}-{sorriso,surpresa,gargalhada}.png`. O mesmo script as converte para `public/assets/fotos/*.webp`.
- Textos marcados `[CONVITE]` em `src/content/copy.ts` ("Vamos casar!" e "Roteiro") foram escritos a partir das frases citadas no briefing. Troque pelo texto exato do convite.

## Lista de presentes (mudou depois do briefing)

A Kawany mandou a lista real (mensagem e áudio de 10/11/2026). Ela substituiu a lista padrão de 30 itens do briefing:

- **50 itens em 4 faixas**, na organização dela: Kits econômicos (até ~R$ 50), Faixa intermediária (~R$ 50–150), Eletroportáteis, Presentes maiores (acima de ~R$ 150).
- **Quantidade por item:** "(2)" ou "(3)" quer dizer que esse número de pessoas pode escolher o item. O campo `quantity` cobre isso. O card mostra "Faltam N de M", e na casinha o objeto aparece empilhado (2 tábuas, 3 panos). O briefing dizia "cada presente é único"; isso foi substituído a pedido da noiva.
- **Kits mantidos como estão** (mais baratos, agrupados).
- **Contato para dúvidas de estilo:** depois de escolher, o convidado vê "Ficou em dúvida sobre cor, tamanho ou estilo? Fale com a Ra." A Ra pergunta à noiva sem dizer quem vai dar. O nome e o WhatsApp vêm de `NEXT_PUBLIC_STYLE_CONTACT_NAME` e `NEXT_PUBLIC_STYLE_CONTACT_PHONE`. **No áudio o nome soa como "Ra"/"Raíça". Confirmar a grafia e o número.** Sem número, o texto aparece sem o botão de WhatsApp.
- **A lista é agrupada e filtrada por faixa de preço**, não por cômodo. Quase tudo é de cozinha, então o filtro por cômodo seria inútil. A navegação por cômodo continua na casinha.

## Casinha

- Por causa da lista nova, os cômodos são **Copa, Despensa (andar de cima), Cozinha e Área de serviço (térreo)**. Quarto, sala e banheiro do briefing não teriam nenhum presente.
- Perspectiva de um ponto por cômodo: parede de fundo = retângulo do cômodo escalado por **K = 0,72** em torno do ponto de fuga (centro em x, 40 % da altura em y). Ou seja, inset de 28 %, perto dos ~24 % sugeridos, para dar um pouco mais de piso.
- Slots em **coordenadas locais do cômodo** (equivalentes às frações do briefing, mais fáceis de ajustar ao ver o render).
- Traço com `vector-effect: non-scaling-stroke`, para a espessura ser constante na tela em qualquer zoom.
- Os itens têm escala ~1,4× a real, para ficarem legíveis no celular.

## Dados

- `undo(giftId, token)`: a reserva devolve um token que fica só no aparelho do convidado. Assim dá para desfazer sem guardar quem deu, e com itens de quantidade > 1 sabemos qual unidade desfazer. O briefing sugeria `undo(giftId)`.
- `listGifts()` devolve `GiftView` (o presente + `reserved`/`remaining`), nunca nomes.
- `AdminSnapshot.gifts` ganhou `reserved` e `quantity` (contagens, sem nomes nem datas) para itens com quantidade > 1. Um teste Vitest garante que não há `guestName`, `guestId` ou campos de data.
- Convidados no admin: o mock deriva a lista de quem reservou ou deixou recado, mais alguns exemplos. A confirmação de presença real virá do backend.

## Identidade

### Paleta "premium" (11/11/2026)

O pedido foi deixar o visual mais premium, sem os tons pastéis. A paleta continua na família do convite (oliva, creme, marrom), mas com tons mais profundos e um acento de ouro:

| Token | Antes | Agora | Uso |
|---|---|---|---|
| `--olive-900` | `#5a6030` | `#262a19` floresta | fundos escuros (hero, roteiro, rodapé, casinha), botões |
| `--olive-700` | `#70773d` | `#4b5226` | títulos sobre marfim (7,2:1) |
| `--cream` | `#fdfbf7` | `#f4eee2` marfim | fundo padrão |
| `--card` | n/a | `#fbf8f1` | cards e modais |
| `--board` | `#966639` | `#7a4826` conhaque | só a tábua da data |
| `--tan` | `#c3a984` | `#b8975a` ouro envelhecido | filetes e detalhes (decorativo sobre marfim) |
| `--gold-light` | n/a | `#d4b97e` | texto e traço sobre floresta (7,7:1) |

- Botão principal: floresta com filete dourado interno; sobre fundo escuro, marfim. O marrom saiu dos botões.
- A casinha virou uma cena "ao entardecer": fundo floresta com vinheta, estrutura em traço marfim suave e os **presentes em dourado**, que agora se destacam do resto. As janelas e a luminária têm um brilho quente.
- Personagens com preenchimento sólido claro e traço floresta, como figuras de porcelana sobre o fundo escuro.
- O hero ganhou moldura de filete duplo dourado, como um cartão de papelaria.

### Base

- A "paleta de cores" da página 5 do convite (branco, bege, cinza, preto) foi tratada como **dress code**. A identidade do site é oliva + creme + marrom.
- Fontes: Cormorant Garamond (no lugar da The Seasons), Mrs Saint Delafield (assinatura) e Montserrat, via `next/font`.
- Nenhum texto pequeno sobre `#828753`. Blocos com texto usam `#70773d`.

## Stack

- Next.js 16 (App Router, Turbopack), Tailwind 4, Framer Motion 12, Vitest 3, Playwright 1.63 (mesma versão do Chromium pré-instalado no ambiente).
- `cacheComponents` desligado: o site é estático e a parte dinâmica é toda no cliente.
