import Link from "next/link";
import { Suspense } from "react";
import { RequireRole } from "@/components/require-role";
import { UserMenu } from "@/components/user-menu";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/submissions", label: "Assignment queue" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
] as const;

// Instructors and admins only. Admin-only pages narrow this further with requireRole("admin").
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <span className="font-semibold">Admin</span>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Suspense>
            <UserMenu />
          </Suspense>
        </div>
      </header>
      <Suspense fallback={<p className="px-4 py-10 text-center text-sm text-zinc-500">Loading…</p>}>
        <RequireRole roles={["instructor", "admin"]}>{children}</RequireRole>
      </Suspense>
    </div>
  );
}
