"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { Button, Field, FormError, Input, type FormState } from "@/components/ui/form";
import { login } from "../actions";

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState(login, {} as FormState);
  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <FormError message={state.message} />
      <Field label="Email address" htmlFor="email" error={e.email}>
        <Input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} required />
      </Field>
      <Field label="Password" htmlFor="password" error={e.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Logging in…" : "Log in"}
      </Button>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        New here?{" "}
        <Link href="/register" className="font-medium underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
