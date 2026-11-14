# Chá dos Noivos · Kaw e Than

Site do chá de panela da **Kawany** e do **Nathan**: convite, lista de presentes com a **casinha ilustrada** onde cada presente entra, o casal reagindo, recado para a noiva e uma prévia do painel dela.

Evento: **12/12/2026, 14h** (America/Sao_Paulo).

Esta etapa é só a camada visual. Os dados são simulados (repositório mock em memória + `localStorage`), sem backend.

## Como rodar

Requer Node 20+.

```bash
npm install
```

```bash
npm run dev
```

Abra http://localhost:3000. Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run build` | build de produção (estático) |
| `npm start` | serve o build |
| `npm test` | testes Vitest (repositório, privacidade do admin, links, .ics) |
| `npm run e2e` | Playwright: fluxos (reserva, conflito, recado, admin, teclado, reduced motion) e capturas em 4 tamanhos de tela, salvas em `e2e/__screens__/` |
| `npm run lint` | ESLint |
| `npm run assets` | extrai os assets do convite (ver abaixo) |
| `npm run og` | gera `src/app/opengraph-image.png` (com o site rodando; passe a URL se não for a 3000) |

Na primeira vez, o Playwright precisa de um Chromium: `npx playwright install chromium`.

## Páginas

- `/`: convite (hero, "Vamos casar!", roteiro, como fazer parte, agenda .ics, Pix)
- `/presentes`: casinha + lista de presentes
- `/recado`: recado identificado para a Kawany
- `/admin-preview` e `/icones`: só no modo demonstração

## Trocar a lista de presentes

Edite **só** `src/data/gifts.default.ts`. Cada linha tem id, título, descrição, cômodo, slot, ícone, categoria da reação, quantidade e termo de busca. Os links da Amazon, do Mercado Livre e da Magalu são gerados a partir do termo de busca.

- `quantity: 2` significa que duas pessoas podem escolher o item. Na casinha ele aparece empilhado.
- Os cômodos são `cozinha`, `copa`, `despensa` e `servico`. Os slots de cada um estão em `src/components/house/slots.ts`.
- Um item com ícone ou slot inválido entra como caixa de presente no primeiro lugar livre do cômodo.
- `featuredUrl` (opcional) acrescenta um link "Sugestão". `image` (opcional) substitui o ícone na lista.

O teste `lista padrão` (em `npm test`) avisa se um id, ícone ou slot estiver errado ou repetido.

## Configuração (`.env`)

Copie `.env.example` para `.env.local` e ajuste:

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_DEMO` | `true` liga o modo demonstração. `false` remove o painel, a prévia do admin e a folha de ícones. |
| `NEXT_PUBLIC_EVENT_ADDRESS` | endereço. Vazio mostra "Endereço em breve". |
| `NEXT_PUBLIC_PIX_KEY`, `NEXT_PUBLIC_PIX_HOLDER` | chave Pix e nome do titular. Vazio mostra "em breve". |
| `NEXT_PUBLIC_STYLE_CONTACT_NAME`, `NEXT_PUBLIC_STYLE_CONTACT_PHONE` | pessoa que tira dúvidas de estilo com a noiva (WhatsApp com DDI, ex.: `5511999999999`) |
| `NEXT_PUBLIC_VIDEO_URL` | vídeo do casal em "Como fazer parte" |
| `NEXT_PUBLIC_SITE_URL` | URL pública (para o .ics e as metatags) |

Os valores das cotas Pix estão em `src/config/site.ts`, e os textos em `src/content/`.

## Desligar o modo demonstração

```bash
NEXT_PUBLIC_DEMO=false npm run build
```

Ou defina a variável em `.env.local`. O painel "Demo" (simular convidado, encher e esvaziar a casa, rever reação) some por completo.

## Trocar o repositório mock pelo real

Todo componente acessa os dados por `useGifts()` (`src/lib/repository/context.tsx`). Nenhum importa o mock.

1. Implemente a interface `GiftsRepository` de `src/lib/types.ts` (ex.: `ApiGiftsRepository` chamando a API).
2. Devolva-a em `createRepository()` (`src/lib/repository/index.ts`).

Regras que a implementação real deve manter:

- `listGifts()` e `houseState()` nunca trazem nomes.
- `reserve()` é atômica e devolve `taken` quando o item esgotou. O `token` devolvido fica só no aparelho do convidado e é o que permite `undo()`.
- `adminView()` não tem nome de quem deu, ligação convidado↔presente nem datas. O teste `src/__tests__/admin-privacy.test.ts` serve de contrato.

## Assets do convite

Coloque o PDF em `assets/CONVITE_CH_DE_PANELA.pdf` e rode `npm run assets` (requer `poppler-utils` e Python 3 com Pillow). O script extrai:

- os rostos (`public/assets/convite/{kawany,nathan}.webp`)
- a foto das mãos (`maos.webp`)
- as faixas de utensílios

Depois, regenera `src/generated/assets.json`. O site passa a usar as fotos automaticamente. Sem elas, usa as ilustrações de reserva.

Expressões extras são opcionais: `assets/fotos/{kawany,nathan}-{sorriso,surpresa,gargalhada}.png`. A reação troca o rosto quando existem.

Veja `DECISIONS.md` para as escolhas de design e o que ainda depende do convite.
