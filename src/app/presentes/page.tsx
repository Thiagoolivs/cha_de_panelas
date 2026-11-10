import type { Metadata } from "next";
import { GiftsExperience } from "@/components/gifts/GiftsExperience";

export const metadata: Metadata = { title: "Lista de presentes · Kaw e Than" };

export default function PresentesPage() {
  return (
    <main className="pt-4">
      <GiftsExperience />
    </main>
  );
}
