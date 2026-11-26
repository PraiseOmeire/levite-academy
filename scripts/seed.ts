/**
 * Seeds catalogue data: instruments, levels and genres.
 * Safe to run repeatedly (upserts by slug).  Run: npm run db:seed
 */
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { INSTRUMENTS, LEVELS } from "../src/lib/domain/constants";
import { genre, instrument, level } from "../src/lib/db/schema";

// Genres students can say they're familiar with (intermediate/expert only).
// The academy focuses on contemporary music; edit freely.
const GENRES = [
  "Gospel",
  "Afrobeats",
  "Pop",
  "R&B / Soul",
  "Jazz",
  "Highlife",
  "Hip-hop",
  "Rock",
  "Classical",
  "Other",
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  const db = drizzle({ client: neon(process.env.DATABASE_URL!) });

  await db
    .insert(instrument)
    .values(INSTRUMENTS.map((i, idx) => ({ slug: i.slug, name: i.name, sortOrder: idx })))
    .onConflictDoUpdate({
      target: instrument.slug,
      set: { name: sql`excluded.name`, sortOrder: sql`excluded.sort_order` },
    });

  await db
    .insert(level)
    .values(
      LEVELS.map((l, idx) => ({
        slug: l.slug,
        name: l.name,
        durationMonths: l.durationMonths,
        hasGenres: l.hasGenres,
        sortOrder: idx,
      })),
    )
    .onConflictDoUpdate({
      target: level.slug,
      set: {
        name: sql`excluded.name`,
        durationMonths: sql`excluded.duration_months`,
        hasGenres: sql`excluded.has_genres`,
        sortOrder: sql`excluded.sort_order`,
      },
    });

  await db
    .insert(genre)
    .values(GENRES.map((name, idx) => ({ slug: slugify(name), name, sortOrder: idx })))
    .onConflictDoUpdate({
      target: genre.slug,
      set: { name: sql`excluded.name`, sortOrder: sql`excluded.sort_order` },
    });

  console.log(
    `Seeded ${INSTRUMENTS.length} instruments, ${LEVELS.length} levels, ${GENRES.length} genres.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
