"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/ui/form";
import { requireUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { ageFrom, fieldErrorsFrom, formValues, phoneSchema } from "@/lib/validation";

/** Optional text: blank becomes null. */
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null));

const profileSchema = z
  .object({
    dateOfBirth: z.iso.date("Enter your date of birth."),
    country: z.string().trim().min(2, "Enter your country."),
    // Next of kin is optional; the phone is only checked when one is given.
    nextOfKinName: optionalText,
    nextOfKinRelationship: optionalText,
    nextOfKinPhone: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : null))
      .pipe(phoneSchema.nullable()),
    guardianEmail: z.string().trim().optional(),
    guardianConsent: z.string().optional(),
  })
  .superRefine((d, ctx) => {
    const age = ageFrom(d.dateOfBirth);
    if (Number.isNaN(age) || age < 3 || age > 110) {
      ctx.addIssue({ code: "custom", path: ["dateOfBirth"], message: "Enter a valid date of birth." });
      return;
    }
    if (age < 18) {
      if (!z.email().safeParse(d.guardianEmail).success) {
        ctx.addIssue({
          code: "custom",
          path: ["guardianEmail"],
          message: "Students under 18 need a parent or guardian's email.",
        });
      }
      if (d.guardianConsent !== "on") {
        ctx.addIssue({
          code: "custom",
          path: ["guardianConsent"],
          message: "A parent or guardian must agree before an under-18 can study.",
        });
      }
    }
  });

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const values = formValues(formData);
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), values };

  const d = parsed.data;
  const isMinor = ageFrom(d.dateOfBirth) < 18;
  const row = {
    dateOfBirth: d.dateOfBirth,
    country: d.country,
    nextOfKinName: d.nextOfKinName,
    nextOfKinRelationship: d.nextOfKinRelationship,
    nextOfKinPhone: d.nextOfKinPhone,
    guardianEmail: isMinor ? d.guardianEmail!.toLowerCase() : null,
    guardianConsentAt: isMinor ? new Date() : null,
  };

  await db
    .insert(schema.profile)
    .values({ userId: user.id, ...row })
    .onConflictDoUpdate({ target: schema.profile.userId, set: row });

  redirect("/enroll");
}
