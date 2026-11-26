import Link from "next/link";
import { ACADEMY_NAME, INSTRUMENTS } from "@/lib/domain/constants";

// Temporary homepage. The real marketing site (about, testimonials, branding) is phase 6.
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-4xl font-semibold">{ACADEMY_NAME}</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Learn {INSTRUMENTS.map((i) => i.name.toLowerCase()).join(", ")} with
        step-by-step video lessons and feedback from instructors, for every age.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/register" className="rounded-full bg-zinc-950 px-5 py-2.5 text-white dark:bg-white dark:text-zinc-950">
          Subscribe
        </Link>
        <Link href="/login" className="rounded-full border border-zinc-300 px-5 py-2.5 dark:border-zinc-700">
          Log in
        </Link>
      </div>
    </main>
  );
}
