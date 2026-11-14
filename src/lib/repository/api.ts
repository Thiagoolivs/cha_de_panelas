import type { AdminSnapshot, GiftView, GiftsRepository, HouseItem, Message, ReserveResult } from "@/lib/types";

export const ADMIN_KEY = "chadosnoivos:admin-password";

export class UnauthorizedError extends Error {}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { cache: "no-store", ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  if (res.status === 401) throw new UnauthorizedError("unauthorized");
  if (!res.ok) throw new Error(`api ${path} ${res.status}`);
  return (await res.json()) as T;
}

const post = <T>(path: string, body: unknown) => call<T>(path, { method: "POST", body: JSON.stringify(body) });

/** Repositório real: rotas /api do próprio site, com Postgres por trás. */
export class ApiGiftsRepository implements GiftsRepository {
  listGifts() {
    return call<GiftView[]>("/api/gifts");
  }
  reserve(giftId: string, guestName: string) {
    return post<ReserveResult>("/api/reserve", { giftId, guestName });
  }
  async undo(giftId: string, token: string) {
    await post("/api/undo", { giftId, token });
  }
  houseState() {
    return call<HouseItem[]>("/api/house");
  }
  async sendMessage(m: Message) {
    await post("/api/messages", m);
  }
  adminView() {
    let pass = "";
    try {
      pass = sessionStorage.getItem(ADMIN_KEY) ?? "";
    } catch {
      /* sem sessionStorage */
    }
    return call<AdminSnapshot>("/api/admin", { headers: { Authorization: `Bearer ${pass}` } });
  }
}
