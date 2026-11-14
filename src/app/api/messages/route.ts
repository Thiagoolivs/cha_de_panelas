import { handle, json, rateLimited, readJson } from "@/server/http";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (rateLimited(req, 5)) return json({ error: "rate" }, 429);
  const body = await readJson(req);
  return handle(async (s) => {
    await s.sendMessage({ authorName: body.authorName as string, text: body.text as string, relation: body.relation as string });
    return json({ ok: true });
  });
}
