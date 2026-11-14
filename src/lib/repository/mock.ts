import type {
  AdminSnapshot,
  DemoCapableRepository,
  Gift,
  GiftView,
  HouseItem,
  Message,
  ReserveResult,
} from "@/lib/types";
import type { KeyValueStore } from "./storage";

const KEY = "chadosnoivos:mock:v1";

interface Reservation {
  token: string;
  giftId: string;
  guestName: string;
}

interface State {
  reservations: Reservation[];
  messages: Message[];
}

const FAKE_NAMES = [
  "Tia Lúcia", "Rafaela", "Bruno", "Dona Cida", "Marcos", "Júlia", "Pedro Henrique",
  "Carol", "Seu Antônio", "Bia", "Fernanda", "Gustavo", "Larissa", "Paulo", "Renata",
  "Thiago", "Vó Zezé", "Camila", "Diego", "Letícia",
];

/** Convidados e recados de exemplo, só para a prévia do admin não nascer vazia. */
const SAMPLE_GUESTS = [
  { name: "Amanda", attending: true },
  { name: "Caio", attending: false },
  { name: "Helena", attending: true },
  { name: "Marina", attending: false },
];
const SAMPLE_MESSAGES: Message[] = [
  { authorName: "Helena", relation: "Amiga da faculdade", text: "Kaw, que esse lar seja leve, cheio de café e de risada. Amo vocês dois." },
  { authorName: "Tia Lúcia", relation: "Família", text: "Minha menina vai casar. Que Deus abençoe essa casa e tudo o que vier dentro dela." },
  { authorName: "Caio", text: "Não vou poder ir, mas mandei meu presente. Than, cuida bem dela (e da air fryer)." },
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function token(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export class MockGiftsRepository implements DemoCapableRepository {
  constructor(
    private readonly gifts: Gift[],
    private readonly store: KeyValueStore,
    private readonly latencyMs = 0,
  ) {}

  private load(): State {
    try {
      const raw = this.store.get(KEY);
      if (raw) {
        const s = JSON.parse(raw) as State;
        if (Array.isArray(s.reservations) && Array.isArray(s.messages)) return s;
      }
    } catch {
      /* estado corrompido: recomeça */
    }
    return { reservations: [], messages: [] };
  }

  private save(s: State) {
    this.store.set(KEY, JSON.stringify(s));
  }

  private async wait() {
    if (this.latencyMs > 0) await new Promise((r) => setTimeout(r, this.latencyMs));
  }

  private counts(s: State): Map<string, number> {
    const m = new Map<string, number>();
    for (const r of s.reservations) m.set(r.giftId, (m.get(r.giftId) ?? 0) + 1);
    return m;
  }

  async listGifts(): Promise<GiftView[]> {
    await this.wait();
    const counts = this.counts(this.load());
    return [...this.gifts]
      .sort((a, b) => a.order - b.order)
      .map((g) => {
        const reserved = Math.min(counts.get(g.id) ?? 0, g.quantity);
        return { ...g, reserved, remaining: g.quantity - reserved };
      });
  }

  async reserve(giftId: string, guestName: string): Promise<ReserveResult> {
    await this.wait();
    const gift = this.gifts.find((g) => g.id === giftId);
    if (!gift) return { status: "taken" };
    const s = this.load();
    const name = guestName.trim();
    const used = this.counts(s).get(giftId) ?? 0;
    if (used >= gift.quantity) return { status: "taken" };
    const t = token();
    s.reservations.push({ token: t, giftId, guestName: name });
    this.save(s);
    return { status: "ok", token: t };
  }

  async undo(giftId: string, tokenToUndo: string): Promise<void> {
    await this.wait();
    const s = this.load();
    s.reservations = s.reservations.filter((r) => !(r.giftId === giftId && r.token === tokenToUndo));
    this.save(s);
  }

  async houseState(): Promise<HouseItem[]> {
    await this.wait();
    const counts = this.counts(this.load());
    return this.gifts
      .filter((g) => (counts.get(g.id) ?? 0) > 0)
      .map((g) => ({
        giftId: g.id,
        room: g.room,
        slot: g.slot,
        iconKey: g.iconKey,
        count: Math.min(counts.get(g.id) ?? 0, g.quantity),
      }));
  }

  async sendMessage(m: Message): Promise<void> {
    await this.wait();
    const s = this.load();
    s.messages.push({
      authorName: m.authorName.trim(),
      text: m.text.trim(),
      ...(m.relation?.trim() ? { relation: m.relation.trim() } : {}),
    });
    this.save(s);
  }

  async adminView(): Promise<AdminSnapshot> {
    await this.wait();
    const s = this.load();
    const counts = this.counts(s);

    const gifts = [...this.gifts]
      .sort((a, b) => a.order - b.order)
      .map((g) => {
        const reserved = Math.min(counts.get(g.id) ?? 0, g.quantity);
        return {
          id: g.id,
          title: g.title,
          room: g.room,
          status: reserved >= g.quantity ? ("reservado" as const) : ("disponivel" as const),
          reserved,
          quantity: g.quantity,
        };
      });

    // Convidados: quem participou (sem dizer de quê) + exemplos. Só nome e presença.
    const byName = new Map<string, { name: string; attending: boolean }>();
    for (const g of SAMPLE_GUESTS) byName.set(g.name.toLocaleLowerCase("pt-BR"), { ...g });
    for (const r of s.reservations) byName.set(r.guestName.toLocaleLowerCase("pt-BR"), { name: r.guestName, attending: true });
    for (const m of s.messages) {
      const k = m.authorName.toLocaleLowerCase("pt-BR");
      if (!byName.has(k)) byName.set(k, { name: m.authorName, attending: true });
    }
    const guests = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    // Recados: ordem embaralhada estável (hash do conteúdo), sem ordem de chegada.
    const messages = [...SAMPLE_MESSAGES, ...s.messages]
      .map((m) => ({ authorName: m.authorName, text: m.text, ...(m.relation ? { relation: m.relation } : {}) }))
      .sort((a, b) => hash(a.authorName + a.text) - hash(b.authorName + b.text));

    return { gifts, guests, messages };
  }

  readonly demo = {
    simulateGuest: async (): Promise<string | null> => {
      const free = (await this.listGifts()).filter((g) => g.remaining > 0);
      if (!free.length) return null;
      const gift = free[Math.floor(Math.random() * free.length)];
      const name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)] + " " + Math.floor(Math.random() * 90 + 10);
      const r = await this.reserve(gift.id, name);
      return r.status === "ok" ? gift.id : null;
    },
    fillHouse: async (): Promise<void> => {
      const s = this.load();
      const counts = this.counts(s);
      let i = 0;
      for (const g of this.gifts) {
        for (let n = counts.get(g.id) ?? 0; n < g.quantity; n++) {
          s.reservations.push({ token: token(), giftId: g.id, guestName: FAKE_NAMES[i++ % FAKE_NAMES.length] });
        }
      }
      this.save(s);
    },
    clearHouse: async (): Promise<void> => {
      const s = this.load();
      s.reservations = [];
      this.save(s);
    },
  };
}
