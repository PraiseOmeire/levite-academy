import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import { getSession } from "@/lib/auth/session";

/** Reads the session: render inside <Suspense>. */
export async function UserMenu() {
  const session = await getSession();
  if (!session) {
    return (
      <Link href="/login" className="text-sm font-medium">
        Log in
      </Link>
    );
  }
  const { user } = session;
  const isStaff = user.role === "admin" || user.role === "instructor";

  return (
    <div className="flex items-center gap-4 text-sm">
      {isStaff && (
        <Link href="/admin" className="font-medium">
          Admin
        </Link>
      )}
      <span className="hidden text-zinc-600 sm:inline dark:text-zinc-400">{user.name}</span>
      <form action={logout}>
        <button type="submit" className="font-medium underline">
          Log out
        </button>
      </form>
    </div>
  );
}
