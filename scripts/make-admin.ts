/**
 * Changes a registered user's role.
 *   npm run make-admin -- someone@example.com            -> admin
 *   npm run make-admin -- someone@example.com instructor -> instructor
 */
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { ROLES, type Role } from "../src/lib/domain/constants";
import { user } from "../src/lib/db/schema";

async function main() {
  const [email, roleArg = "admin"] = process.argv.slice(2);
  if (!email) {
    console.error("Usage: npm run make-admin -- <email> [student|instructor|admin]");
    process.exit(1);
  }
  if (!ROLES.includes(roleArg as Role)) {
    console.error(`Role must be one of: ${ROLES.join(", ")}`);
    process.exit(1);
  }

  const db = drizzle({ client: neon(process.env.DATABASE_URL!) });
  const updated = await db
    .update(user)
    .set({ role: roleArg })
    .where(eq(user.email, email.trim().toLowerCase()))
    .returning({ id: user.id });

  if (updated.length === 0) {
    console.error(`No user found with that email. They need to register first.`);
    process.exit(1);
  }
  console.log(`Done: user is now "${roleArg}".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
