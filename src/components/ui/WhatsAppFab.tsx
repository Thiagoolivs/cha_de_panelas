"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { doubtLink } from "@/lib/contact";

/** Botão flutuante: tirar dúvidas com a Rayssa pelo WhatsApp (mensagem já escrita). */
export function WhatsAppFab() {
  const path = usePathname();
  const href = doubtLink();
  // Na abertura da página principal, dá lugar à setinha "role para baixo".
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!href || path?.startsWith("/admin") || path === "/og") return null;
  if (path === "/" && !scrolled) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-3 left-3 z-40 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#1f7a4a] px-4 text-[0.88rem] font-bold text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3c.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
      </svg>
      Dúvidas? Fale com a {site.styleContact.name}
    </a>
  );
}
