"use client";

import { useState } from "react";
import { LEVEL_SELF_CHECK, plannedLessonCount, type LevelSlug } from "@/lib/domain/constants";

export type LevelOption = { slug: string; name: string; durationMonths: number; hasGenres: boolean };
export type GenreOption = { slug: string; name: string };

export const choiceCard =
  "flex cursor-pointer flex-col gap-1 rounded-xl border border-zinc-200 p-4 has-[:checked]:border-zinc-950 has-[:checked]:ring-2 has-[:checked]:ring-zinc-950/10 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 dark:border-zinc-800 dark:has-[:checked]:border-white";

export function ErrorText({ message }: { message?: string }) {
  return message ? <p className="text-sm text-red-600 dark:text-red-400">{message}</p> : null;
}

/**
 * Level radio cards plus, for intermediate/expert, the "genres you're familiar with" chips.
 * Fully controlled so choices survive a server-side validation error.
 */
export function LevelPicker({
  levels,
  genres,
  initialLevel = "",
  initialGenres = [],
  errors,
  levelHeading,
  genreHeading,
}: {
  levels: LevelOption[];
  genres: GenreOption[];
  initialLevel?: string;
  initialGenres?: string[];
  errors: { level?: string; genres?: string };
  levelHeading: string;
  genreHeading: string;
}) {
  const [levelSlug, setLevelSlug] = useState(initialLevel);
  const [picked, setPicked] = useState<string[]>(initialGenres);
  const selectedLevel = levels.find((l) => l.slug === levelSlug);

  const toggleGenre = (slug: string) =>
    setPicked((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]));

  return (
    <>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-lg font-semibold">{levelHeading}</legend>
        <div className="flex flex-col gap-3">
          {levels.map((l) => (
            <label key={l.slug} className={choiceCard}>
              <input
                type="radio"
                name="level"
                value={l.slug}
                checked={levelSlug === l.slug}
                onChange={() => setLevelSlug(l.slug)}
                className="sr-only"
              />
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium">{l.name}</span>
                <span className="text-sm text-zinc-500">{plannedLessonCount(l.durationMonths)} lessons</span>
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                This level is for you if: {LEVEL_SELF_CHECK[l.slug as LevelSlug]}
              </span>
            </label>
          ))}
        </div>
        <ErrorText message={errors.level} />
      </fieldset>

      {selectedLevel?.hasGenres && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-lg font-semibold">{genreHeading}</legend>
          <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
            Pick all that apply. This helps your instructors understand your background.
          </p>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <label
                key={g.slug}
                className="cursor-pointer rounded-full border border-zinc-300 px-4 py-1.5 text-sm has-[:checked]:border-zinc-950 has-[:checked]:bg-zinc-950 has-[:checked]:text-white dark:border-zinc-700 dark:has-[:checked]:border-white dark:has-[:checked]:bg-white dark:has-[:checked]:text-zinc-950"
              >
                <input
                  type="checkbox"
                  name="genres"
                  value={g.slug}
                  checked={picked.includes(g.slug)}
                  onChange={() => toggleGenre(g.slug)}
                  className="sr-only"
                />
                {g.name}
              </label>
            ))}
          </div>
          <ErrorText message={errors.genres} />
        </fieldset>
      )}
    </>
  );
}
