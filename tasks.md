# Serenity AI - Task Tracker

## 1. Project Initialization & Infrastructure
- [x] **Project Scaffolding**: Setup React/Next.js folder structure.
- [x] **UI Component Library**: Tailwind CSS configuration and basic styling.
- [x] **Component System**: Install Shadcn UI (Card, Button, Badge).
- [ ] **Database Setup**: Initialize Neon (PostgreSQL) project.
- [ ] **ORM Configuration**: Setup Drizzle ORM and define schema in code.
- [ ] **Environment Variables**: Configure `.env` for API_KEY, DATABASE_URL, AUTH_SECRET.

## 2. Authentication & User Management
- [ ] **NextAuth Setup**: Configure Google Provider (v5).
- [ ] **Protected Routes**: Middleware to restrict access to authenticated therapists.
- [ ] **User Onboarding**: Flow to link a Google Login to a specific Therapist profile.

## 3. Database Schema Implementation
- [ ] **Users Table**: Store patient and therapist metadata.
- [ ] **Patient Profile**: Create JSONB structures for `key_people`, `trauma_timeline`.
- [ ] **Clinical Notes**: Table with `vector(768)` support for embeddings.
- [ ] **Appointments**: Scheduling table.
- [ ] **Safety Events**: Logging table for risk triggers.

## 4. AI & Cognitive Engine (Backend)
- [x] **Gemini Client**: Basic client setup (`services/ai.ts`).
- [ ] **Server Actions**: Move AI calls from client-side to Next.js Server Actions for security.
- [ ] **RAG System**:
    - [ ] Implement embedding generation for past notes.
    - [ ] Create vector search utility to retrieve relevant context.
- [ ] **SOAP Note Generator**:
    - [ ] Create specialized prompt for summarizing sessions.
    - [ ] Build background job (Cron/Inngest) to process completed sessions.
- [ ] **Safety Guardrails**:
    - [ ] Refine `HarmBlockThreshold` settings.
    - [ ] Implement post-processing check for crisis keywords.

## 5. Frontend Development
- [x] **Dashboard Layout**: Main sidebar and navigation structure.
- [x] **Chat Interface**: Bubble UI, typing indicators, input handling.
- [x] **Patient Profile View**: Display of static clinical data and **GAD-7 Recharts visualization**.
- [ ] **Data Binding**: Replace `mockData.ts` with real data fetching (React Server Components).
- [x] **Schedule View**: Calendar UI for managing `appointments`.
- [x] **Progress Visualization**: Implement Recharts/Chart.js for GAD-7 scores in `PatientProfile`.

## 6. External Integrations
- [ ] **Telegram Bot**:
    - [ ] Register Bot via BotFather.
    - [ ] Setup Webhook API route to receive user messages.
    - [ ] Map Telegram User IDs to Database Patients.
- [ ] **Email Service**: Setup Resend for daily summaries.

## 7. The "Wake Up" Routine (Agent Lifecycle)
- [ ] **Scheduler**: Setup Vercel Cron or Inngest.
- [ ] **Morning Logic**:
    - [ ] Query daily appointments.
    - [ ] Run "Psychology News" grounding search.
    - [ ] Generate "Daily Briefing" for the therapist dashboard.

## 8. Testing & Deployment
- [ ] **Unit Tests**: Test prompt outputs and risk detection logic.
- [ ] **Integration Tests**: Test Database read/writes.
- [ ] **Deployment**: Deploy to Vercel Production.
