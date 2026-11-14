/**
 * Estrutura permanente de cada cômodo (para a casa nunca parecer vazia).
 * Coordenadas locais do cômodo; os slots em slots.ts se apoiam nestas superfícies.
 */
import type { Room } from "@/lib/types";
import { Pendant } from "./RoomShell";

const C = "var(--h-fill)"; // preenchimento dos móveis
const W = { fill: "var(--h-wood)" }; // madeira
const soft = { opacity: 0.5 };

const LEAF = "#a9af78"; // folhas (oliva claro)
const POT = "#b07a4f"; // vasinhos de barro

/** Vasinho com folhas, com a base em (x, y). */
function Plant({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-3 -8c-6-4-7-12-3-16 2 5 3 10 3 16zM3 -8c6-4 7-12 3-16-2 5-3 10-3 16zM0 -9c-2-7-1-14 2-17 1 6 0 12-2 17z" fill={LEAF} />
      <path d="M-5 -8h10l-1.5 8h-7z" fill={POT} />
    </g>
  );
}

function Curtains({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <path d={`M${x - 8} ${y - 4}H${x + w + 8}`} strokeWidth={1.4} />
      <path d={`M${x - 6} ${y - 4}h${w * 0.24}c-2 ${h * 0.4}-1 ${h * 0.75} ${w * 0.06} ${h + 6}h-${w * 0.3}c-2-${h * 0.4} 0-${h * 0.8}-${w * 0.0} -${h + 6}z`} fill="#fdfcf9" fillOpacity={0.55} />
      <path d={`M${x + w + 6} ${y - 4}h-${w * 0.24}c2 ${h * 0.4} 1 ${h * 0.75}-${w * 0.06} ${h + 6}h${w * 0.3}c2-${h * 0.4} 0-${h * 0.8} 0-${h + 6}z`} fill="#fdfcf9" fillOpacity={0.55} />
    </g>
  );
}

function Window({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="var(--h-glass)" />
      <path d={`M${x + 6} ${y + h - 10}c${w * 0.2} -8 ${w * 0.4} -10 ${w * 0.6} -6`} opacity={0.35} />
      <rect x={x} y={y} width={w} height={h} />
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} {...soft} />
      <path d={`M${x + w / 2} ${y + 3}V${y + h - 3}M${x + 3} ${y + h / 2}H${x + w - 3}`} />
      <path d={`M${x - 4} ${y + h}h${w + 8}v3h-${w + 8}z`} fill={C} />
      <Curtains x={x} y={y} w={w} h={h} />
    </g>
  );
}

function Kitchen() {
  return (
    <g>
      {/* janela, coifa, prateleira alta, trilho */}
      <Window x={160} y={34} w={70} h={36} />
      <path d="M100 29v8M114 29v8" />
      <path d="M86 37h42l8 22H78z" fill={C} />
      <path d="M80 59h54" />
      <path d="M268 58h134v4H268z" {...W} />
      <path d="M276 62l6 8M394 62l-6 8" />
      <path d="M140 78H384" strokeWidth={1.6} />
      <circle cx="140" cy="78" r="2" fill={C} />
      <circle cx="384" cy="78" r="2" fill={C} />
      {/* azulejos atrás da bancada */}
      <g opacity={0.16}>
        <path d="M138 118H402M138 130H402M138 142H402" />
        {Array.from({ length: 17 }, (_, i) => (
          <path key={i} d={`M${138 + i * 16} 118V154`} />
        ))}
      </g>
      {/* relógio */}
      <circle cx="249" cy="46" r="9" fill={C} />
      <circle cx="249" cy="46" r="6.5" opacity={0.4} />
      <path d="M249 46V41M249 46l3.5 2" />
      {/* temperinhos no parapeito */}
      <Plant x={171} y={70} s={0.55} />
      <Plant x={195} y={70} s={0.6} />
      <Plant x={219} y={70} s={0.55} />
      {/* fogão com forno */}
      <rect x="76" y="154" width="62" height="62" fill={C} />
      <path d="M76 160h62" />
      <circle cx="84" cy="157" r="1.2" />
      <circle cx="130" cy="157" r="1.2" />
      <rect x="82" y="166" width="50" height="42" rx="2" />
      <rect x="88" y="174" width="38" height="22" {...soft} />
      <ellipse cx="92" cy="153" rx="10" ry="1.6" />
      <ellipse cx="124" cy="153" rx="9" ry="1.6" />
      {/* bancada com armários e pia */}
      <rect x="138" y="154" width="264" height="6" {...W} />
      <rect x="140" y="160" width="260" height="56" fill={C} />
      {[140, 192, 244, 296, 348].map((x) => (
        <g key={x}>
          <rect x={x + 3} y={164} width={46} height={48} {...soft} />
          <path d={`M${x + 41} 170v8`} />
        </g>
      ))}
      <path d="M332 154h30" strokeWidth={2.2} opacity={0.6} />
      <path d="M347 154v-16c0-6 8-6 8 0" />
      <path d="M352 140h7" />
    </g>
  );
}

function Copa() {
  return (
    <g>
      {/* tapete sob a mesa */}
      <ellipse cx="210" cy="247" rx="118" ry="10" fill="#fdfcf9" fillOpacity={0.12} />
      <ellipse cx="210" cy="247" rx="108" ry="7" opacity={0.35} />
      <Window x={178} y={44} w={64} h={80} />
      {/* quadrinho com coração */}
      <rect x="298" y="62" width="28" height="24" fill={C} />
      <rect x="301" y="65" width="22" height="18" opacity={0.5} />
      <path d="M312 79c-6-4-8-7-6-10 1.5-2 4.5-2 6 1 1.5-3 4.5-3 6-1 2 3 0 6-6 10z" fill="#fdfcf9" fillOpacity={0.7} />
      {/* planta no canto */}
      <Plant x={398} y={254} s={1.6} />
      {/* cristaleira */}
      <path d="M62 58h98v6H62z" {...W} />
      <rect x="66" y="64" width="90" height="152" fill={C} />
      <path d="M66 94h90M66 128h90M66 162h90" strokeWidth={1.4} />
      <path d="M111 166v46" {...soft} />
      <path d="M104 186v6M118 186v6" />
      <path d="M68 64v98M154 64v98" {...soft} />
      {/* aparador */}
      <path d="M260 166h98v5h-98z" {...W} />
      <rect x="264" y="171" width="90" height="36" fill={C} />
      <path d="M294 171v36M324 171v36" {...soft} />
      <path d="M276 187h6M306 187h6M336 187h6" />
      <path d="M268 207v9M350 207v9" />
      {/* mesa e cadeiras (no meio do piso, à frente) */}
      <path d="M96 180v72M96 222h18v4H96M110 226v26" fill={C} />
      <path d="M324 180v72M324 222h-18v4h18M310 226v26" fill={C} />
      <path d="M124 208h172l6 8H118z" {...W} />
      <path d="M118 216h184v4H118z" fill={C} />
      <path d="M126 220v34M294 220v34M140 220v26M280 220v26" />
    </g>
  );
}

function Pantry() {
  return (
    <g>
      <Pendant x={140} y0={0} y={34} />
      <path d="M48 40h184v4H48z" {...W} />
      <path d="M50 44v172M230 44v172" strokeWidth={1.4} />
      {[74, 122, 170].map((y) => (
        <path key={y} d={`M50 ${y}h180v4H50z`} {...W} />
      ))}
      {[[60, 78], [200, 78], [70, 126], [205, 126], [62, 174], [208, 174]].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="10" height="5" rx="1" fill="#fdfcf9" fillOpacity={0.5} />
      ))}
      {/* cesto de vime e saco de arroz no chão, sob a estante */}
      <path d="M66 216l4-24h40l4 24z" fill={C} />
      <path d="M68 200h44M69 208h42" {...soft} />
      <path d="M154 216c-4-10-2-22 4-28l-2-6h28l-2 6c6 6 8 18 4 28z" fill={C} />
      <path d="M160 182c6 3 18 3 24 0" {...soft} />
    </g>
  );
}

function Service() {
  return (
    <g>
      {/* varal com uma camisa */}
      <path d="M32 54H178" />
      <circle cx="32" cy="54" r="1.6" />
      <circle cx="178" cy="54" r="1.6" />
      <path d="M100 54l-14 6 4 8 6-3v26h28V65l6 3 4-8-14-6c-2 4-6 5-10 5s-8-1-10-5z" fill={C} />
      <path d="M100 52v6M120 52v6" />
      {/* prateleira com frascos */}
      <path d="M96 100h76v4H96z" fill="var(--h-wood)" />
      <path d="M104 100V86c0-3 2-4 4-4v-4h4v4c2 0 4 1 4 4v14z" fill={C} />
      <path d="M126 100V84h12v16zM129 84v-4h6v4" fill={C} />
      <path d="M150 100V90c0-3 3-5 6-5s6 2 6 5v10z" fill={C} />
      <Window x={40} y={70} w={36} h={26} />
      <Plant x={140} y={136} s={0.6} />
      {/* tanque */}
      <path d="M36 146h52l-3 24H39z" fill={C} />
      <path d="M40 150h44" {...soft} />
      <path d="M44 170v46M80 170v46" />
      <path d="M62 146v-14c0-5 7-5 7 0" />
      {/* máquina de lavar */}
      <rect x="94" y="136" width="58" height="80" rx="3" fill={C} />
      <path d="M94 150h58" />
      <circle cx="104" cy="143" r="2.4" />
      <path d="M120 143h24" {...soft} />
      <circle cx="123" cy="182" r="18" />
      <circle cx="123" cy="182" r="12" fill="var(--h-glass)" />
      <path d="M115 186c5 3 11 3 16-2" {...soft} />
    </g>
  );
}

export function Furniture({ room }: { room: Room }) {
  switch (room) {
    case "cozinha":
      return <Kitchen />;
    case "copa":
      return <Copa />;
    case "despensa":
      return <Pantry />;
    case "servico":
      return <Service />;
  }
}

/** Telhado, paredes externas, laje, base e grama. Coordenadas da casa. */
export function HouseFrame() {
  return (
    <g>
      {/* telhado */}
      <path d="M380 22L752 124H8z" fill="var(--h-ceil)" />
      <path d="M380 22L752 124H8z" strokeWidth={1.6} />
      <path d="M380 36L716 120H44z" {...soft} />
      {[0.3, 0.55, 0.8].map((t) => {
        const half = 336 * t;
        const y = 36 + 84 * t;
        const n = Math.round((half * 2) / 18);
        const step = (half * 2) / n;
        let d = `M${380 - half} ${y}`;
        for (let i = 0; i < n; i++) d += `q${step / 2} 6 ${step} 0`;
        return <path key={t} d={d} opacity={0.22} />;
      })}
      <path d="M590 70V40h26v37" fill="var(--h-ceil)" />
      <path d="M586 40h34v-6h-34z" fill="var(--h-ceil)" />
      <circle cx="380" cy="64" r="14" fill="var(--h-glass)" />
      <circle cx="380" cy="64" r="14" />
      <path d="M380 51v26M367 64h26" {...soft} />
      <text x="380" y="110" textAnchor="middle" fontSize="30" fill="#ffffff" stroke="none" style={{ fontFamily: "var(--font-script)", letterSpacing: "0.1em" }} aria-hidden="true">
        Kaw e Than
      </text>
      {/* fumacinha da chaminé */}
      <g className="house-smoke" fill="#fdfcf9" fillOpacity={0.35} stroke="none">
        <circle cx="603" cy="28" r="5" />
        <circle cx="609" cy="16" r="6.5" />
        <circle cx="603" cy="2" r="8" />
      </g>
      {/* paredes externas e laje */}
      <path d="M24 120V646h712V120" strokeWidth={1.6} />
      <path d="M30 120V640h700V120" />
      <path d="M24 376h712v8H24z" fill="var(--h-wood)" />
      <path d="M450 120v256M520 384v256" strokeWidth={1.4} />
      {/* chão e grama */}
      <path d="M0 646H760" strokeWidth={1.6} />
      <path d="M8 660H752" opacity={0.4} />
      {[40, 120, 250, 520, 640, 720].map((x) => (
        <path key={x} d={`M${x} 646c1-5 3-8 5-9M${x + 4} 646c0-6 1-10 3-12M${x + 8} 646c0-4-1-7-3-9`} opacity={0.6} />
      ))}
      {[50, 110, 165, 230, 300, 380, 455, 520, 590, 650, 715].map((x, i) => (
        <g key={x} transform={`translate(${x} ${657 - (i % 2) * 3})`}>
          <path d="M0 6v-6" opacity={0.6} />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={2.2 * Math.cos((a * Math.PI) / 180)} cy={-2 + 2.2 * Math.sin((a * Math.PI) / 180)} r={1.7} fill="#fdfcf9" stroke="none" />
          ))}
          <circle cx={0} cy={-2} r={1.1} fill="#e2c58a" stroke="none" />
        </g>
      ))}
      <path d="M2 646c-2-14 6-24 14-22 2-8 14-10 18 0 8-2 12 8 8 22" fill="var(--h-fill)" />
      <path d="M758 646c2-14-6-24-14-22-2-8-14-10-18 0-8-2-12 8-8 22" fill="var(--h-fill)" />
    </g>
  );
}
