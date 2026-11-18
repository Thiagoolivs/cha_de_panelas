/** Armazenamento chave-valor tolerante a falhas (modo privado, cookies bloqueados, SSR). */
export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

export function browserStore(): KeyValueStore {
  const mem = new Map<string, string>();
  return {
    get(key) {
      try {
        const v = window.localStorage.getItem(key);
        if (v !== null) return v;
      } catch {
        /* sem localStorage: segue em memória */
      }
      return mem.get(key) ?? null;
    },
    set(key, value) {
      mem.set(key, value);
      try {
        window.localStorage.setItem(key, value);
      } catch {
        /* ignora */
      }
    },
  };
}

export function memoryStore(): KeyValueStore {
  const mem = new Map<string, string>();
  return { get: (k) => mem.get(k) ?? null, set: (k, v) => void mem.set(k, v) };
}
