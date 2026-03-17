import { pgTable, serial, text, timestamp, jsonb, integer, vector, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { defineRelations as relations, One, Many } from 'drizzle-orm/relations';

// Note: Neon Auth handles user authentication tables in neon_auth schema
// We only define our custom application tables here

// 1. Clinical Profile (The "Patient File")
export const patientProfile = pgTable('patient_profile', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // References neon_auth.user.id
  keyPeople: jsonb('key_people').default([]),
  medications: jsonb('medications').default([]),
  diagnoses: jsonb('diagnoses').default([]),
  traumaTimeline: jsonb('trauma_timeline').default([]),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Clinical Notes (SOAP Format with Vectors)
export const clinicalNotes = pgTable('clinical_notes', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // References neon_auth.user.id
  sessionDate: timestamp('session_date').defaultNow(),
  type: text('type').default('Follow-up'), // Initial, Follow-up, Crisis
  subjective: text('subjective'),
  objective: text('objective'),
  assessment: text('assessment'),
  plan: text('plan'),
  summary: text('summary'),
  // summaryEmbedding: vector('summary_embedding', { dimensions: 768 }), // Temporarily disabled
});

// 3. Raw Messages (Unified Chat History)
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // References neon_auth.user.id
  role: text('role').notNull(),
  content: text('content').notNull(),
  isCrisis: boolean('is_crisis').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Assessments
export const assessments = pgTable('assessments', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // References neon_auth.user.id
  type: text('type').notNull(),
  score: integer('score').notNull(),
  answers: jsonb('answers').notNull(),
  administeredAt: timestamp('administered_at').defaultNow(),
});

// 5. Appointments
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // References neon_auth.user.id
  scheduledTime: timestamp('scheduled_time').notNull(),
  status: text('status').default('PENDING'),
  platform: text('platform').default('TELEGRAM'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
// export const usersRelations = relations(users, {
//   profile: One(patientProfile, {
//     fields: [users.id],
//     references: [patientProfile.userId],
//   }),
//   notes: Many(clinicalNotes),
//   messages: Many(messages),
//   appointments: Many(appointments),
// });

// export const profileRelations = relations(patientProfile, {
//   user: One(users, {
//     fields: [patientProfile.userId],
//     references: [users.id],
//   }),
// });