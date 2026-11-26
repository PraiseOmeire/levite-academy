"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/ui/form";
import { requireUser } from "@/lib/auth/session";
import { getCatalogue } from "@/lib/data/catalogue";
import { getEnrollmentForUser, getEnrollments, getProfile } from "@/lib/data/student";
import { db, schema } from "@/lib/db";

/** Snapshot of what was picked, so the form can redisplay it after an error. */
function pickedValues(formData: FormData) {
  return {
    instrument: String(formData.get("instrument") ?? ""),
    level: String(formData.get("level") ?? ""),
    genres: formData.getAll("genres").map(String).join(","),
  };
}

/** Validates level + genres against the catalogue. Genres only apply to intermediate/expert. */
async function resolveLevelAndGenres(formData: FormData) {
  const { levels, genres } = await getCatalogue();
  const level = levels.find((l) => l.slug === formData.get("level"));
  if (!level) return { error: { level: "Choose your level." } } as const;

  const picked = formData.getAll("genres").map(String);
  const genreIds = level.hasGenres
    ? genres.filter((g) => picked.includes(g.slug)).map((g) => g.id)
    : [];
  if (level.hasGenres && genreIds.length === 0) {
    return { error: { genres: "Pick at least one genre you're familiar with." } } as const;
  }
  return { level, genreIds } as const;
}

export async function createEnrollment(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  if (!(await getProfile(user.id))) redirect("/onboarding");

  // One unpaid instrument at a time: finish (pay for) that one first.
  const pending = (await getEnrollments(user.id)).find((e) => e.status === "pending_payment");
  if (pending) redirect(`/subscribe/${pending.id}`);

  const values = pickedValues(formData);
  const fieldErrors: Record<string, string> = {};

  const { instruments } = await getCatalogue();
  const instrument = instruments.find((i) => i.slug === formData.get("instrument"));
  if (!instrument) fieldErrors.instrument = "Choose an instrument.";

  const resolved = await resolveLevelAndGenres(formData);
  if ("error" in resolved) Object.assign(fieldErrors, resolved.error);

  if (!instrument || "error" in resolved) return { fieldErrors, values };
  const { level, genreIds } = resolved;

  const existing = await db
    .select({ id: schema.enrollment.id })
    .from(schema.enrollment)
    .where(and(eq(schema.enrollment.userId, user.id), eq(schema.enrollment.instrumentId, instrument.id)))
    .limit(1);
  if (existing.length > 0) {
    return { fieldErrors: { instrument: `You're already enrolled in ${instrument.name}.` }, values };
  }

  const enrollmentId = crypto.randomUUID();
  const insertEnrollment = db.insert(schema.enrollment).values({
    id: enrollmentId,
    userId: user.id,
    instrumentId: instrument.id,
    levelId: level.id,
  });
  // Neon HTTP: batch runs both inserts in one transaction.
  if (genreIds.length > 0) {
    await db.batch([
      insertEnrollment,
      db.insert(schema.enrollmentGenre).values(genreIds.map((genreId) => ({ enrollmentId, genreId }))),
    ]);
  } else {
    await insertEnrollment;
  }

  redirect(`/subscribe/${enrollmentId}`);
}

/**
 * Change level (and genres) of an enrollment that hasn't been paid for yet.
 * The instrument can't be changed: a different instrument is a separate subscription.
 * (After payment, the free 7-day level switch arrives in phase 4.)
 */
export async function changeEnrollmentLevel(
  enrollmentId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const enrollment = await getEnrollmentForUser(user.id, enrollmentId);
  if (!enrollment) redirect("/dashboard");
  if (enrollment.status !== "pending_payment") {
    return { message: "Your level can't be changed here once you've subscribed." };
  }

  const values = pickedValues(formData);
  const resolved = await resolveLevelAndGenres(formData);
  if ("error" in resolved) return { fieldErrors: resolved.error, values };
  const { level, genreIds } = resolved;

  await db.batch([
    db
      .update(schema.enrollment)
      .set({ levelId: level.id })
      .where(and(eq(schema.enrollment.id, enrollmentId), eq(schema.enrollment.userId, user.id))),
    db.delete(schema.enrollmentGenre).where(eq(schema.enrollmentGenre.enrollmentId, enrollmentId)),
    ...(genreIds.length > 0
      ? [db.insert(schema.enrollmentGenre).values(genreIds.map((genreId) => ({ enrollmentId, genreId })))]
      : []),
  ]);

  redirect(`/subscribe/${enrollmentId}`);
}
