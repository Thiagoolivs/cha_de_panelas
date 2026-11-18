import { handle, isOrganizer, json, rateLimited } from "@/server/http";

export const dynamic = "force-dynamic";

/** Painel do organizador (nome ↔ presente). Exige ORGANIZER_PASSWORD; sem ela, não existe. */
export function GET(req: Request) {
  if (!process.env.ORGANIZER_PASSWORD) return json({ error: "not-found" }, 404);
  if (rateLimited(req, 10)) return json({ error: "rate" }, 429);
  if (!isOrganizer(req)) return json({ error: "unauthorized" }, 401);
  return handle(async (s) => json(await s.organizerView()));
}
