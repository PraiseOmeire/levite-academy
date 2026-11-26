/**
 * Business rules agreed with the client. See docs/ARCHITECTURE.md §1.
 * Pure data only: no I/O, safe to import anywhere.
 */

export const ACADEMY_NAME = "City Levite Music Academy";

export const INSTRUMENTS = [
  { slug: "piano", name: "Piano" },
  { slug: "guitar", name: "Guitar" },
  { slug: "saxophone", name: "Saxophone" },
  { slug: "trumpet", name: "Trumpet" },
  { slug: "violin", name: "Violin" },
] as const;

export type InstrumentSlug = (typeof INSTRUMENTS)[number]["slug"];

/** Unlocks allowed per 7-day window, per enrollment. */
export const LESSONS_PER_WEEK = 3;
export const UNLOCK_WINDOW_DAYS = 7;
const WEEKS_PER_MONTH = 4;

export const LEVELS = [
  { slug: "beginner", name: "Beginner", durationMonths: 6, hasGenres: false },
  { slug: "intermediate", name: "Intermediate", durationMonths: 3, hasGenres: true },
  { slug: "expert", name: "Expert", durationMonths: 3, hasGenres: true },
] as const;

export type LevelSlug = (typeof LEVELS)[number]["slug"];

/**
 * "This level is for you if…" self-check shown when choosing a level (instead of a placement test).
 * Generic for now; can become per-instrument once instructors write them.
 */
export const LEVEL_SELF_CHECK: Record<LevelSlug, string> = {
  beginner: "You're new to this instrument or only know a few basics.",
  intermediate:
    "You can play simple songs comfortably, know your basic scales and chords, and read or follow simple notation.",
  expert:
    "You play confidently across keys and styles, improvise, and want to refine advanced technique.",
};

/** Days after the first payment in which a student may switch level for free. */
export const FREE_LEVEL_SWITCH_DAYS = 7;

/** Planned lesson count for a level: 3/week × 4 weeks × months (72 / 36 / 36). */
export function plannedLessonCount(durationMonths: number): number {
  return LESSONS_PER_WEEK * WEEKS_PER_MONTH * durationMonths;
}

/** Share of a lesson video that must actually be watched before its assignment appears. */
export const ASSIGNMENT_WATCH_THRESHOLD = 0.5;

export const MAX_LESSON_VIDEO_MINUTES = 12;

/** Instructors promise a review within this many hours; later reviews earn bonus days. */
export const REVIEW_SLA_HOURS = 48;

/** Monthly price per enrollment, in kobo (₦5,000 test price). */
export const MONTHLY_PRICE_KOBO = 5_000 * 100;
export const CURRENCY = "NGN";

/** "₦5,000" */
export function formatNaira(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

/** "about 6 months" */
export function durationLabel(durationMonths: number): string {
  return `about ${durationMonths} month${durationMonths === 1 ? "" : "s"}`;
}

export const ROLES = ["student", "instructor", "admin"] as const;
export type Role = (typeof ROLES)[number];
