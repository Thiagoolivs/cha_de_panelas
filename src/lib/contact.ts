import { site } from "@/config/site";

/** Mensagem pré-programada para a pessoa que tira dúvidas de estilo com a noiva. */
export function doubtMessage(item?: string): string {
  const name = site.styleContact.name;
  return item
    ? `Oi, ${name}! Vi a lista do chá da Kaw e do Than e fiquei com uma dúvida sobre "${item}". Como a noiva prefere (cor, tamanho, modelo)?`
    : `Oi, ${name}! Vi a lista do chá da Kaw e do Than e fiquei com uma dúvida sobre um presente.`;
}

/** Link do WhatsApp com a mensagem pronta, ou null se o número não estiver configurado. */
export function doubtLink(item?: string): string | null {
  const phone = site.styleContact.phone?.replace(/\D/g, "");
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(doubtMessage(item))}`;
}
