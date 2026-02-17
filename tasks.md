# Serenity AI - Task Tracker

## 1. Project Initialization & Infrastructure
- [x] **Project Scaffolding**: Setup React/Next.js folder structure.
- [x] **UI Component Library**: Tailwind CSS configuration and basic styling.
- [x] **Component System**: Install Shadcn UI (Card, Button, Badge).
- [x] **Next.js Migration**: Remove Vite artifacts (`index.html`, `vite.config.ts`, etc).
- [x] **Database Setup**: Initialize Neon (PostgreSQL) project (Drivers Installed).
- [x] **ORM Configuration**: Setup Drizzle ORM and define schema in code.
- [x] **Environment Variables**: Instructions added.

## 2. Authentication & User Management
- [x] **NextAuth Setup**: Configure Google Provider (v5) and Drizzle Adapter.
- [x] **Protected Routes**: Client-side session check implemented in `App`.
- [x] **User Onboarding**: Auto-seed Mock Data for new users via Server Actions.

## 3. Database Schema Implementation
- [x] **Users Table**: Store patient and therapist metadata (Updated to UUID).
- [x] **Patient Profile**: Create JSONB structures for `key_people`, `trauma_timeline`.
- [x] **Clinical Notes**: Table with `vector(768)` support for embeddings.
- [x] **Appointments**: Scheduling table.
- [x] **Chat History**: Added `messages` table for unified logs.

## 4. AI & Cognitive Engine (Backend)
- [x] **Gemini Client**: Basic client setup (`services/ai.ts`).
- [x] **Server Actions**: Move AI calls from client-side to Next.js API Routes for security.
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
- [x] **Data Binding**: Replaced `mockData.ts` with real data fetching via Server Actions.
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