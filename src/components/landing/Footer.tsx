import Link from "next/link";
import { site } from "@/config/site";
import { copy } from "@/content/copy";
import { BorderLine } from "@/components/ornaments/BorderLine";
import { EventAddress } from "./EventAddress";

export function Footer() {
  return (
    <footer className="px-4 pt-4 pb-10 text-center">
      <EventAddress className="mb-5" />
      <div className="flex flex-col items-center gap-2">
        <a href="/agenda.ics" className="btn btn-outline w-full max-w-[300px]" download>
          {copy.agenda.button}
        </a>
        <Link href="/recado" className="btn btn-ghost">
          {copy.hero.ctaMessage}
        </Link>
      </div>
      <p className="script mt-8 text-[3rem] text-ink" aria-label={site.couple.short}>
        {copy.footer}
      </p>
      <BorderLine className="mt-4" inView />
    </footer>
  );
}
