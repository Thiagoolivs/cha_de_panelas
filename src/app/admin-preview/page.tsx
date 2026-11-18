import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { AdminPreview } from "@/components/admin/AdminPreview";

export const metadata: Metadata = { title: "Prévia do admin · Kaw e Than", robots: { index: false } };

export default function AdminPreviewPage() {
  if (!site.demo) notFound();
  return (
    <main className="mx-auto max-w-2xl px-4 pt-6 pb-24">
      <p className="eyebrow">Prévia · dados de demonstração</p>
      <h1 className="title-caps mt-1 text-[2rem]">Painel da Kawany</h1>
      <AdminPreview />
    </main>
  );
}
