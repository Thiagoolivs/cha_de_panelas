import type { AdminSnapshot, GiftView, GiftsRepository, HouseItem, Message, OrganizerSnapshot, ReserveResult } from "@/lib/types";

export const ADMIN_KEY = "chadosnoivos:admin-password";
export const ORGANIZER_KEY = "chadosnoivos:organizer-password";

function sessionPass(key: string): string {
  try {
    return sessionStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

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
    return call<AdminSnapshot>("/api/admin", { headers: { Authorization: `Bearer ${sessionPass(ADMIN_KEY)}` } });
  }
  contribute(amount: number) {
    return post<{ token: string }>("/api/pix", { amount });
  }
  async undoContribution(token: string) {
    await post("/api/pix/undo", { token });
  }
  organizerView() {
    return call<OrganizerSnapshot>("/api/organizador", { headers: { Authorization: `Bearer ${sessionPass(ORGANIZER_KEY)}` } });
  }
}
