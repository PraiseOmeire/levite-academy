import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth/session";
import { getEnrollments, getProfile } from "@/lib/data/student";
import {
  INSTRUMENTS,
  LESSONS_PER_WEEK,
  MONTHLY_PRICE_KOBO,
  durationLabel,
  formatNaira,
  plannedLessonCount,
} from "@/lib/domain/constants";

export const metadata = { title: "My instruments" };

const STATUS_LABEL = {
  pending_payment: { text: "Awaiting payment", tone: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200" },
  active: { text: "Active", tone: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200" },
  expired: { text: "Expired", tone: "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" },
  cancelled: { text: "Cancelled", tone: "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" },
} as const;

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading your dashboard…</p>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}

async function Dashboard() {
  const user = await requireUser();
  const [profile, enrollments] = await Promise.all([getProfile(user.id), getEnrollments(user.id)]);
  if (!profile) redirect("/onboarding");
  if (enrollments.length === 0) redirect("/enroll");

  const firstName = user.name.split(" ")[0];
  // A new instrument is a new subscription: only once nothing is waiting for payment.
  const hasPending = enrollments.some((e) => e.status === "pending_payment");
  const canAddMore = !hasPending && enrollments.length < INSTRUMENTS.length;

  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold">Welcome, {firstName}</h1>
      <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">Your instruments</p>

      <ul className="flex flex-col gap-4">
        {enrollments.map((e) => {
          const status = STATUS_LABEL[e.status];
          const total = plannedLessonCount(e.level.durationMonths);
          return (
            <li key={e.id} className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">
                  {e.instrument.name} · {e.level.name}
                </h2>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.tone}`}>{status.text}</span>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                  <span>Lesson 0 of {total}</span>
                  <span>0%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-2 w-0 rounded-full bg-zinc-950 dark:bg-white" />
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  {durationLabel(e.level.durationMonths)} at {LESSONS_PER_WEEK} new lessons a week
                </p>
              </div>
              {e.status === "pending_payment" && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Subscribe for {formatNaira(MONTHLY_PRICE_KOBO)}/month to start your lessons.
                  </p>
                  <Link
                    href={`/subscribe/${e.id}`}
                    className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-950"
                  >
                    Review plan &amp; subscribe
                  </Link>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {canAddMore && (
        <Link
          href="/enroll"
          className="mt-6 inline-block rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium dark:border-zinc-700"
        >
          + Learn another instrument
        </Link>
      )}
    </>
  );
}
