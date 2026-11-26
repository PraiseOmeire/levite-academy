import { z } from "zod";

/** Phone numbers: digits with optional +, spaces, dashes and brackets (e.g. +234 803 123 4567). */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number, including the country code.");

/** Turns a zod error into { fieldName: firstMessage }. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** Plain-string snapshot of submitted values so forms keep what the user typed after an error. */
export function formValues(formData: FormData, omit: string[] = []): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (typeof v === "string" && !omit.includes(k) && !k.startsWith("$")) out[k] = v;
  }
  return out;
}

/** Whole years between a YYYY-MM-DD birth date and today. */
export function ageFrom(dateOfBirth: string, today = new Date()): number {
  const dob = new Date(`${dateOfBirth}T00:00:00Z`);
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const m = today.getUTCMonth() - dob.getUTCMonth();
  if (m < 0 || (m === 0 && today.getUTCDate() < dob.getUTCDate())) age--;
  return age;
}
