import { pgTable, serial, text, timestamp, jsonb, integer, vector, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { type AdapterAccount } from "next-auth/adapters";

// 1. Users (Extended for NextAuth)
export const users = pgTable('user', {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // Custom Serenity Fields
  telegramChatId: text('telegram_chat_id'),
  timezone: text('timezone').default('UTC'),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow(),
});

// NextAuth: Accounts
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
);

// NextAuth: Sessions
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// NextAuth: Verification Tokens
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// 2. Clinical Profile (The "Patient File")
export const patientProfile = pgTable('patient_profile', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  keyPeople: jsonb('key_people').default([]),
  medications: jsonb('medications').default([]),
  diagnoses: jsonb('diagnoses').default([]),
  traumaTimeline: jsonb('trauma_timeline').default([]),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Clinical Notes (SOAP Format with Vectors)
export const clinicalNotes = pgTable('clinical_notes', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  sessionDate: timestamp('session_date').defaultNow(),
  type: text('type').default('Follow-up'), // Initial, Follow-up, Crisis
  subjective: text('subjective'),
  objective: text('objective'),
  assessment: text('assessment'),
  plan: text('plan'),
  summary: text('summary'),
  summaryEmbedding: vector('summary_embedding', { dimensions: 768 }),
});

// 4. Raw Messages (Unified Chat History)
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').notNull(),
  content: text('content').notNull(),
  isCrisis: boolean('is_crisis').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Assessments
export const assessments = pgTable('assessments', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(),
  score: integer('score').notNull(),
  answers: jsonb('answers').notNull(),
  administeredAt: timestamp('administered_at').defaultNow(),
});

// 6. Appointments
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  scheduledTime: timestamp('scheduled_time').notNull(),
  status: text('status').default('PENDING'),
  platform: text('platform').default('TELEGRAM'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(patientProfile, {
    fields: [users.id],
    references: [patientProfile.userId],
  }),
  notes: many(clinicalNotes),
  messages: many(messages),
  appointments: many(appointments),
}));

export const profileRelations = relations(patientProfile, ({ one }) => ({
  user: one(users, {
    fields: [patientProfile.userId],
    references: [users.id],
  }),
}));