/**
 * Regras de negócio sobre o banco (Postgres). Independe do driver: em produção usa
 * `pg` (ver db.ts); nos testes, PGlite. Nada aqui devolve quem escolheu cada presente.
 */
import { createHash, randomBytes } from "node:crypto";
import type { AdminSnapshot, Gift, GiftView, HouseItem, Message, ReserveResult } from "@/lib/types";

export interface Queryable {
  query<R = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: R[] }>;
}

export interface Db extends Queryable {
  tx<T>(fn: (q: Queryable) => Promise<T>): Promise<T>;
}

export const SCHEMA = `
create table if not exists reservations (
  id bigserial primary key,
  gift_id text not null,
  guest_name text not null,
  token_hash text not null unique,
  created_at timestamptz not null default now()
);
create index if not exists reservations_gift_idx on reservations (gift_id);
create table if not exists app_meta (
  key text primary key,
  value text not null
);
create table if not exists messages (
  id bigserial primary key,
  author_name text not null,
  relation text,
  body text not null,
  created_at timestamptz not null default now()
);
`;

export const LIMITS = { nameMin: 2, nameMax: 60, textMin: 20, textMax: 1000, relationMax: 80 } as const;

export class ValidationError extends Error {}

const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function cleanName(raw: unknown): string {
  const n = String(raw ?? "").replace(/\s+/g, " ").trim();
  if (n.length < LIMITS.nameMin || n.length > LIMITS.nameMax) throw new ValidationError("nome");
  return n;
}

export class SqlGiftsStore {
  private ready: Promise<void> | null = null;

  constructor(
    private readonly db: Db,
    private readonly gifts: Gift[],
    /** Se definido e diferente do último aplicado, zera reservas e recados uma única vez. */
    private readonly resetKey: string | null = null,
  ) {}

  private ensure() {
    this.ready ??= this.db.query(SCHEMA).then(() => this.applyReset());
    return this.ready;
  }

  /** Limpeza única (ex.: apagar os testes antes de enviar o convite). Idempotente por chave. */
  private async applyReset() {
    const key = this.resetKey?.trim();
    if (!key) return;
    await this.db.tx(async (q) => {
      await q.query("select pg_advisory_xact_lock($1)", [hash32("app:reset")]);
      const { rows } = await q.query<{ value: string }>("select value from app_meta where key = 'last_reset'");
      if (rows[0]?.value === key) return;
      await q.query("delete from reservations");
      await q.query("delete from messages");
      await q.query(
        "insert into app_meta (key, value) values ('last_reset', $1) on conflict (key) do update set value = excluded.value",
        [key],
      );
      console.log("[store] dados zerados (chave", key + ")");
    });
  }

  private gift(id: string) {
    return this.gifts.find((g) => g.id === id);
  }

  private async counts(q: Queryable = this.db): Promise<Map<string, number>> {
    const { rows } = await q.query<{ gift_id: string; n: string | number }>(
      "select gift_id, count(*) as n from reservations group by gift_id",
    );
    return new Map(rows.map((r) => [r.gift_id, Number(r.n)]));
  }

  async listGifts(): Promise<GiftView[]> {
    await this.ensure();
    const counts = await this.counts();
    return [...this.gifts]
      .sort((a, b) => a.order - b.order)
      .map((g) => {
        const reserved = Math.min(counts.get(g.id) ?? 0, g.quantity);
        return { ...g, reserved, remaining: g.quantity - reserved };
      });
  }

  async houseState(): Promise<HouseItem[]> {
    await this.ensure();
    const counts = await this.counts();
    return this.gifts
      .filter((g) => (counts.get(g.id) ?? 0) > 0)
      .map((g) => ({ giftId: g.id, room: g.room, slot: g.slot, iconKey: g.iconKey, count: Math.min(counts.get(g.id) ?? 0, g.quantity) }));
  }

  /** Reserva atômica: trava por presente (advisory lock) e confere a quantidade. */
  async reserve(giftId: string, guestName: unknown): Promise<ReserveResult> {
    await this.ensure();
    const gift = this.gift(giftId);
    if (!gift) throw new ValidationError("presente");
    const name = cleanName(guestName);
    const token = randomBytes(18).toString("base64url");
    return this.db.tx(async (q) => {
      await q.query("select pg_advisory_xact_lock($1)", [hash32(`gift:${giftId}`)]);
      const { rows } = await q.query<{ n: string | number }>("select count(*) as n from reservations where gift_id = $1", [giftId]);
      if (Number(rows[0]?.n ?? 0) >= gift.quantity) return { status: "taken" } as const;
      await q.query("insert into reservations (gift_id, guest_name, token_hash) values ($1, $2, $3)", [giftId, name, hashToken(token)]);
      return { status: "ok", token } as const;
    });
  }

  async undo(giftId: string, token: unknown): Promise<boolean> {
    await this.ensure();
    if (typeof token !== "string" || !token) return false;
    const { rows } = await this.db.query<{ id: string }>(
      "delete from reservations where gift_id = $1 and token_hash = $2 returning id",
      [giftId, hashToken(token)],
    );
    return rows.length > 0;
  }

  async sendMessage(m: Partial<Message>): Promise<void> {
    await this.ensure();
    const author = cleanName(m.authorName);
    const text = String(m.text ?? "").trim();
    if (text.length < LIMITS.textMin || text.length > LIMITS.textMax) throw new ValidationError("texto");
    const relation = String(m.relation ?? "").trim().slice(0, LIMITS.relationMax) || null;
    await this.db.query("insert into messages (author_name, relation, body) values ($1, $2, $3)", [author, relation, text]);
  }

  /** Visão da noiva: o que vai ganhar, nunca quem deu. Sem datas, sem ligação nome↔presente. */
  async adminView(): Promise<AdminSnapshot> {
    await this.ensure();
    const counts = await this.counts();
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

    const { rows: names } = await this.db.query<{ name: string }>(
      `select distinct on (lower(name)) name from (
         select guest_name as name from reservations
         union all select author_name as name from messages
       ) t order by lower(name), name`,
    );
    const guests = names
      .map((r) => ({ name: r.name, attending: true }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    const { rows: msgs } = await this.db.query<{ author_name: string; relation: string | null; body: string }>(
      "select author_name, relation, body from messages",
    );
    const messages = msgs
      .map((m) => ({ authorName: m.author_name, text: m.body, ...(m.relation ? { relation: m.relation } : {}) }))
      .sort((a, b) => hash32(a.authorName + a.text) - hash32(b.authorName + b.text));

    return { gifts, guests, messages };
  }
}
