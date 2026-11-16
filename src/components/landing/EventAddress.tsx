import { site } from "@/config/site";
import { copy } from "@/content/copy";
import { routeLinks } from "@/lib/links";
import { eventPlace } from "@/lib/event";

function Pin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2z" />
    </svg>
  );
}

/** Cartão com o endereço do chá e botões de rota (Google Maps e Waze). */
export function EventAddress({ className = "" }: { className?: string }) {
  const place = eventPlace();
  if (!place || !site.event.address) return null;
  const links = routeLinks(place);
  return (
    <div className={`mx-auto w-full max-w-[340px] rounded-2xl bg-white/90 px-4 pt-3 pb-4 text-center shadow-[0_6px_18px_rgba(31,28,24,0.10)] ring-1 ring-olive-700/15 ${className}`}>
      <p className="flex items-center justify-center gap-1.5 text-[0.72rem] font-medium tracking-[0.18em] text-olive-700 uppercase">
        <Pin className="h-4 w-4" />
        {copy.local.label}
      </p>
      <address className="mt-1 not-italic">
        <span className="block text-[1.05rem] leading-snug font-bold text-ink">{site.event.address}</span>
        {site.event.area && <span className="block text-[0.92rem] text-ink/70">{site.event.area}</span>}
      </address>
      <div className="mt-3 flex gap-2">
        <a href={links.google} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1 gap-1.5 !px-3">
          <Pin className="h-4 w-4" />
          {copy.local.route}
        </a>
        <a href={links.waze} target="_blank" rel="noopener noreferrer" className="btn btn-outline !px-4">
          {copy.local.waze}
        </a>
      </div>
    </div>
  );
}
