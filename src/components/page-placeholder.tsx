import type { ReactNode } from "react";

/** Temporary stand-in for routes that are planned but not built yet. */
export function PagePlaceholder({
  title,
  description,
  phase,
}: {
  title: string;
  description: ReactNode;
  phase: number;
}) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-4 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
        Phase {phase}
      </p>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
    </main>
  );
}
