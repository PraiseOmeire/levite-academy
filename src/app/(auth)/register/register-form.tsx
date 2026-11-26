"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Field, FormError, Input, type FormState } from "@/components/ui/form";
import { register } from "../actions";

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, {} as FormState);
  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <FormError message={state.message} />
      <Field label="Full name" htmlFor="name" error={e.name}>
        <Input id="name" name="name" autoComplete="name" defaultValue={v.name} required />
      </Field>
      <Field label="Email address" htmlFor="email" error={e.email}>
        <Input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} required />
      </Field>
      <Field
        label="WhatsApp number"
        htmlFor="whatsappNumber"
        hint="Include your country code, e.g. +234 803 123 4567"
        error={e.whatsappNumber}
      >
        <Input
          id="whatsappNumber"
          name="whatsappNumber"
          type="tel"
          autoComplete="tel"
          defaultValue={v.whatsappNumber}
          required
        />
      </Field>
      <Field label="Password" htmlFor="password" hint="At least 8 characters" error={e.password}>
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
      </Field>
      <Field label="Confirm password" htmlFor="confirmPassword" error={e.confirmPassword}>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
      </Field>
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
