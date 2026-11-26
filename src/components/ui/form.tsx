import type { ComponentProps, ReactNode } from "react";

/** Small, unstyled-by-brand form primitives. Restyle once branding is decided (phase 6). */

const control =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-sm text-zinc-500">{hint}</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={control} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={control} />;
}

export function Button({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={`rounded-full bg-zinc-950 px-5 py-2.5 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 ${className}`}
    />
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
    >
      {message}
    </p>
  );
}

/** Field-level errors keyed by input name, plus a form-level message. */
export type FormState = {
  message?: string;
  fieldErrors?: Record<string, string | undefined>;
  values?: Record<string, string>;
};
