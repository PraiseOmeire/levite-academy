import type { ReactNode } from "react";
import { requireRole, requireUser } from "@/lib/auth/session";
import type { Role } from "@/lib/domain/constants";

/**
 * Server-side gates for whole sections. They read the session, so render them
 * inside <Suspense>. Pages that load data must still call requireUser()/requireRole()
 * themselves; these gates only stop unauthorised visitors seeing the section.
 */
export async function RequireUser({ children }: { children: ReactNode }) {
  await requireUser();
  return children;
}

export async function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  await requireRole(...roles);
  return children;
}
