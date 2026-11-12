import { Hero } from "@/components/landing/Hero";
import { RingSection } from "@/components/ring/RingSection";
import { Casar } from "@/components/landing/Casar";
import { Roteiro } from "@/components/landing/Roteiro";
import { ComoFazerParte } from "@/components/landing/ComoFazerParte";
import { Vamo } from "@/components/landing/Vamo";
import { Pix } from "@/components/landing/Pix";
import { Paleta } from "@/components/landing/Paleta";
import { Footer } from "@/components/landing/Footer";

/** O convite da Kawany, página por página, com movimento. */
export default function Home() {
  return (
    <main>
      <Hero />
      <RingSection />
      <Casar />
      <Roteiro />
      <ComoFazerParte />
      <Vamo />
      <Pix />
      <Paleta />
      <Footer />
    </main>
  );
}
