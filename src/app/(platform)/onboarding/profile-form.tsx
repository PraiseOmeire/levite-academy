"use client";

import { useActionState, useState } from "react";
import { Button, Field, FormError, Input, type FormState } from "@/components/ui/form";
import { ageFrom } from "@/lib/validation";
import { saveProfile } from "./actions";

const COMMON_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Canada",
  "Ireland",
  "Germany",
  "United Arab Emirates",
];

export function ProfileForm() {
  const [state, action, pending] = useActionState(saveProfile, {} as FormState);
  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};
  const [dob, setDob] = useState(v.dateOfBirth ?? "");
  const isMinor = dob !== "" && ageFrom(dob) < 18;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormError message={state.message} />

      <Field label="Date of birth" htmlFor="dateOfBirth" error={e.dateOfBirth}>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          max={today}
          value={dob}
          onChange={(ev) => setDob(ev.target.value)}
          required
        />
      </Field>

      <Field label="Country" htmlFor="country" error={e.country}>
        <Input
          id="country"
          name="country"
          list="countries"
          autoComplete="country-name"
          defaultValue={v.country ?? "Nigeria"}
          required
        />
        <datalist id="countries">
          {COMMON_COUNTRIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </Field>

      {isMinor && (
        <fieldset className="flex flex-col gap-4 rounded-xl border border-amber-300 p-4 dark:border-amber-800">
          <legend className="px-1 text-sm font-semibold">Parent or guardian</legend>
          <p className="text-sm text-amber-900 dark:text-amber-200">
            Because you&apos;re under 18, we need a parent or guardian&apos;s agreement.
          </p>
          <Field label="Parent or guardian's email" htmlFor="guardianEmail" error={e.guardianEmail}>
            <Input id="guardianEmail" name="guardianEmail" type="email" defaultValue={v.guardianEmail} required />
          </Field>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="guardianConsent"
                defaultChecked={v.guardianConsent === "on"}
                className="mt-1"
              />
              <span>My parent or guardian agrees to me studying at the academy.</span>
            </label>
            {e.guardianConsent && (
              <p className="text-sm text-red-600 dark:text-red-400">{e.guardianConsent}</p>
            )}
          </div>
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <legend className="px-1 text-sm font-semibold">
          Next of kin <span className="font-normal text-zinc-500">(optional)</span>
        </legend>
        <Field label="Full name" htmlFor="nextOfKinName" error={e.nextOfKinName}>
          <Input id="nextOfKinName" name="nextOfKinName" defaultValue={v.nextOfKinName} />
        </Field>
        <Field
          label="Relationship"
          htmlFor="nextOfKinRelationship"
          hint="e.g. Mother, Father, Spouse, Sibling"
          error={e.nextOfKinRelationship}
        >
          <Input id="nextOfKinRelationship" name="nextOfKinRelationship" defaultValue={v.nextOfKinRelationship} />
        </Field>
        <Field
          label="Phone number"
          htmlFor="nextOfKinPhone"
          hint="Include the country code"
          error={e.nextOfKinPhone}
        >
          <Input id="nextOfKinPhone" name="nextOfKinPhone" type="tel" defaultValue={v.nextOfKinPhone} />
        </Field>
      </fieldset>

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Saving…" : "Continue"}
      </Button>
    </form>
  );
}
