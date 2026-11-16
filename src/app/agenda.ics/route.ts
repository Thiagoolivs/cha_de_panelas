import { site } from "@/config/site";
import { buildIcs } from "@/lib/ics";
import { eventPlace } from "@/lib/event";

export const dynamic = "force-static";

export function GET() {
  const body = buildIcs({
    uid: "cha-dos-noivos-kaw-than-20261212@chadosnoivos",
    title: "Chá dos Noivos · Kaw e Than",
    description: `Chá de panela da Kawany e do Nathan. Lista de presentes: ${site.url}/presentes`,
    location: eventPlace(),
    startISO: site.event.startISO,
    endISO: site.event.endISO,
    url: site.url,
  });
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cha-dos-noivos.ics"',
    },
  });
}
