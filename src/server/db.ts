import "server-only";
import { Pool } from "pg";
import { defaultGifts } from "@/data/gifts.default";
import { SqlGiftsStore, type Db } from "./store";

let store: SqlGiftsStore | null = null;

/** Store singleton ligado ao Postgres do Railway (DATABASE_URL). */
export function getStore(): SqlGiftsStore {
  if (store) return store;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não configurada");
  const internal = /\.railway\.internal|localhost|127\.0\.0\.1/.test(url);
  const pool = new Pool({ connectionString: url, max: 5, ssl: internal ? false : { rejectUnauthorized: false } });
  const db: Db = {
    query: (sql, params) => pool.query(sql, params as unknown[]) as never,
    async tx(fn) {
      const client = await pool.connect();
      try {
        await client.query("begin");
        const out = await fn({ query: (sql, params) => client.query(sql, params as unknown[]) as never });
        await client.query("commit");
        return out;
      } catch (e) {
        await client.query("rollback").catch(() => {});
        throw e;
      } finally {
        client.release();
      }
    },
  };
  store = new SqlGiftsStore(db, defaultGifts, process.env.DATA_RESET_KEY ?? null);
  return store;
}
