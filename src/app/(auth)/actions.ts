"use server";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/ui/form";
import { auth } from "@/lib/auth";
import { fieldErrorsFrom, formValues, phoneSchema } from "@/lib/validation";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name."),
    email: z.email("Enter a valid email address.").trim().toLowerCase(),
    whatsappNumber: phoneSchema,
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["password", "confirmPassword"]);
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), values };

  const { name, email, whatsappNumber, password } = parsed.data;
  try {
    await auth.api.signUpEmail({
      body: { name, email, password, whatsappNumber },
      headers: await headers(),
    });
  } catch (error) {
    if (isAPIError(error) && String(error.body?.code ?? "").startsWith("USER_ALREADY_EXISTS")) {
      return { fieldErrors: { email: "An account with this email already exists. Log in instead." }, values };
    }
    console.error("register failed", error);
    return { message: "We couldn't create your account. Please try again.", values };
  }
  redirect("/onboarding");
}

const loginSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Enter your password."),
  next: z.string().optional(),
});

/** Only allow redirects back into this site. */
function safeNext(next: string | undefined) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["password"]);
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), values };

  const { email, password, next } = parsed.data;
  try {
    await auth.api.signInEmail({ body: { email, password }, headers: await headers() });
  } catch (error) {
    if (isAPIError(error)) {
      return { message: "Incorrect email or password.", values };
    }
    console.error("login failed", error);
    return { message: "We couldn't log you in. Please try again.", values };
  }
  redirect(safeNext(next));
}

export async function logout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
