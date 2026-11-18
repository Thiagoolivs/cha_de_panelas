import "server-only";
import { timingSafeEqual } from "node:crypto";
import { ValidationError } from "./store";
import { getStore } from "./db";

const NO_STORE = { "Cache-Control": "no-store" };

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: NO_STORE });
}

/** Limite simples por IP para escritas (em memória, por instância). */
const hits = new Map<string, { n: number; reset: number }>();
export function rateLimited(req: Request, max = 20, windowMs = 60_000): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { n: 1, reset: now + windowMs });
    return false;
  }
  h.n += 1;
  return h.n > max;
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/** Executa com o store e traduz erros em respostas sem detalhes internos. */
export async function handle(fn: (store: ReturnType<typeof getStore>) => Promise<Response>): Promise<Response> {
  try {
    return await fn(getStore());
  } catch (e) {
    if (e instanceof ValidationError) return json({ error: "invalid", field: e.message }, 400);
    console.error("[api]", e);
    return json({ error: "server" }, 500);
  }
}

/** Confere a senha do admin (header Authorization: Bearer <ADMIN_PASSWORD>). */
export function isAdmin(req: Request): boolean {
  return hasPassword(req, process.env.ADMIN_PASSWORD);
}

/** Confere a senha do organizador (ORGANIZER_PASSWORD), diferente da senha da noiva. */
export function isOrganizer(req: Request): boolean {
  const pass = process.env.ORGANIZER_PASSWORD;
  // Nunca aceita a mesma senha da noiva: o painel dela não pode abrir o do organizador.
  if (pass && pass === process.env.ADMIN_PASSWORD) return false;
  return hasPassword(req, pass);
}

function hasPassword(req: Request, expected: string | undefined): boolean {
  if (!expected) return false;
  const got = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
