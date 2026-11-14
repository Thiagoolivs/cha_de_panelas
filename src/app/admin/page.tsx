import type { Metadata } from "next";
import { AdminPreview } from "@/components/admin/AdminPreview";

export const metadata: Metadata = { title: "Painel da Kawany", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-6 pb-24">
      <p className="hand text-[1.5rem] text-olive-700">oi, Kaw!</p>
      <h1 className="title-caps mt-1 text-[2.4rem]">Painel da noiva</h1>
      <AdminPreview />
    </main>
  );
}
