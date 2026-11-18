import { Gilda_Display, Gochi_Hand, Montserrat, Waterfall } from "next/font/google";

/** Títulos: substitui a The Seasons do convite (fonte paga do Canva). */
export const display = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });

/** Assinatura "Kaw e Than": substitui a Abramo Script (usar com letter-spacing largo). */
export const script = Waterfall({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });

/** Notas manuscritas ("de panela", roteiro, etiquetas): substitui a MoreSugar Thin. */
export const hand = Gochi_Hand({ subsets: ["latin"], weight: "400", variable: "--font-hand", display: "swap" });

/** Texto corrido: a mesma do convite. */
export const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-montserrat", display: "swap" });
