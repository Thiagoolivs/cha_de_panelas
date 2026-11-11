import type { Metadata } from "next";
import { AdminPreview } from "@/components/admin/AdminPreview";

export const metadata: Metadata = { title: "Painel da Kawany", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-6 pb-24">
      <p className="eyebrow">Só para a noiva</p>
      <h1 className="title-caps mt-1 text-[2rem]">Painel da Kawany</h1>
      <AdminPreview />
    </main>
  );
}
