/**
 * Catálogo de ícones line-art. Cada ícone vive num viewBox 100×100, com a base em
 * y=100 e o centro em x=50 (ícones "pendurados" têm o gancho em y≈2).
 * Traço: herdado do pai (currentColor, espessura constante via .lineart).
 * Preenchimento: creme para ocultar o que está atrás; tan bem leve como acento.
 */
import type { ReactNode } from "react";

const F = { fill: "var(--icon-fill, #fdfbf7)" };
const T = { fill: "var(--tan)", fillOpacity: 0.3 };
const G = { fill: "#e9eef0", fillOpacity: 0.55 }; // vidro
const soft = { opacity: 0.5 };

export interface IconDef {
  /** Pendurado num trilho (âncora no topo) em vez de apoiado na base. */
  hanging?: boolean;
  /** Largura útil aproximada no viewBox, para o layout de slots. */
  body: ReactNode;
}

/** Utensílios pendurados (kits), compartilhados entre ícones. */
const hook = (x: number) => <path d={`M${x} 2c-3 0-4 3-2 5l2 3`} />;

export const ICONS: Record<string, IconDef> = {
  airfryer: {
    body: (
      <>
        <path d="M24 98V44c0-14 11-22 26-22s26 8 26 22v54z" {...F} />
        <path d="M24 64h52" />
        <rect x="38" y="31" width="24" height="10" rx="2" />
        <path d="M54 36h4" />
        <path d="M40 78h20" strokeWidth={2} />
        <path d="M28 98v2M72 98v2" />
      </>
    ),
  },
  liquidificador: {
    body: (
      <>
        <path d="M33 100l3-20h28l3 20z" {...F} />
        <path d="M37 80l-5-56h36l-5 56z" {...G} />
        <path d="M37 80l-5-56h36l-5 56z" />
        <path d="M30 24h40v-7H30z" {...F} />
        <path d="M67 32h6c3 0 4 2 4 4v26c0 2-1 4-4 4h-8" />
        <circle cx="50" cy="90" r="3" />
        <path d="M38 38h8M38 50h8M39 62h7" {...soft} />
        <path d="M44 74l6-4 6 4" {...soft} />
      </>
    ),
  },
  cafeteira: {
    body: (
      <>
        <path d="M24 100V14h50v18H40v54h34v14z" {...F} />
        <path d="M40 32h34v8H40" />
        <path d="M44 52h26l-2 32H46z" {...G} />
        <path d="M44 52h26l-2 32H46z" />
        <path d="M46 70h22" fill="none" />
        <path d="M47 72h20l-1 12H48z" {...T} />
        <path d="M70 58h4c2 0 3 1 3 3v12c0 2-1 3-3 3h-5" />
        <circle cx="31" cy="92" r="2" />
        <path d="M30 22h8" {...soft} />
      </>
    ),
  },
  batedeira: {
    body: (
      <>
        <path d="M18 100h56v-8H18z" {...F} />
        <path d="M58 92V44h12v48z" {...F} />
        <path d="M16 28c0-8 6-12 14-12h32c8 0 12 4 12 10v12c0 4-3 6-6 6H22c-4 0-6-3-6-6z" {...F} />
        <path d="M36 44v10M33 54c0 6 6 6 6 0" />
        <path d="M18 62h40l-4 30H22z" {...F} />
        <path d="M17 62h42" />
        <circle cx="64" cy="30" r="2" />
        <path d="M24 26h20" {...soft} />
      </>
    ),
  },
  sanduicheira: {
    body: (
      <>
        <path d="M14 100V82c0-9 7-14 16-14h40c9 0 16 5 16 14v18z" {...F} />
        <path d="M14 86h72" />
        <path d="M42 68v-5h16v5" />
        <path d="M24 94h52" {...soft} />
        <circle cx="76" cy="77" r="1.6" />
      </>
    ),
  },
  mixer: {
    body: (
      <>
        <path d="M41 8h18c2 0 3 1 3 3v44H38V11c0-2 1-3 3-3z" {...F} />
        <rect x="45" y="18" width="10" height="12" rx="2" />
        <path d="M46 55v28M54 55v28" />
        <path d="M38 83h24l-4 17H42z" {...F} />
        <path d="M44 92h12" {...soft} />
      </>
    ),
  },
  "chaleira-eletrica": {
    body: (
      <>
        <path d="M26 100h48v-6H26z" {...F} />
        <path d="M30 94l4-54c0-7 6-12 14-12h6c8 0 12 5 12 12l4 54z" {...F} />
        <path d="M31 50l-11-9v6l10 12" />
        <path d="M68 40h5c3 0 5 2 5 5v30c0 3-2 5-5 5h-4" />
        <path d="M42 28v-4h14v4" />
        <path d="M36 70h30" {...soft} />
        <circle cx="72" cy="88" r="1.4" />
      </>
    ),
  },
  "garrafa-termica": {
    body: (
      <>
        <path d="M34 100V38c0-6 4-10 10-10h12c6 0 10 4 10 10v62z" {...F} />
        <path d="M39 28v-9h22v9" {...F} />
        <path d="M45 19v-6h16l4 4" />
        <path d="M66 44h5c3 0 4 2 4 4v28c0 2-1 4-4 4h-5" />
        <path d="M34 56h32M34 88h32" {...soft} />
        <path d="M34 56h32v32H34z" {...T} stroke="none" />
      </>
    ),
  },
  bule: {
    body: (
      <>
        <path d="M27 100c-4-6-7-14-7-22 0-16 13-26 30-26s30 10 30 26c0 8-3 16-7 22z" {...F} />
        <path d="M23 72c-8-2-14-10-16-20l6-2c2 6 6 10 10 12" />
        <path d="M78 64c8 0 12 4 12 10s-4 12-12 14" />
        <path d="M37 54c2-6 7-9 13-9s11 3 13 9" />
        <circle cx="50" cy="41" r="3" {...F} />
        <path d="M28 80c10 4 34 4 44 0" {...soft} />
      </>
    ),
  },
  leiteira: {
    body: (
      <>
        <path d="M24 60v30c0 6 4 10 10 10h20c6 0 10-4 10-10V60z" {...F} />
        <path d="M20 60h48" />
        <path d="M24 60l-6-5" />
        <path d="M64 62h28c2 0 3 1 3 3s-1 3-3 3H64" {...F} />
        <path d="M28 74h32" {...soft} />
      </>
    ),
  },
  frigideira: {
    body: (
      <>
        <path d="M8 80h58l-4 15c-1 3-3 5-6 5H18c-3 0-5-2-6-5z" {...F} />
        <path d="M6 80h62" />
        <path d="M66 84h24c3 0 5 2 5 4s-2 4-5 4H64" {...F} />
        <circle cx="91" cy="88" r="1.2" />
        <path d="M14 88h46" {...soft} />
      </>
    ),
  },
  "travessa-grande": {
    body: (
      <>
        <path d="M12 82h76l-6 14c-1 2-3 4-6 4H24c-3 0-5-2-6-4z" {...G} />
        <path d="M12 82h76l-6 14c-1 2-3 4-6 4H24c-3 0-5-2-6-4z" />
        <path d="M5 82c-2-3 0-6 3-6h84c3 0 5 3 3 6z" {...F} />
        <path d="M18 90h64" {...soft} />
      </>
    ),
  },
  "travessa-media": {
    body: (
      <>
        <path d="M22 84h56l-5 12c-1 2-3 4-6 4H33c-3 0-5-2-6-4z" {...G} />
        <path d="M22 84h56l-5 12c-1 2-3 4-6 4H33c-3 0-5-2-6-4z" />
        <path d="M16 84c-2-3 0-6 3-6h62c3 0 5 3 3 6z" {...F} />
      </>
    ),
  },
  assadeira: {
    body: (
      <>
        <path d="M10 86h80l-4 14H14z" {...F} />
        <path d="M10 86l7-7h66l7 7" {...F} />
        <path d="M17 79l4 7M83 79l-4 7" {...soft} />
      </>
    ),
  },
  "jogo-de-pratos": {
    body: (
      <>
        <path d="M14 96c0 3 8 4 14 4h44c6 0 14-1 14-4" />
        <path d="M14 90c0 3 8 4 14 4h44c6 0 14-1 14-4" />
        <path d="M14 84c0 3 8 4 14 4h44c6 0 14-1 14-4" />
        <ellipse cx="50" cy="78" rx="36" ry="8" {...F} />
        <ellipse cx="50" cy="78" rx="21" ry="4" {...soft} />
        <path d="M14 78v18M86 78v18" />
      </>
    ),
  },
  "pratos-sobremesa": {
    body: (
      <>
        <path d="M24 96c0 3 6 4 10 4h32c4 0 10-1 10-4" />
        <path d="M24 90c0 3 6 4 10 4h32c4 0 10-1 10-4" />
        <ellipse cx="50" cy="84" rx="26" ry="6" {...F} />
        <ellipse cx="50" cy="84" rx="14" ry="3" {...soft} />
        <path d="M24 84v12M76 84v12" />
        <path d="M44 80c0-6 4-10 8-12 3 4 4 8 2 12z" {...T} />
      </>
    ),
  },
  "jogo-de-copos": {
    body: (
      <>
        {[18, 41, 64].map((x) => (
          <g key={x}>
            <path d={`M${x} 60h18l-3 40H${x + 3}z`} {...G} />
            <path d={`M${x} 60h18l-3 40H${x + 3}z`} />
            <path d={`M${x + 1} 74h16`} {...soft} />
          </g>
        ))}
      </>
    ),
  },
  "jogo-de-tacas": {
    body: (
      <>
        {[30, 66].map((x) => (
          <g key={x}>
            <path d={`M${x - 12} 34c0 16 4 26 12 26s12-10 12-26z`} {...G} />
            <path d={`M${x - 12} 34c0 16 4 26 12 26s12-10 12-26z`} />
            <path d={`M${x} 60v32M${x - 10} 100c0-5 4-8 10-8s10 3 10 8z`} />
            <path d={`M${x - 11} 46h22`} {...soft} />
          </g>
        ))}
      </>
    ),
  },
  "jogo-de-xicaras": {
    body: (
      <>
        <path d="M14 100c2-4 8-6 26-6s24 2 26 6z" {...F} />
        <path d="M22 94c-2-8-3-16-3-24h34c0 8-1 16-3 24z" {...F} />
        <path d="M53 74c7 0 9 3 9 7s-3 7-9 7" />
        <path d="M58 70c2-6 8-8 16-8 7 0 12 2 13 8-1 6-6 8-13 8s-14-2-16-8z" {...F} />
        <path d="M60 70c2 10 4 18 6 22h16c2-4 4-12 5-22" {...F} />
        <path d="M22 76h30" {...soft} />
      </>
    ),
  },
  "jogo-de-bowls": {
    body: (
      <>
        <path d="M14 76h72c0 14-14 24-36 24S14 90 14 76z" {...F} />
        <path d="M26 62h48c0 10-10 16-24 16s-24-6-24-16z" {...F} />
        <ellipse cx="50" cy="62" rx="24" ry="4" />
        <path d="M14 76h12M74 76h12" />
        <path d="M22 88c10 6 46 6 56 0" {...soft} />
      </>
    ),
  },
  "jogo-de-talheres": {
    body: (
      <>
        <path d="M40 30V68" />
        <ellipse cx="40" cy="22" rx="5" ry="8" {...F} />
        <path d="M51 68V34M46 34V16M49 34V16M53 34V16M56 34V16M46 30c0 4 2 5 5 5s5-1 5-5" />
        <path d="M63 68V36" />
        <path d="M61 36V14c5 2 7 12 5 22z" {...F} />
        <path d="M32 100l-2-32h40l-2 32z" {...F} />
        <path d="M32 80h36" {...soft} />
      </>
    ),
  },
  "faqueiro-servir": {
    body: (
      <>
        <path d="M12 76l6-26h64l6 26z" {...T} />
        <path d="M12 76l6-26h64l6 26z" />
        <path d="M28 72l4-16M42 72l2-18M58 72l-2-18M72 72l-4-16" />
        <path d="M12 100V76h76v24z" {...F} />
        <path d="M44 86h12" />
      </>
    ),
  },
  "jogo-de-facas": {
    body: (
      <>
        <path d="M36 52l-3-24h8l4 24M46 52l0-28h8v28M57 52l2-22h8l-4 22" {...F} />
        <path d="M28 100l8-48h28l8 48z" {...T} />
        <path d="M28 100l8-48h28l8 48z" />
        <path d="M38 60h24" {...soft} />
      </>
    ),
  },
  "tabua-de-corte": {
    body: (
      <>
        <path d="M30 100V38c0-5 4-9 9-9h5v-8c0-4 2-7 6-7s6 3 6 7v8h5c5 0 9 4 9 9v62z" {...T} />
        <path d="M30 100V38c0-5 4-9 9-9h5v-8c0-4 2-7 6-7s6 3 6 7v8h5c5 0 9 4 9 9v62z" />
        <circle cx="50" cy="21" r="2.4" />
        <path d="M39 48c3 18 0 34 2 46M60 42c-2 22 2 38 0 52" {...soft} />
      </>
    ),
  },
  "tabua-de-frios": {
    body: (
      <>
        <path d="M6 100v-6h68c3 0 5-2 9-2h7c3 0 4 2 4 4s-1 4-4 4z" {...T} />
        <path d="M6 100v-6h68c3 0 5-2 9-2h7c3 0 4 2 4 4s-1 4-4 4z" />
        <path d="M14 94l9-20 18 20z" {...F} />
        <circle cx="24" cy="88" r="1.6" />
        <circle cx="50" cy="88" r="6" {...F} />
        <circle cx="60" cy="88" r="6" {...F} />
        <circle cx="72" cy="90" r="3" {...F} />
        <circle cx="76" cy="85" r="3" {...F} />
        <circle cx="80" cy="90" r="3" {...F} />
        <path d="M76 82c0-3 2-5 4-5" />
      </>
    ),
  },
  "porta-frios": {
    body: (
      <>
        <path d="M16 100V74h68v26z" {...G} />
        <path d="M16 100V74h68v26z" />
        <path d="M22 96l6-14h44l6 14" {...T} />
        <path d="M13 74h74v-8H13z" {...F} />
        <path d="M28 66v12M72 66v12" />
      </>
    ),
  },
  manteigueira: {
    body: (
      <>
        <path d="M12 100h76v-6H12z" {...F} />
        <path d="M22 94V78c0-6 6-10 14-10h28c8 0 14 4 14 10v16z" {...F} />
        <circle cx="50" cy="64" r="3.5" {...F} />
        <path d="M30 78h40" {...soft} />
      </>
    ),
  },
  "jarra-de-vidro": {
    body: (
      <>
        <path d="M32 100l-4-58c0-6 2-12 4-16h30c2 4 4 10 4 16l-4 58z" {...G} />
        <path d="M32 100l-4-58c0-6 2-12 4-16h30c2 4 4 10 4 16l-4 58z" />
        <path d="M32 26l-6-5h6" />
        <path d="M64 36h6c4 0 6 3 6 6v28c0 4-3 6-6 6h-6" />
        <path d="M30 56c6 2 10-2 16 0s10 2 18 0" {...soft} />
      </>
    ),
  },
  "jarra-medidora": {
    body: (
      <>
        <path d="M28 100l-2-50h44l-2 50z" {...G} />
        <path d="M28 100l-2-50h44l-2 50z" />
        <path d="M26 50l-7-4h7" />
        <path d="M70 56h6c3 0 4 2 4 4v24c0 2-1 4-4 4h-8" />
        <path d="M30 60h8M30 70h12M30 80h8M30 90h12" />
      </>
    ),
  },
  bandeja: {
    body: (
      <>
        <rect x="16" y="30" width="68" height="70" rx="9" {...F} />
        <rect x="23" y="38" width="54" height="54" rx="5" {...T} />
        <rect x="23" y="38" width="54" height="54" rx="5" />
        <path d="M42 34h16" strokeWidth={2.5} />
      </>
    ),
  },
  "potes-de-vidro": {
    body: (
      <>
        <rect x="18" y="78" width="64" height="22" rx="3" {...G} />
        <rect x="18" y="78" width="64" height="22" rx="3" />
        <rect x="16" y="72" width="68" height="6" rx="2" {...F} />
        <rect x="24" y="52" width="52" height="20" rx="3" {...G} />
        <rect x="24" y="52" width="52" height="20" rx="3" />
        <rect x="22" y="46" width="56" height="6" rx="2" {...F} />
        <path d="M24 92h52" {...soft} />
      </>
    ),
  },
  "potes-hermeticos": {
    body: (
      <>
        <path d="M16 100V62c0-4 2-6 6-6h22c4 0 6 2 6 6v38z" {...G} />
        <path d="M16 100V62c0-4 2-6 6-6h22c4 0 6 2 6 6v38z" />
        <path d="M18 56v-7h30v7" {...F} />
        <path d="M48 50l5 6v10" />
        <path d="M18 82h30" {...soft} />
        <path d="M54 100V48c0-4 2-6 6-6h20c4 0 6 2 6 6v52z" {...G} />
        <path d="M54 100V48c0-4 2-6 6-6h20c4 0 6 2 6 6v52z" />
        <path d="M56 42v-7h28v7" {...F} />
        <path d="M84 36l5 6v10" />
        <path d="M54 76h32" {...soft} />
      </>
    ),
  },
  "potes-temperos": {
    body: (
      <>
        <path d="M10 100h80" />
        {[14, 32, 50, 68].map((x, i) => (
          <g key={x}>
            <rect x={x} y={76} width={15} height={24} rx={2} {...G} />
            <rect x={x} y={76} width={15} height={24} rx={2} />
            <rect x={x - 1} y={70} width={17} height={6} rx={1.5} {...F} />
            <rect x={x + 3} y={84} width={9} height={7} {...(i % 2 ? T : F)} />
          </g>
        ))}
      </>
    ),
  },
  "porta-mantimentos": {
    body: (
      <>
        <rect x="10" y="54" width="26" height="46" rx="3" {...F} />
        <path d="M10 62h26M20 50h6v4h-6z" />
        <rect x="16" y="72" width="14" height="10" {...T} />
        <rect x="38" y="64" width="24" height="36" rx="3" {...F} />
        <path d="M38 72h24M47 60h6v4h-6z" />
        <rect x="43" y="80" width="14" height="9" {...T} />
        <rect x="64" y="74" width="24" height="26" rx="3" {...F} />
        <path d="M64 81h24M73 70h6v4h-6z" />
        <rect x="69" y="86" width="14" height="8" {...T} />
      </>
    ),
  },
  "porta-pao": {
    body: (
      <>
        <path d="M12 100V68c0-14 16-22 38-22s38 8 38 22v32z" {...T} />
        <path d="M12 100V68c0-14 16-22 38-22s38 8 38 22v32z" />
        <path d="M12 74h76" />
        <path d="M18 70c4-10 18-16 32-16s28 6 32 16" {...soft} />
        <path d="M42 66h16" strokeWidth={2.2} />
      </>
    ),
  },
  "kit-temperos": {
    body: (
      <>
        <path d="M12 100V80c0-4 3-7 5-8h10c2 1 5 4 5 8v20z" {...F} />
        <path d="M17 72v-4h10v4M19 66v.1M22 65v.1M25 66v.1" />
        <path d="M38 100c-4-4-6-10-6-16h34c0 6-2 12-6 16z" {...F} />
        <path d="M33 84c2-6 8-9 16-9s14 3 16 9" />
        <circle cx="49" cy="72" r="2.5" {...F} />
        <path d="M60 78l6-10" />
        <path d="M72 100V72c0-4 3-6 5-8v-12h6v12c2 2 5 4 5 8v28z" {...G} />
        <path d="M72 100V72c0-4 3-6 5-8v-12h6v12c2 2 5 4 5 8v28z" />
        <path d="M80 52l4-6" />
        <path d="M72 86h16" {...soft} />
      </>
    ),
  },
  "kit-mesa-posta": {
    body: (
      <>
        <path d="M4 100l10-12h72l10 12z" {...T} />
        <path d="M4 100l10-12h72l10 12z" />
        <path d="M14 96h72" {...soft} />
        <path d="M40 92V64h20v28" {...F} />
        <path d="M36 92V70c0-5 6-8 14-8s14 3 14 8v22" />
        <path d="M44 64l2-6h8l2 6" />
      </>
    ),
  },
  "kit-corte": {
    hanging: true,
    body: (
      <>
        {hook(20)}
        <path d="M20 10v4" />
        <path d="M12 26h16l3 52H9z" {...F} />
        <path d="M14 26c0-8 12-8 12 0" />
        <path d="M14 38h12M13 48h14M13 58h14M12 68h16" {...soft} />
        {hook(50)}
        <rect x="46" y="10" width="8" height="36" rx="4" {...F} />
        <path d="M46 46c0 10 2 16 4 16s4-6 4-16" />
        <path d="M48 50v8" {...soft} />
        {hook(80)}
        <rect x="77" y="10" width="6" height="34" rx="3" {...F} />
        <path d="M80 44v6" />
        <circle cx="80" cy="62" r="12" {...F} />
        <circle cx="80" cy="62" r="2" />
      </>
    ),
  },
  "kit-espatulas": {
    hanging: true,
    body: (
      <>
        {hook(20)}
        <rect x="17.5" y="10" width="5" height="44" rx="2.5" {...F} />
        <path d="M12 54h16v24c0 4-3 6-8 6s-8-2-8-6z" {...T} />
        <path d="M12 54h16v24c0 4-3 6-8 6s-8-2-8-6z" />
        {hook(50)}
        <rect x="47" y="10" width="6" height="26" rx="3" {...F} />
        <path d="M47 36h6l1 54c0 3-2 4-4 4s-4-1-4-4z" {...F} />
        {hook(80)}
        <rect x="77" y="10" width="6" height="30" rx="3" {...F} />
        <path d="M80 40c-10 12-11 34-6 46 2 4 4 6 6 6s4-2 6-6c5-12 4-34-6-46z" />
        <path d="M80 40c-3 14-3 36 0 52M80 40c3 14 3 36 0 52" />
      </>
    ),
  },
  "kit-concha": {
    hanging: true,
    body: (
      <>
        {hook(20)}
        <path d="M18.5 8h3v60h-3z" {...F} />
        <path d="M20 68c-10 0-13 6-13 13 0 9 6 14 13 14s13-5 13-14c0-7-3-13-13-13z" {...F} />
        <path d="M7 80h26" />
        {hook(50)}
        <path d="M48.5 8h3v56h-3z" {...F} />
        <circle cx="50" cy="78" r="14" {...F} />
        <path d="M45 73h.1M50 71h.1M55 73h.1M45 80h.1M50 79h.1M55 80h.1M50 86h.1" strokeWidth={2.4} />
        {hook(80)}
        <path d="M78.5 8h3v54h-3z" {...F} />
        <path d="M72 62h16v14c0 6-4 10-8 10s-8-4-8-10z" {...F} />
        <path d="M73 76l-1 6M77 78v6M83 78v6M87 76l1 6" />
      </>
    ),
  },
  "kit-arroz-sorvete": {
    hanging: true,
    body: (
      <>
        {hook(18)}
        <path d="M16 8h4v56h-4z" {...F} />
        <ellipse cx="18" cy="76" rx="10" ry="13" {...F} />
        {hook(46)}
        <rect x="42" y="10" width="8" height="44" rx="4" {...F} />
        <path d="M46 54v6" />
        <path d="M36 70c0-6 4-10 10-10s10 4 10 10c0 4-4 6-10 6s-10-2-10-6z" {...F} />
        {hook(78)}
        <path d="M78 10v6" />
        <circle cx="78" cy="38" r="20" {...T} />
        <circle cx="78" cy="38" r="20" />
        <circle cx="78" cy="38" r="12" />
        <path d="M66 38h24M78 26v24" {...soft} />
      </>
    ),
  },
  "kit-espremedores": {
    hanging: true,
    body: (
      <>
        {hook(18)}
        <path d="M14 10h8v40l-2 6h-4l-2-6z" {...F} />
        <path d="M22 50l6 4v30" />
        <rect x="10" y="54" width="14" height="14" rx="2" {...F} />
        {hook(50)}
        <path d="M46 10h8v36h-8z" {...F} />
        <path d="M38 46h24c0 10-5 16-12 16s-12-6-12-16z" {...T} />
        <path d="M38 46h24c0 10-5 16-12 16s-12-6-12-16z" />
        <path d="M50 62v20" />
        <rect x="47" y="82" width="6" height="12" rx="3" {...F} />
        {hook(80)}
        <rect x="76" y="10" width="8" height="46" rx="4" {...F} />
        <path d="M76 56h8l2 12c0 3-3 5-6 5s-6-2-6-5z" {...F} />
        <path d="M79 62h3" />
      </>
    ),
  },
  "kit-medidas": {
    hanging: true,
    body: (
      <>
        {hook(24)}
        <circle cx="24" cy="14" r="4" />
        <path d="M22 18l-8 14M24 18v20M26 18l8 14" />
        <path d="M6 32h16l-2 14H8z" {...F} />
        <path d="M17 38h14l-2 10H19z" {...F} />
        <path d="M16 52h16l-2 16H18z" {...F} />
        {hook(68)}
        <rect x="65" y="10" width="6" height="30" rx="3" {...F} />
        <path d="M68 40v4" />
        <path d="M50 52c0-6 8-8 18-8s18 2 18 8c0 14-8 24-18 24s-18-10-18-24z" {...T} />
        <path d="M50 52c0-6 8-8 18-8s18 2 18 8c0 14-8 24-18 24s-18-10-18-24z" />
        <path d="M54 58h28M56 66h24M62 72h12M60 50v22M68 48v28M76 50v22" {...soft} />
      </>
    ),
  },
  "kit-forno": {
    hanging: true,
    body: (
      <>
        {hook(28)}
        <path d="M28 10v6" />
        <path d="M18 18h20c4 0 6 3 6 6v40c0 6-4 10-10 10h-6c-8 0-14-6-14-14V40l-6-6c-3-3 0-8 4-7l6 1z" {...T} />
        <path d="M18 18h20c4 0 6 3 6 6v40c0 6-4 10-10 10h-6c-8 0-14-6-14-14V40l-6-6c-3-3 0-8 4-7l6 1z" />
        <path d="M14 62h30" />
        {hook(72)}
        <path d="M72 10v6" />
        <circle cx="72" cy="38" r="20" {...F} />
        <circle cx="72" cy="38" r="13" />
        <path d="M59 38h26M72 25v26" {...soft} />
      </>
    ),
  },
  "kit-panos": {
    hanging: true,
    body: (
      <>
        <path d="M6 6h88" strokeWidth={2} />
        <path d="M12 6h26v58H12z" {...F} />
        <path d="M12 52h26M12 56h26" />
        <path d="M30 6h24v66H30z" {...T} />
        <path d="M30 6h24v66H30z" />
        <path d="M30 18h24M30 22h24" {...soft} />
        <path d="M60 6c0 6 4 8 8 8h4c4 0 8-2 8-8" />
        <path d="M64 14l-6 14 4 58h28l4-58-6-14" {...F} />
        <path d="M60 46h36" />
        <path d="M68 58h20v14H68z" {...soft} />
      </>
    ),
  },
  "kit-limpeza": {
    body: (
      <>
        <path d="M24 100V4" />
        <path d="M18 100l-4-8h20l-4 8" {...F} />
        <path d="M12 92h24v-6H12z" {...F} />
        <path d="M16 92v8M20 92v8M24 92v8M28 92v8M32 92v8" {...soft} />
        <path d="M46 100V10" />
        <path d="M34 100v-6h24v6z" {...F} />
        <path d="M58 100l-3-34h34l-3 34z" {...F} />
        <path d="M56 66c0-14 34-14 34 0" />
        <path d="M58 76h30" {...soft} />
      </>
    ),
  },
  mop: {
    body: (
      <>
        <path d="M40 74V4" />
        <path d="M30 74h20l6 26H24z" {...F} />
        <path d="M28 82l-2 18M34 82l-2 18M40 82v18M46 82l2 18M52 82l2 18" {...soft} />
        <path d="M58 100l-2-30h32l-2 30z" {...F} />
        <path d="M56 70h32" />
        <path d="M60 70c0-12 24-12 24 0" />
        <path d="M60 84h24" {...soft} />
      </>
    ),
  },
  "kit-pia": {
    body: (
      <>
        <path d="M6 100V82h24v18z" {...F} />
        <path d="M9 82v-6h18v6" />
        <rect x="10" y="72" width="16" height="6" rx="2" {...T} />
        <path d="M38 100V66c0-4 2-6 4-6h10c2 0 4 2 4 6v34z" {...F} />
        <path d="M43 60v-8h8v4h6" />
        <path d="M38 80h18" {...soft} />
        <path d="M62 100V80h32v20z" {...F} />
        <path d="M66 80V62M72 80V58M78 80V60M84 80V58M90 80V62" />
        <ellipse cx="74" cy="66" rx="2" ry="12" {...F} />
      </>
    ),
  },
  lixeira: {
    body: (
      <>
        <path d="M30 100l-2-60h44l-2 60z" {...F} />
        <path d="M26 40c0-8 10-12 24-12s24 4 24 12z" {...F} />
        <path d="M46 28v-3h8v3" />
        <path d="M44 100l-6 0v-4h8z" />
        <path d="M34 56v34M50 56v34M66 56v34" {...soft} />
      </>
    ),
  },
  "tapete-cozinha": {
    body: (
      <>
        <path d="M14 100l8-14h56l8 14z" {...T} />
        <path d="M14 100l8-14h56l8 14z" />
        <path d="M19 95h62M21 90h58" {...soft} />
        <path d="M10 100h4M86 100h4M18 86h-3M82 86h3" />
      </>
    ),
  },
  "caixa-presente": {
    body: (
      <>
        <rect x="22" y="54" width="56" height="46" {...F} />
        <rect x="18" y="42" width="64" height="12" {...F} />
        <path d="M50 42v58" />
        <path d="M44 42v58M56 42v58" {...soft} />
        <path d="M50 42c-6-12-22-14-22-5 0 5 10 5 22 5zM50 42c6-12 22-14 22-5 0 5-10 5-22 5z" />
      </>
    ),
  },
};

export const FALLBACK_ICON = "caixa-presente";

export function iconFor(key: string): IconDef {
  return ICONS[key] ?? ICONS[FALLBACK_ICON];
}
