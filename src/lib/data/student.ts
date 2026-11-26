import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";

/**
 * Per-student reads. Callers must pass the id of the *signed-in* user
 * (from requireUser()), never an id taken from the URL or a form.
 */

export async function getProfile(userId: string) {
  const [row] = await db
    .select()
    .from(schema.profile)
    .where(eq(schema.profile.userId, userId))
    .limit(1);
  return row ?? null;
}

export async function getEnrollments(userId: string) {
  return enrollmentQuery()
    .where(eq(schema.enrollment.userId, userId))
    .orderBy(asc(schema.enrollment.createdAt));
}

/** One enrollment, only if it belongs to this user (null otherwise, including malformed ids). */
export async function getEnrollmentForUser(userId: string, enrollmentId: string) {
  if (!z.uuid().safeParse(enrollmentId).success) return null;
  const [row] = await enrollmentQuery()
    .where(and(eq(schema.enrollment.id, enrollmentId), eq(schema.enrollment.userId, userId)))
    .limit(1);
  return row ?? null;
}

/** Genre slugs picked for an enrollment. Pass an enrollment already checked with getEnrollmentForUser. */
export async function getEnrollmentGenreSlugs(enrollmentId: string) {
  const rows = await db
    .select({ slug: schema.genre.slug })
    .from(schema.enrollmentGenre)
    .innerJoin(schema.genre, eq(schema.enrollmentGenre.genreId, schema.genre.id))
    .where(eq(schema.enrollmentGenre.enrollmentId, enrollmentId));
  return rows.map((r) => r.slug);
}

function enrollmentQuery() {
  return db
    .select({
      id: schema.enrollment.id,
      status: schema.enrollment.status,
      createdAt: schema.enrollment.createdAt,
      instrument: { slug: schema.instrument.slug, name: schema.instrument.name },
      level: {
        slug: schema.level.slug,
        name: schema.level.name,
        durationMonths: schema.level.durationMonths,
      },
    })
    .from(schema.enrollment)
    .innerJoin(schema.instrument, eq(schema.enrollment.instrumentId, schema.instrument.id))
    .innerJoin(schema.level, eq(schema.enrollment.levelId, schema.level.id))
    .$dynamic();
}
