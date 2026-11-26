import Link from "next/link";
import { Suspense } from "react";
import { RequireUser } from "@/components/require-role";
import { UserMenu } from "@/components/user-menu";
import { ACADEMY_NAME } from "@/lib/domain/constants";

const NAV = [
  { href: "/dashboard", label: "My instruments" },
  { href: "/billing", label: "Billing" },
  { href: "/profile", label: "Profile" },
] as const;

// The header prerenders; the section gate and each page's own data check run per request.
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href="/dashboard" className="font-semibold">
              {ACADEMY_NAME}
            </Link>
            <nav className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-zinc-950 dark:hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Suspense>
            <UserMenu />
          </Suspense>
        </div>
      </header>
      <Suspense fallback={<p className="px-4 py-10 text-center text-sm text-zinc-500">Loading…</p>}>
        <RequireUser>{children}</RequireUser>
      </Suspense>
    </div>
  );
}
