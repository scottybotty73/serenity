CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"scheduled_time" timestamp NOT NULL,
	"status" text DEFAULT 'PENDING',
	"platform" text DEFAULT 'TELEGRAM',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"score" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"administered_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clinical_notes" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"session_date" timestamp DEFAULT now(),
	"type" text DEFAULT 'Follow-up',
	"subjective" text,
	"objective" text,
	"assessment" text,
	"plan" text,
	"summary" text
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"is_crisis" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "patient_profile" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"key_people" jsonb DEFAULT '[]',
	"medications" jsonb DEFAULT '[]',
	"diagnoses" jsonb DEFAULT '[]',
	"trauma_timeline" jsonb DEFAULT '[]',
	"updated_at" timestamp DEFAULT now()
);
