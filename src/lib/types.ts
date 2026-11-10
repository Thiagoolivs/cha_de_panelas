/** Cômodos da casinha. A ordem aqui é a ordem de exibição. */
export const ROOMS = ["cozinha", "copa", "despensa", "servico"] as const;
export type Room = (typeof ROOMS)[number];

/** Faixas de preço, como a Kawany organizou a lista. */
export const TIERS = ["ate-50", "50-150", "eletro", "acima-150"] as const;
export type Tier = (typeof TIERS)[number];

/** Categoria da reação dos personagens (define pose e frase). */
export type ReactionCategory =
  | "eletro"
  | "panelas"
  | "louca"
  | "utensilios"
  | "organizacao"
  | "limpeza";

export interface Gift {
  id: string;
  title: string;
  description: string;
  room: Room;
  /** Âncora nomeada no cômodo (ver src/components/house/slots.ts). */
  slot: string;
  iconKey: string;
  searchQuery: string;
  featuredUrl: string | null;
  image: string | null;
  order: number;
  tier: Tier;
  /** Quantas pessoas podem escolher este item. "(2)" na lista vira 2. */
  quantity: number;
  category: ReactionCategory;
  /** Frase de efeito específica (opcional). Sem ela, sorteia pela categoria. */
  phrase?: string;
}

/** Presente com o status agregado. Nunca carrega quem escolheu. */
export interface GiftView extends Gift {
  reserved: number;
  remaining: number;
}

export type ReserveResult =
  | { status: "ok"; token: string }
  | { status: "taken" };

export interface HouseItem {
  giftId: string;
  room: Room;
  slot: string;
  iconKey: string;
  /** Quantas unidades já foram escolhidas (para empilhar o desenho). */
  count: number;
}

export interface Message {
  authorName: string;
  text: string;
  relation?: string;
}

/** O que a Kawany vê. Sem nomes ligados a presentes, sem datas. */
export interface AdminSnapshot {
  gifts: {
    id: string;
    title: string;
    room: string;
    status: "disponivel" | "reservado";
    reserved: number;
    quantity: number;
  }[];
  guests: { name: string; attending: boolean }[];
  messages: { authorName: string; relation?: string; text: string }[];
}

export interface GiftsRepository {
  listGifts(): Promise<GiftView[]>;
  /** Reserva uma unidade. O token devolvido permite desfazer depois. */
  reserve(giftId: string, guestName: string): Promise<ReserveResult>;
  undo(giftId: string, token: string): Promise<void>;
  houseState(): Promise<HouseItem[]>;
  sendMessage(m: Message): Promise<void>;
  adminView(): Promise<AdminSnapshot>;
}

/** Extras usados só pelo modo demonstração. Implementação real não precisa ter. */
export interface DemoControls {
  simulateGuest(): Promise<string | null>;
  fillHouse(): Promise<void>;
  clearHouse(): Promise<void>;
}

export type DemoCapableRepository = GiftsRepository & { demo: DemoControls };

export function hasDemo(repo: GiftsRepository): repo is DemoCapableRepository {
  return typeof (repo as Partial<DemoCapableRepository>).demo === "object";
}
