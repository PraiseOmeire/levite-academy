import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth/session";
import { getCatalogue } from "@/lib/data/catalogue";
import { getEnrollmentForUser, getEnrollmentGenreSlugs } from "@/lib/data/student";
import { ChangeLevelForm } from "./change-level-form";
import {
  MONTHLY_PRICE_KOBO,
  durationLabel,
  formatNaira,
  plannedLessonCount,
} from "@/lib/domain/constants";

export const metadata = { title: "Review your plan" };

export default function ReviewPlanPage(props: PageProps<"/subscribe/[enrollmentId]">) {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold">Review your plan</h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Check everything before you subscribe.
      </p>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        {props.params.then(({ enrollmentId }) => (
          <PlanSummary enrollmentId={enrollmentId} />
        ))}
      </Suspense>
    </main>
  );
}

async function PlanSummary({ enrollmentId }: { enrollmentId: string }) {
  const user = await requireUser();
  const enrollment = await getEnrollmentForUser(user.id, enrollmentId);
  if (!enrollment) notFound();
  if (enrollment.status === "active") redirect("/dashboard");

  // Genres are for instructors' context only; they're preloaded into the change-level form, not shown.
  const [genreSlugs, catalogue] = await Promise.all([
    getEnrollmentGenreSlugs(enrollment.id),
    getCatalogue(),
  ]);
  const canChangeLevel = enrollment.status === "pending_payment";

  const lessons = plannedLessonCount(enrollment.level.durationMonths);
  const price = formatNaira(MONTHLY_PRICE_KOBO);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-xl font-semibold">
          {enrollment.instrument.name} · {enrollment.level.name}
        </h2>

        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
          <dt className="text-zinc-500">Lessons</dt>
          <dd>{lessons} video lessons, each with a practical assignment</dd>
          <dt className="text-zinc-500">Length</dt>
          <dd>{durationLabel(enrollment.level.durationMonths)}</dd>
          <dt className="text-zinc-500">Feedback</dt>
          <dd>An instructor reviews every assignment within 48 hours</dd>
        </dl>

        <div className="mt-6 flex items-baseline justify-between border-t border-zinc-200 pt-5 dark:border-zinc-800">
          <span className="text-sm text-zinc-500">Monthly price</span>
          <span className="text-2xl font-semibold">
            {price}
            <span className="text-base font-normal text-zinc-500"> / month</span>
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          Renews monthly. Turn off auto-renew or cancel anytime. Your progress is kept if you pause.
        </p>
      </section>

      {canChangeLevel && (
        <ChangeLevelForm
          enrollmentId={enrollment.id}
          instrumentName={enrollment.instrument.name}
          levels={catalogue.levels}
          genres={catalogue.genres}
          currentLevel={enrollment.level.slug}
          currentGenres={genreSlugs}
        />
      )}

      {/* TODO(phase 4): start Paystack checkout for this enrollment. */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled
          className="rounded-full bg-zinc-950 px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950"
        >
          Subscribe for {price} / month
        </button>
        <p className="text-center text-sm text-zinc-500">Online payment is coming soon.</p>
      </div>

      <Link href="/dashboard" className="text-center text-sm font-medium underline">
        Go to my dashboard
      </Link>
    </div>
  );
}
