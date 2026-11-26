import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth/session";
import { getCatalogue } from "@/lib/data/catalogue";
import { getEnrollments, getProfile } from "@/lib/data/student";
import { EnrollForm } from "./enroll-form";

export const metadata = { title: "Choose your instrument" };

export default function EnrollPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold">Choose your instrument and level</h1>
      <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
        Each instrument is its own monthly subscription.
      </p>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <EnrollGate />
      </Suspense>
    </main>
  );
}

async function EnrollGate() {
  const user = await requireUser();
  const [profile, enrollments, catalogue] = await Promise.all([
    getProfile(user.id),
    getEnrollments(user.id),
    getCatalogue(),
  ]);
  if (!profile) redirect("/onboarding");

  // One unpaid instrument at a time: send them to finish that one.
  const pending = enrollments.find((e) => e.status === "pending_payment");
  if (pending) redirect(`/subscribe/${pending.id}`);

  const enrolledSlugs = enrollments.map((e) => e.instrument.slug);
  if (enrolledSlugs.length >= catalogue.instruments.length) {
    return (
      <p>
        You&apos;re enrolled in every instrument we offer.{" "}
        <Link href="/dashboard" className="underline">
          Back to your dashboard
        </Link>
      </p>
    );
  }

  return (
    <EnrollForm
      instruments={catalogue.instruments}
      levels={catalogue.levels}
      genres={catalogue.genres}
      enrolledSlugs={enrolledSlugs}
    />
  );
}
