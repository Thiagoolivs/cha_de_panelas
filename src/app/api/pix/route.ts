import { handle, json, rateLimited, readJson } from "@/server/http";

export const dynamic = "force-dynamic";

/** Marca um Pix anônimo: recebe só o valor. Nenhum nome é enviado nem guardado. */
export async function POST(req: Request) {
  if (rateLimited(req, 8)) return json({ error: "rate" }, 429);
  const body = await readJson(req);
  return handle(async (s) => json(await s.contribute(body.amount)));
}
