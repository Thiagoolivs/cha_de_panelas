import { handle, json } from "@/server/http";

export const dynamic = "force-dynamic";

export function GET() {
  return handle(async (s) => json(await s.listGifts()));
}
