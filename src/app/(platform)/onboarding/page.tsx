import { redirect } from "next/navigation";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth/session";
import { getProfile } from "@/lib/data/student";
import { ProfileForm } from "./profile-form";

export const metadata = { title: "Your details" };

export default function OnboardingPage() {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold">Tell us about yourself</h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Step 2 of 4. Next you&apos;ll choose your instrument and level.
      </p>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <OnboardingGate />
      </Suspense>
    </main>
  );
}

async function OnboardingGate() {
  const user = await requireUser();
  if (await getProfile(user.id)) redirect("/enroll");
  return <ProfileForm />;
}
