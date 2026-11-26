"use client";

import { useActionState } from "react";
import { Button, FormError, type FormState } from "@/components/ui/form";
import { changeEnrollmentLevel } from "../../enroll/actions";
import { LevelPicker, type GenreOption, type LevelOption } from "../../enroll/level-picker";

export function ChangeLevelForm({
  enrollmentId,
  instrumentName,
  levels,
  genres,
  currentLevel,
  currentGenres,
}: {
  enrollmentId: string;
  instrumentName: string;
  levels: LevelOption[];
  genres: GenreOption[];
  currentLevel: string;
  currentGenres: string[];
}) {
  const [state, action, pending] = useActionState(
    changeEnrollmentLevel.bind(null, enrollmentId),
    {} as FormState,
  );

  return (
    <details className="group rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <summary className="cursor-pointer list-none px-6 py-4 text-sm font-medium">
        <span className="underline">Change level</span>
        <span className="text-zinc-500"> · the instrument stays {instrumentName}</span>
      </summary>
      <form action={action} className="flex flex-col gap-6 border-t border-zinc-200 p-6 dark:border-zinc-800" noValidate>
        <FormError message={state.message} />
        <LevelPicker
          levels={levels}
          genres={genres}
          initialLevel={currentLevel}
          initialGenres={currentGenres}
          errors={state.fieldErrors ?? {}}
          levelHeading="Your level"
          genreHeading="Genres you're familiar with"
        />
        <p className="text-sm text-zinc-500">
          Want a different instrument? Each instrument is its own subscription. You can add another one
          from your dashboard after subscribing to this one.
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save level"}
        </Button>
      </form>
    </details>
  );
}
