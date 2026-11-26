import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/submissions", label: "Assignment queue" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
] as const;

// TODO(phase 1): restrict to instructor/admin roles on the server.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="mx-auto flex w-full max-w-5xl flex-wrap gap-x-5 gap-y-2 px-4 py-3 text-sm">
          <span className="font-semibold">Admin</span>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
