import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Role } from "@/lib/domain/constants";
import { auth } from "./index";

/**
 * Data Access Layer for the signed-in user. Reads the request cookies, so call
 * it only inside a <Suspense> boundary, a Server Action or a Route Handler.
 * `cache` dedupes the lookup within one request.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/** The signed-in user, or a redirect to /login. */
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session.user;
}

/** The signed-in user if they have one of the roles; students are sent to their dashboard. */
export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role as Role)) redirect("/dashboard");
  return user;
}
