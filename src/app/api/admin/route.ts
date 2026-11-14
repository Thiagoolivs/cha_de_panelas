import { handle, isAdmin, json, rateLimited } from "@/server/http";

export const dynamic = "force-dynamic";

/** Painel da noiva. Exige ADMIN_PASSWORD; sem ela configurada, não existe. */
export function GET(req: Request) {
  if (!process.env.ADMIN_PASSWORD) return json({ error: "not-found" }, 404);
  if (rateLimited(req, 10)) return json({ error: "rate" }, 429);
  if (!isAdmin(req)) return json({ error: "unauthorized" }, 401);
  return handle(async (s) => json(await s.adminView()));
}
