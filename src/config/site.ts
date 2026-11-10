/**
 * Configuração do evento. Valores sensíveis ou que mudam (endereço, Pix, contato)
 * vêm de variáveis NEXT_PUBLIC_* (ver .env.example). Nada disso fica nos componentes.
 */
const env = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

export const site = {
  title: "Chá dos Noivos · Kaw e Than",
  description: "Chá de panela da Kawany e do Nathan. 12 de dezembro de 2026, às 14h.",
  url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  demo: process.env.NEXT_PUBLIC_DEMO === "true",
  couple: { bride: "Kawany", groom: "Nathan", short: "Kaw e Than" },
  event: {
    /** 12/12/2026 14h em America/Sao_Paulo (UTC-3, sem horário de verão). */
    startISO: "2026-12-12T14:00:00-03:00",
    endISO: "2026-12-12T18:00:00-03:00",
    timeZone: "America/Sao_Paulo",
    dayLabel: "12",
    monthLabel: "DEZ",
    timeLabel: "às 14h",
    address: env(process.env.NEXT_PUBLIC_EVENT_ADDRESS),
  },
  pix: {
    key: env(process.env.NEXT_PUBLIC_PIX_KEY),
    holder: env(process.env.NEXT_PUBLIC_PIX_HOLDER),
    quotas: [
      { value: 50, label: "Só pra não dizer que não dei nada" },
      { value: 100, label: "Creme de cabelo para a noiva cacheada" },
      { value: 150, label: "Primeira conta de luz" },
      { value: 250, label: "Para você ganhar todas as brincadeiras" },
    ],
  },
  /** Pessoa de confiança que tira dúvidas de estilo com a noiva sem revelar quem deu. */
  styleContact: {
    name: env(process.env.NEXT_PUBLIC_STYLE_CONTACT_NAME) ?? "Ra",
    phone: env(process.env.NEXT_PUBLIC_STYLE_CONTACT_PHONE),
  },
  videoUrl: env(process.env.NEXT_PUBLIC_VIDEO_URL),
} as const;

export type SiteConfig = typeof site;
