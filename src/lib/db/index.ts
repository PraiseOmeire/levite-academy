import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set. Add it to .env.local.");

/**
 * Neon over HTTP: no connection pool to manage on serverless.
 * It has no interactive transactions; use `db.batch([...])` for atomic multi-statement writes.
 */
export const db = drizzle({ client: neon(url), schema });
export { schema };
