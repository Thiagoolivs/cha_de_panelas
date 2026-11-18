import type { Metadata } from "next";
import { OrganizerPanel } from "@/components/admin/OrganizerPanel";

export const metadata: Metadata = { title: "Organização", robots: { index: false, follow: false } };

export default function OrganizerPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-6 pb-24">
      <p className="hand text-[1.5rem] text-olive-700">só para a organização</p>
      <h1 className="title-caps mt-1 text-[2.4rem]">Quem deu o quê</h1>
      <OrganizerPanel />
    </main>
  );
}
