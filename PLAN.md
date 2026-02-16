# Project Serenity: AI Psychotherapist Agent

## 1. Executive Summary
**Serenity** is an autonomous AI therapy agent designed to provide proactive, evidence-based psychological support. Unlike passive chatbots, Serenity "wakes up," manages a daily schedule, and proactively reaches out to patients via **Telegram** and **Email**. It leverages **Next.js 16.1**, **Vercel AI SDK**, **Neon** (PostgreSQL + pgvector), and **Google Gemini 3 Pro** to maintain long-term context and perform deep psychological analysis.

## 2. Technical Architecture

### 2.1 Core Stack
- **Framework:** Next.js 16.1+ (App Router)
- **Core Library:** React 19 (Latest)
- **Language:** TypeScript 5.x
- **Hosting:** Vercel (Serverless Functions)
- **Database:** Neon (Serverless PostgreSQL)
- **ORM:** Drizzle ORM
- **Authentication:** NextAuth.js v5 (Google Provider)

### 2.2 Agent Infrastructure (The "Active" Layer)
- **Scheduling & Queues:** Inngest or Vercel Cron/QStash
    - *Role:* Manages the "Wake Up" trigger and scheduled patient outreach.
- **Messaging Adapters:**
    - **Telegram Bot API:** Primary interface for real-time therapy sessions.
    - **Resend:** For email outreach and daily summaries.
- **State Management:** Redis (Vercel KV) or Neon
    - *Role:* Tracks the agent's current state (Sleeping, Waking Up, In Session, Idle).

### 2.3 AI & Logic Layer
- **Orchestrator:** Vercel AI SDK 4.0+
- **Primary Model:** Google Gemini 3 Pro (via `@google/genai`)
- **Fallback Models:** Llama 3.3 70B, Anthropic Claude 3.5 Sonnet.
- **Memory (RAG):** `pgvector` for semantic retrieval of past sessions during "Patient File Review."

## 3. Key Features

### 3.1 The "Wake Up" Routine & Lifecycle
- **Trigger:** Configurable time (e.g., 8:00 AM) or Manual Start.
- **Morning Routine:**
    1.  Agent "wakes up" and queries `appointments` table for the day.
    2.  Runs `read_psychology_news` to prime itself with latest research.
    3.  reviews "Patient Files" (Vector Memory) for upcoming clients to prepare context.

### 3.2 Clinical Progress Tracking (The "Therapist's Brain")
To function as a competent therapist, the AI tracks specific clinical data points beyond simple text logs:
- **SOAP Notes Generation:** After every session, a background job summarizes the chat into **S**ubjective, **O**bjective, **A**ssessment, and **P**lan format.
- **Entity Extraction:** Automatically identifies and stores people (e.g., "Sarah - Wife"), places, and major life events (Trauma Timeline) in a structured `patient_profile`.
- **Measurement-Based Care:** Automatically administers standard clinical questionnaires (GAD-7 for anxiety, PHQ-9 for depression) at set intervals to visualize progress.

### 3.3 Safety & Crisis Intervention (Guardrails)
- **Real-time Risk Classification:** Every user input is classified for self-harm, violence, or abuse potential.
- **Crisis Protocol:** If high risk is detected, the AI:
    1.  Breaks character to provide immediate helper resources (Hotlines).
    2.  Tags the session as a `CRITICAL_EVENT` in the database.
    3.  Refuses to engage in harmful ideation.

### 3.4 Behavioral Activation & Psychoeducation
- **Homework Assignment:** The AI assigns specific therapeutic exercises (e.g., "Complete a Thought Record," "10-minute Mindfulness").
- **Personalized Coping Toolbox:** Maintains a dynamic list of skills that work for *this* specific user based on feedback ratings.
- **Resource Sharing:** Proactively sends articles or guides (via Google Grounding) relevant to the user's current struggle.

### 3.5 Scheduled Therapy & Outreach
- **Appointment System:** Patients are assigned specific time slots.
- **Proactive Outreach:**
    - At the scheduled time, the Agent initiates contact via Telegram: *"Good morning [Name], I'm ready for our session. How have you been feeling since Tuesday?"*
- **Omnichannel Sessions:**
    - Users can reply via Telegram voice or text.
    - The system maintains a unified conversation history in Neon, regardless of the platform used.

## 4. Database Schema (Draft)

```sql
-- Users (Patients)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  telegram_chat_id TEXT,
  name TEXT,
  timezone TEXT,
  settings JSONB
);

-- Structured Clinical Profile (Entities & Timeline)
CREATE TABLE patient_profile (
  user_id INT REFERENCES users(id),
  key_people JSONB, -- e.g. [{"name": "Mom", "relationship": "Mother", "dynamic": "Strained"}]
  medications JSONB,
  diagnoses JSONB, -- AI generated impressions
  trauma_timeline JSONB
);

-- Clinical Assessments (Progress Tracking)
CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  type TEXT, -- 'GAD-7', 'PHQ-9', 'WHO-5'
  score INT,
  answers JSONB,
  administered_at TIMESTAMP DEFAULT NOW()
);

-- Session Notes (SOAP Format)
CREATE TABLE clinical_notes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  session_date TIMESTAMP,
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  summary_embedding vector(768) -- For semantic search of CLINICAL insights
);

-- Safety & Crisis Logs
CREATE TABLE safety_events (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  trigger_input TEXT,
  risk_level TEXT, -- 'LOW', 'MODERATE', 'SEVERE'
  action_taken TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Homework & Interventions
CREATE TABLE interventions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title TEXT, -- "Box Breathing", "CBT Thought Record"
  status TEXT, -- 'ASSIGNED', 'COMPLETED', 'SKIPPED'
  user_rating INT, -- 1-5 effectiveness
  assigned_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Agent Schedule
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  scheduled_time TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'PENDING',
  platform TEXT DEFAULT 'TELEGRAM'
);
```

## 5. Development Roadmap

### Phase 1: Foundation
- [ ] Setup Next.js 16.1 & Neon DB.
- [ ] Implement Google Auth.
- [ ] Integrate Telegram Bot Webhooks.

### Phase 2: The Cognitive Engine
- [ ] Integrate Gemini 3 Pro via Vercel AI SDK.
- [ ] Build "Patient File Review" (RAG retrieval logic).
- [ ] **Implement SOAP Note Summarizer (Background Job).**

### Phase 3: Agent Lifecycle (The "Wake Up")
- [ ] Setup Inngest/Cron for the "Wake Up" event.
- [ ] Implement scheduling logic to fetch daily appointments.
- [ ] **Build Progress Dashboard (Chart.js/Recharts for GAD-7 scores).**
- [ ] **Implement Crisis Detection Guardrails.**

### Phase 4: Polish & Deployment
- [ ] Build Dashboard for setting schedules/time slots.
- [ ] Create "Homework" UI/Bot commands.
- [ ] Deploy to Vercel with Webhook listeners active.
