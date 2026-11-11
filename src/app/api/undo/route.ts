import { handle, json, rateLimited, readJson } from "@/server/http";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (rateLimited(req)) return json({ error: "rate" }, 429);
  const body = await readJson(req);
  return handle(async (s) => json({ ok: await s.undo(String(body.giftId ?? ""), body.token) }));
}
