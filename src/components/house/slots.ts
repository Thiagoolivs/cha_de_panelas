import type { Room } from "@/lib/types";

/**
 * Âncoras nomeadas de cada cômodo, em coordenadas locais (0..w, 0..h do cômodo,
 * ver ROOM_BOXES). y é a base do objeto (ou o gancho, se hang). s é a escala do
 * ícone 100×100. z ordena o desenho (maior = mais à frente).
 */
export interface Slot {
  x: number;
  y: number;
  s: number;
  z: number;
  hang?: boolean;
  /** Direção do empilhamento quando há mais de uma unidade. */
  stack?: "side" | "behind";
}

export const SLOTS: Record<Room, Record<string, Slot>> = {
  cozinha: {
    // Fogão (bocas a y=154) e alça do forno
    "fogao-1": { x: 92, y: 154, s: 0.36, z: 3 },
    "fogao-2": { x: 124, y: 154, s: 0.32, z: 3 },
    "forno-alca": { x: 107, y: 170, s: 0.3, z: 4, hang: true, stack: "side" },
    // Bancada (tampo a y=154)
    "bancada-7": { x: 160, y: 154, s: 0.42, z: 3 },
    "bancada-4": { x: 192, y: 154, s: 0.42, z: 3 },
    "bancada-3": { x: 222, y: 154, s: 0.42, z: 3 },
    "bancada-5": { x: 252, y: 154, s: 0.4, z: 3 },
    "bancada-6": { x: 277, y: 154, s: 0.42, z: 3 },
    "bancada-2": { x: 293, y: 154, s: 0.38, z: 2, stack: "behind" },
    "bancada-1": { x: 314, y: 154, s: 0.4, z: 3 },
    pia: { x: 380, y: 154, s: 0.36, z: 3 },
    // Trilho de utensílios (gancho a y=80)
    "trilho-1": { x: 158, y: 80, s: 0.36, z: 2, hang: true },
    "trilho-2": { x: 192, y: 80, s: 0.36, z: 2, hang: true },
    "trilho-3": { x: 226, y: 80, s: 0.36, z: 2, hang: true },
    "trilho-4": { x: 260, y: 80, s: 0.36, z: 2, hang: true },
    "trilho-5": { x: 294, y: 80, s: 0.36, z: 2, hang: true },
    "trilho-6": { x: 328, y: 80, s: 0.36, z: 2, hang: true },
    "trilho-7": { x: 362, y: 80, s: 0.36, z: 2, hang: true },
    // Prateleira alta (a y=58)
    "prateleira-1": { x: 300, y: 56, s: 0.34, z: 2 },
    "prateleira-2": { x: 360, y: 56, s: 0.36, z: 2 },
    // Chão
    "chao-frente": { x: 250, y: 252, s: 0.8, z: 1 },
    "chao-canto": { x: 450, y: 236, s: 0.42, z: 5, stack: "side" },
    "livre-1": { x: 300, y: 248, s: 0.4, z: 5 },
    "livre-2": { x: 40, y: 246, s: 0.4, z: 5 },
  },
  copa: {
    // Cristaleira: prateleiras a y=94, 128, 162
    "cristaleira-1": { x: 90, y: 94, s: 0.36, z: 2, stack: "behind" },
    "cristaleira-2": { x: 132, y: 94, s: 0.34, z: 2, stack: "behind" },
    "cristaleira-3": { x: 90, y: 128, s: 0.36, z: 2 },
    "cristaleira-4": { x: 132, y: 128, s: 0.4, z: 2 },
    "cristaleira-5": { x: 90, y: 162, s: 0.36, z: 2 },
    "cristaleira-6": { x: 132, y: 162, s: 0.4, z: 2 },
    // Aparador (tampo a y=166) e parede acima
    "aparador-1": { x: 276, y: 166, s: 0.36, z: 2 },
    "aparador-2": { x: 299, y: 166, s: 0.34, z: 2 },
    "aparador-3": { x: 322, y: 166, s: 0.32, z: 2 },
    "aparador-4": { x: 347, y: 166, s: 0.32, z: 2 },
    "parede-aparador": { x: 312, y: 132, s: 0.4, z: 1 },
    // Mesa (tampo a y=196, duas fileiras)
    "mesa-base": { x: 166, y: 200, s: 0.36, z: 6 },
    "mesa-a": { x: 204, y: 200, s: 0.34, z: 6 },
    "mesa-b": { x: 252, y: 194, s: 0.3, z: 5 },
    "mesa-c": { x: 284, y: 196, s: 0.32, z: 5 },
    "mesa-d": { x: 128, y: 196, s: 0.3, z: 5 },
    "mesa-e": { x: 230, y: 200, s: 0.3, z: 6 },
    "mesa-f": { x: 146, y: 194, s: 0.32, z: 5 },
    "mesa-g": { x: 302, y: 202, s: 0.32, z: 6 },
    "livre-1": { x: 380, y: 246, s: 0.4, z: 7 },
    "livre-2": { x: 50, y: 246, s: 0.4, z: 7 },
  },
  despensa: {
    // Estante: tábuas a y=74, 122, 170
    "prateleira-1": { x: 82, y: 74, s: 0.4, z: 2 },
    "prateleira-2": { x: 140, y: 74, s: 0.42, z: 2 },
    "prateleira-4": { x: 199, y: 74, s: 0.42, z: 2 },
    "prateleira-3": { x: 84, y: 122, s: 0.42, z: 2 },
    "prateleira-5": { x: 166, y: 122, s: 0.46, z: 2 },
    "prateleira-6": { x: 92, y: 170, s: 0.44, z: 2 },
    "prateleira-7": { x: 172, y: 170, s: 0.44, z: 2, stack: "behind" },
    "livre-1": { x: 226, y: 246, s: 0.4, z: 5 },
    "livre-2": { x: 60, y: 246, s: 0.4, z: 5 },
  },
  servico: {
    "chao-canto": { x: 172, y: 232, s: 0.5, z: 3 },
    "chao-frente": { x: 52, y: 252, s: 0.52, z: 4 },
    "livre-1": { x: 120, y: 250, s: 0.4, z: 5 },
  },
};

/** Slot efetivo de um item: o pedido, se existir e estiver livre; senão o primeiro livre. */
export function resolveSlots(
  items: { giftId: string; room: Room; slot: string; iconKey: string }[],
  hasIcon: (k: string) => boolean,
): Map<string, { slot: Slot; slotName: string; iconKey: string }> {
  const out = new Map<string, { slot: Slot; slotName: string; iconKey: string }>();
  const used = new Set<string>();
  const pending: typeof items = [];
  for (const it of items) {
    const s = SLOTS[it.room]?.[it.slot];
    const key = `${it.room}/${it.slot}`;
    if (s && !used.has(key) && hasIcon(it.iconKey)) {
      used.add(key);
      out.set(it.giftId, { slot: s, slotName: it.slot, iconKey: it.iconKey });
    } else pending.push(it);
  }
  for (const it of pending) {
    const room = SLOTS[it.room] ?? {};
    const reserved = new Set(items.map((i) => `${i.room}/${i.slot}`));
    const names = Object.keys(room).sort((a, b) => Number(b.startsWith("livre")) - Number(a.startsWith("livre")));
    const free = names.find((n) => !used.has(`${it.room}/${n}`) && !reserved.has(`${it.room}/${n}`)) ?? names.find((n) => !used.has(`${it.room}/${n}`));
    if (!free) continue;
    used.add(`${it.room}/${free}`);
    out.set(it.giftId, { slot: room[free], slotName: free, iconKey: "caixa-presente" });
  }
  return out;
}
