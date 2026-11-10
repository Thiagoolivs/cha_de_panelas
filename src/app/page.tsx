import { Hero } from "@/components/landing/Hero";
import { Casar } from "@/components/landing/Casar";
import { Roteiro } from "@/components/landing/Roteiro";
import { ComoFazerParte } from "@/components/landing/ComoFazerParte";
import { Pix } from "@/components/landing/Pix";
import { Footer } from "@/components/landing/Footer";
import { copy } from "@/content/copy";
import { Sprig } from "@/components/ornaments/Utensils";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Hero />
      <Sprig className="mx-auto w-32" />
      <Casar />
      <Roteiro />
      <ComoFazerParte />
      <div className="flex flex-col items-center gap-3 px-4 pb-6">
        <Link href="/presentes" className="btn btn-primary w-full max-w-[300px]">
          {copy.hero.ctaGifts}
        </Link>
        <a href="/agenda.ics" className="btn btn-outline w-full max-w-[300px]" download>
          {copy.agenda.button}
        </a>
      </div>
      <Sprig className="mx-auto mt-8 w-32" />
      <Pix />
      <Footer />
    </main>
  );
}
