import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Small pool on purpose: serverless Postgres poolers (Neon / Supabase) cap
// client connections, and `next build` opens one pool per worker.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 15_000,
});

export const db = drizzle(pool, { schema });
