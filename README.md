# City Levite Music Academy

Online music school: monthly subscriptions per instrument, video lessons, and instructor-reviewed assignments that unlock the next lesson. The full plan is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

**Stack:** Next.js 16 (App Router, Cache Components) · PostgreSQL on Neon · Drizzle ORM · Better Auth · Tailwind CSS v4

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root (never commit it):

   ```
   DATABASE_URL=postgresql://...        # Neon connection string (pooled)
   BETTER_AUTH_SECRET=...               # any long random string
   BETTER_AUTH_URL=http://localhost:3000
   ```

3. Create the database tables and seed instruments, levels and genres:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Start the app at http://localhost:3000:

   ```bash
   npm run dev
   ```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build (also type-checks) |
| `npm run lint` | Lint the code |
| `npm run db:generate` | Create a migration after editing `src/lib/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:seed` | Insert/update instruments, levels and genres (safe to re-run) |
| `npm run db:studio` | Browse the database in Drizzle Studio |
| `npm run make-admin -- <email> [role]` | Give a registered user the `admin` (default), `instructor` or `student` role |

## Project layout

```
src/
  app/
    (marketing)/   public site
    (auth)/        login, register (+ server actions)
    (platform)/    signed-in students: onboarding, enroll, dashboard, learn, billing, profile
    admin/         instructors and admins
    api/auth/      Better Auth endpoints
  components/      shared UI
  lib/
    auth/          Better Auth config + session helpers (requireUser / requireRole)
    data/          server-only data access
    db/            Drizzle schema + client
    domain/        business rules and constants
  proxy.ts         redirects signed-out visitors (optimistic check only)
drizzle/           generated SQL migrations
scripts/           seed and admin scripts
```
