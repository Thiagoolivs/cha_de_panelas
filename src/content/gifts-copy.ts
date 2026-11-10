import type { Room, Tier } from "@/lib/types";

export const ROOM_LABEL: Record<Room, string> = {
  cozinha: "Cozinha",
  copa: "Copa",
  despensa: "Despensa",
  servico: "Área de serviço",
};

export const TIER_LABEL: Record<Tier, { title: string; short: string; note: string }> = {
  "ate-50": { title: "Kits econômicos", short: "Até R$ 50", note: "Até cerca de R$ 50. Itens mais baratos, agrupados em kits." },
  "50-150": { title: "Faixa intermediária", short: "R$ 50 a 150", note: "De cerca de R$ 50 a R$ 150." },
  eletro: { title: "Eletroportáteis", short: "Eletros", note: "Eletroportáteis acessíveis." },
  "acima-150": { title: "Presentes maiores", short: "Acima de R$ 150", note: "Acima de cerca de R$ 150." },
};

export const giftsCopy = {
  title: "Lista de presentes",
  intro: "Escolha o que quiser, quantos quiser. Cada presente ganha um lugar na nossa casa.",
  choose: "Escolher este presente",
  chosen: "Já escolhido",
  mine: "Você escolheu",
  whereToFind: "Onde encontrar",
  remaining: (n: number, total: number) => (n === 1 ? `Falta 1 de ${total}` : `Faltam ${n} de ${total}`),
  multiNote: (total: number) => `A noiva pediu ${total}. Mais de uma pessoa pode escolher.`,
  nameTitle: "Antes, seu nome",
  nameLabel: "Seu nome",
  nameHint: "Só para você ver suas escolhas depois. Os noivos não verão quem escolheu cada presente.",
  continue: "Continuar",
  confirmTitle: "Confirmar presente",
  confirm: (item: string) => ["Você vai dar ", item, ". Os noivos não vão saber que foi você."] as const,
  confirmBtn: "Confirmar",
  cancel: "Voltar",
  taken: "Alguém acabou de escolher este. Que tal outro?",
  ok: (item: string) => `${item} é seu. Já está na casa.`,
  undo: "Desfazer",
  undone: (item: string) => `Pronto, ${item} voltou para a lista.`,
  myTitle: "Meus presentes",
  myEmpty: "Você ainda não escolheu nenhum presente.",
  myHint: "Só você vê esta lista, neste aparelho.",
  styleQuestion: (name: string) =>
    `Ficou em dúvida sobre cor, tamanho ou estilo? Fale com a ${name}. Ela pergunta para a noiva sem contar quem vai dar.`,
  styleCta: (name: string) => `Falar com a ${name}`,
  styleMessage: (name: string, item: string) =>
    `Oi, ${name}! Escolhi "${item}" na lista do chá da Kaw. Pode me ajudar a saber como ela prefere?`,
  messageCta: "Quer deixar um recado para a Kawany?",
  filterAll: "Todos",
  filterLabel: "Filtrar por faixa",
};
