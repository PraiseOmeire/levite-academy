"use client";

import { useActionState, useState } from "react";
import { Button, FormError, type FormState } from "@/components/ui/form";
import { createEnrollment } from "./actions";
import { ErrorText, LevelPicker, choiceCard, type GenreOption, type LevelOption } from "./level-picker";

type Option = { slug: string; name: string };

export function EnrollForm({
  instruments,
  levels,
  genres,
  enrolledSlugs,
}: {
  instruments: Option[];
  levels: LevelOption[];
  genres: GenreOption[];
  enrolledSlugs: string[];
}) {
  const [state, action, pending] = useActionState(createEnrollment, {} as FormState);
  const e = state.fieldErrors ?? {};
  // Controlled so the choice survives a validation error (React resets uncontrolled form fields).
  const [instrument, setInstrument] = useState("");

  return (
    <form action={action} className="flex flex-col gap-8" noValidate>
      <FormError message={state.message} />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-lg font-semibold">1. Choose your instrument</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {instruments.map((i) => {
            const taken = enrolledSlugs.includes(i.slug);
            return (
              <label key={i.slug} className={choiceCard}>
                <input
                  type="radio"
                  name="instrument"
                  value={i.slug}
                  disabled={taken}
                  checked={instrument === i.slug}
                  onChange={() => setInstrument(i.slug)}
                  className="sr-only"
                />
                <span className="font-medium">{i.name}</span>
                {taken && <span className="text-xs text-zinc-500">Already enrolled</span>}
              </label>
            );
          })}
        </div>
        <ErrorText message={e.instrument} />
      </fieldset>

      <LevelPicker
        levels={levels}
        genres={genres}
        errors={e}
        levelHeading="2. Choose your level"
        genreHeading="3. Which genres are you familiar with?"
      />

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Continue"}
        </Button>
        <p className="text-center text-sm text-zinc-500">
          You can still change your level on the next screen, before you pay.
        </p>
      </div>
    </form>
  );
}
