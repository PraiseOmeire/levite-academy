# City Levite Music Academy — Architecture

Online music school. Students subscribe monthly per instrument, watch video lessons in order, and unlock each next lesson by submitting a practical assignment that an instructor approves.

One Next.js app serves both sides:

- **Student platform:** sign up, onboarding, lessons, assignments, billing
- **Admin panel** (`/admin`): content, assignment review, students, subscriptions, analytics

---

## 1. Product rules (agreed with client)

### Catalogue
- **Instruments (5):** piano, guitar, saxophone, trumpet, violin
- **Levels:** beginner, intermediate, expert
- **Structure:** Instrument → Level → Module → Lesson → Assignment
- **Course length** (3 lessons/week × 4 weeks × months):

  | Level | Duration | Lessons |
  |---|---|---|
  | Beginner | 6 months | 72 |
  | Intermediate | 3 months | 36 |
  | Expert | 3 months | 36 |

- Lesson videos are **12 minutes max** and cannot be downloaded (streamed through short-lived signed URLs, with no download control).
- The current focus is **contemporary music**.

### Accounts and enrollments
- **One account per person.** An account can hold several **enrollments** (one per instrument).
- **Each enrollment needs its own active subscription** (one payment = one instrument).
- Moving up a level happens **on the same account and enrollment**.
- **Genres:** intermediate and expert students pick the genres they are **already familiar with** (for information only, it doesn't filter lessons). Beginners don't see genres.

### Registration fields
Full name, email, WhatsApp number, date of birth, country, profile picture, next of kin.
Sign-up asks only for name, email, password and WhatsApp number. Onboarding collects the rest.

### Subscription
- **₦5,000 per month per enrollment** (test price).
- Billed with Paystack. The student can turn **auto-renew** on or off. With it off, access ends at the end of the paid period.
- When access ends, the student can't open that enrollment's lessons. **All progress is kept** and resumes when they resubscribe.

### Lesson flow (the core loop)
1. A lesson is **unlocked**.
2. The student watches it. Once they've **actually watched more than 50%** (the furthest point reached by playing, not by seeking ahead), the **assignment** appears. An assignment is written instructions, a PDF and/or an instruction video.
3. The student **submits** a recording (usually a video of themselves playing).
4. An **instructor** for that instrument reviews it, **approves or rejects it, and writes feedback**. Students can resubmit **unlimited** times.
5. On approval, the **next lesson becomes eligible** to unlock, subject to the weekly limit.
6. Students can always rewatch earlier lessons while their subscription is active.

### Weekly limit
- **3 new lesson unlocks per week**, per enrollment. Rewatching doesn't count.
- A **week is 7 days starting from the first unlock** in that week. Once those 7 days pass, the next unlock starts a new week.
- If an approval arrives but the week's 3 unlocks are used up, the next lesson shows **"Unlocks on <date>"**.
- The progress bar shows **"Lesson 14 of 36"**.

### Review promise and compensation
- Instructors review within **48 hours** (usually 24).
- If a review takes longer than 48 hours, the student gets **bonus access days**: `ceil((reviewedAt − submittedAt − 48h) / 24h)`.
- Bonus days are stored on the enrollment and **extend access past the paid period end**. Paystack's billing date doesn't change. If the student keeps auto-renewing, the bonus days are held and used up when they stop renewing. *(Confirm this behaviour with the client.)*

### Instructors
- Several instructors, each **assigned to specific instruments**. They only see submissions for those instruments.

---

## 2. Still open with the client

| # | Question | Proposal |
|---|---|---|
| 1 | What happens when a student finishes a level? | Final assessment assignment. If an instructor approves it, the student moves up a level on the same enrollment and keeps any remaining paid days. This becomes the certificate trigger later. |
| 2 | Placement: how do we stop a beginner picking "expert"? | No test before payment. Show a "this level is for you if you can…" self-check, and allow a **free level switch within the first 7 days** (by the student, or recommended by an instructor). |
| 3 | Under-18 students | Treat next of kin as parent/guardian. Collect guardian email and consent for under-18s. Profile photo optional. |
| 4 | Bonus days while auto-renewing | As described above (held until renewal stops). An alternative is to skip the next charge. |
| 5 | International pricing | Start with naira only via Paystack (international cards work, at a higher fee). Add USD or Stripe later if needed. |

---

## 3. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router, `src/`, TypeScript, Tailwind v4) | Already set up. Note: middleware is now `proxy.ts`, `params` is a Promise, and **Cache Components is on**, so request data (`params`, cookies, DB reads) must be read inside `<Suspense>` or cached with `"use cache"`. |
| Hosting | **Vercel** | Zero-config for Next.js, plus Cron |
| Database | **PostgreSQL on Neon** | Serverless Postgres with a free tier |
| ORM | **Drizzle** | Typed SQL, lightweight, works well with Neon |
| Auth | **Better Auth** | Email/password, email verification, roles, self-hosted in our DB |
| Lesson + submission video | **Cloudflare Stream** | Transcoding, adaptive streaming, signed URLs, direct browser uploads |
| Files (avatars, assignment PDFs) | **Cloudflare R2** | S3-compatible, no egress fees |
| Payments | **Paystack** (subscriptions + webhooks) | Nigeria-first, accepts international cards |
| Email | **Resend** | Transactional email |
| Scheduled jobs | **Vercel Cron** | Expiry reminders, overdue-review checks |

### Accounts the client/team must create
Neon, Cloudflare (Stream + R2), Paystack (needs CAC documents to go live), Resend (plus a sending domain), Vercel.

---

## 4. Data model (first pass)

**Identity**
- `user`: id, name, email, emailVerified, image, role (`student` | `instructor` | `admin`), createdAt *(Better Auth tables + role)*
- `profile`: userId, whatsappNumber, dateOfBirth, country, nextOfKinName, nextOfKinPhone, nextOfKinRelationship, guardianEmail?, guardianConsentAt?
- `instructor_instrument`: userId, instrumentId

**Catalogue**
- `instrument`: id, slug, name
- `level`: id, slug (`beginner` | `intermediate` | `expert`), name, durationMonths, sortOrder
- `genre`: id, name
- `module`: id, instrumentId, levelId, title, sortOrder
- `lesson`: id, moduleId, title, description, sortOrder, videoUid (Stream), durationSeconds, isPublished
- `assignment`: id, lessonId, instructions (rich text), attachmentKey? (R2), instructionVideoUid? (Stream)

**Enrollment and billing**
- `enrollment`: id, userId, instrumentId, levelId, status, bonusDays, levelSwitchDeadline, createdAt. Unique on (userId, instrumentId).
- `enrollment_genre`: enrollmentId, genreId
- `subscription`: id, enrollmentId, paystackCustomerCode, paystackSubscriptionCode, status, currentPeriodEnd, autoRenew
- `payment`: id, subscriptionId, reference, amountKobo, currency, status, paidAt

**Progress**
- `lesson_progress`: enrollmentId, lessonId, unlockedAt, maxWatchedSeconds, watchedPercent, assignmentVisibleAt, completedAt
- `submission`: id, enrollmentId, assignmentId, videoUid, note, status (`pending` | `approved` | `rejected`), submittedAt, reviewedAt, reviewerId, feedback
- `unlock_window`: enrollmentId, startedAt, unlockCount *(the weekly limit)*

**Operations**
- `email_log`: userId, type, sentAt *(so reminders aren't sent twice)*

Access is derived: an enrollment's lessons are viewable when `now < subscription.currentPeriodEnd + enrollment.bonusDays`.

---

## 5. App structure

```
src/
  app/
    layout.tsx                 root layout (fonts, metadata)
    (marketing)/               public site
      page.tsx                 /
    (auth)/
      login/                   /login
      register/                /register
    (platform)/                signed-in students
      onboarding/              /onboarding (profile, instrument, level, genres, pay)
      dashboard/               /dashboard (my instruments + progress)
      learn/[enrollmentId]/    /learn/:id (module + lesson list)
        lessons/[lessonId]/    /learn/:id/lessons/:lessonId (player, assignment, submit)
      billing/                 /billing (subscriptions, auto-renew)
      profile/                 /profile
    admin/                     instructors + admins
      page.tsx                 /admin (overview + registration stats)
      courses/                 /admin/courses (instruments, modules, lessons, uploads)
      submissions/             /admin/submissions (review queue)
        [submissionId]/        /admin/submissions/:id (watch, approve/reject, feedback)
      students/                /admin/students
        [studentId]/           /admin/students/:id (progress)
      subscriptions/           /admin/subscriptions (active, expiring, expired)
    api/
      webhooks/paystack/       Paystack events (later)
      cron/                    reminders, overdue reviews (later)
  components/                  shared UI
  lib/
    domain/                    pure business rules + constants (no I/O)
    db/                        Drizzle schema + client (phase 1)
    auth/                      Better Auth config (phase 1)
  proxy.ts                     optimistic auth redirects (phase 1)
```

Authorization is enforced **on the server** (in data access functions and server actions), not only in `proxy.ts`.

---

## 6. Build phases

1. **Foundation:** database, auth, roles, sign-up, onboarding (profile, instrument, level, genres)
2. **Content:** admin builds modules and lessons and uploads to Stream; students watch, with >50% tracking
3. **Assignments:** submission upload, instructor queue, approve/reject + feedback, unlocking, weekly limit, overdue-review bonus days
4. **Payments:** Paystack plans, checkout, webhooks, auto-renew toggle, access control
5. **Admin insights:** registrations per week/month, progress, expiring subscriptions, reminder emails (3 days before, on expiry)
6. **Public site:** homepage, testimonials, branding
