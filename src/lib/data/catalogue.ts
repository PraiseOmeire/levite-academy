import "server-only";
import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/lib/db";

/** Instruments, levels and genres. Rarely changes, so it's cached; call updateTag("catalogue") after edits. */
export async function getCatalogue() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const [instruments, levels, genres] = await Promise.all([
    db.select().from(schema.instrument).orderBy(asc(schema.instrument.sortOrder)),
    db.select().from(schema.level).orderBy(asc(schema.level.sortOrder)),
    db.select().from(schema.genre).orderBy(asc(schema.genre.sortOrder)),
  ]);
  return { instruments, levels, genres };
}

export type Catalogue = Awaited<ReturnType<typeof getCatalogue>>;
