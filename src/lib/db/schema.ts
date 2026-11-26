import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/* -------------------------------------------------------------------------- */
/* Auth (Better Auth core tables; property names must match Better Auth's)    */
/* -------------------------------------------------------------------------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  // Additional fields (declared in src/lib/auth/index.ts as well)
  role: text("role").notNull().default("student"), // student | instructor | admin
  whatsappNumber: text("whatsapp_number"),
  ...timestamps,
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

/* -------------------------------------------------------------------------- */
/* Student profile                                                            */
/* -------------------------------------------------------------------------- */

export const profile = pgTable("profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  dateOfBirth: date("date_of_birth").notNull(),
  country: text("country").notNull(),
  // Next of kin is optional.
  nextOfKinName: text("next_of_kin_name"),
  nextOfKinPhone: text("next_of_kin_phone"),
  nextOfKinRelationship: text("next_of_kin_relationship"),
  /** Required for under-18s: the next of kin acts as parent/guardian. */
  guardianEmail: text("guardian_email"),
  /** When the under-18 consent box was ticked during onboarding. */
  guardianConsentAt: timestamp("guardian_consent_at", { withTimezone: true }),
  ...timestamps,
});

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

export const instrument = pgTable("instrument", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const level = pgTable("level", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  durationMonths: integer("duration_months").notNull(),
  hasGenres: boolean("has_genres").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const genre = pgTable("genre", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const instructorInstrument = pgTable(
  "instructor_instrument",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    instrumentId: uuid("instrument_id")
      .notNull()
      .references(() => instrument.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.instrumentId] })],
);

/* -------------------------------------------------------------------------- */
/* Enrollment                                                                 */
/* -------------------------------------------------------------------------- */

export const enrollmentStatus = pgEnum("enrollment_status", [
  "pending_payment",
  "active",
  "expired",
  "cancelled",
]);

export const enrollment = pgTable(
  "enrollment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    instrumentId: uuid("instrument_id")
      .notNull()
      .references(() => instrument.id),
    levelId: uuid("level_id")
      .notNull()
      .references(() => level.id),
    status: enrollmentStatus("status").notNull().default("pending_payment"),
    /** Earned when a review takes longer than the 48-hour promise. */
    bonusDays: integer("bonus_days").notNull().default(0),
    /** Free level switch allowed until this time (first 7 days of the first paid period). */
    levelSwitchDeadline: timestamp("level_switch_deadline", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    // One enrollment per instrument per person.
    unique("enrollment_user_instrument_uq").on(t.userId, t.instrumentId),
    index("enrollment_user_id_idx").on(t.userId),
  ],
);

export const enrollmentGenre = pgTable(
  "enrollment_genre",
  {
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => enrollment.id, { onDelete: "cascade" }),
    genreId: uuid("genre_id")
      .notNull()
      .references(() => genre.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.enrollmentId, t.genreId] })],
);
