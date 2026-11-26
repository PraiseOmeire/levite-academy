import Link from "next/link";
import { ACADEMY_NAME } from "@/lib/domain/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-12">
      <Link href="/" className="mb-8 text-lg font-semibold">
        {ACADEMY_NAME}
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
        {children}
      </div>
    </div>
  );
}
