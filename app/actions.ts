'use server';

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users, patientProfile, clinicalNotes, messages, appointments } from "@/lib/schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { MOCK_PROFILE, MOCK_APPOINTMENTS, MOCK_NOTES, INITIAL_MESSAGES } from "@/mockData";
import { ClinicalProfile, Message, ClinicalNote, Appointment } from "@/types";

// Helper to get current user ID or throw
async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

// --- PROFILE ACTIONS ---

export async function getPatientProfile(): Promise<ClinicalProfile | null> {
  const userId = await getUserId();
  
  const profile = await db.query.patientProfile.findFirst({
    where: eq(patientProfile.userId, userId),
  });

  if (!profile) {
    // SEED DATA: If no profile exists, create one from MOCK_PROFILE for the demo
    const newProfile = {
        userId,
        keyPeople: MOCK_PROFILE.keyPeople,
        medications: MOCK_PROFILE.medications,
        diagnoses: MOCK_PROFILE.diagnosis, // Note mapping difference
        traumaTimeline: [] // Default empty
    };
    
    await db.insert(patientProfile).values(newProfile);
    
    // Return the mock structure
    return MOCK_PROFILE;
  }

  // Map DB result to ClinicalProfile type
  return {
    name: (await db.query.users.findFirst({ where: eq(users.id, userId) }))?.name || 'Patient',
    age: 32, // Hardcoded for now, or store DOB in users
    diagnosis: (profile.diagnoses as string[]) || [],
    medications: (profile.medications as string[]) || [],
    keyPeople: (profile.keyPeople as any[]) || [],
    lastAssessment: MOCK_PROFILE.lastAssessment // Keeping mock for assessment now
  };
}

export async function updatePatientProfile(profile: ClinicalProfile) {
    const userId = await getUserId();
    // We update the JSONB fields
    await db.update(patientProfile)
        .set({
            diagnoses: profile.diagnosis,
            medications: profile.medications,
            keyPeople: profile.keyPeople
        })
        .where(eq(patientProfile.userId, userId));
    
    revalidatePath('/');
}

// --- MESSAGE ACTIONS ---

export async function getMessages(): Promise<Message[]> {
  const userId = await getUserId();
  
  const dbMessages = await db.query.messages.findMany({
    where: eq(messages.userId, userId),
    orderBy: [asc(messages.createdAt)],
  });

  if (dbMessages.length === 0) {
    // SEED: Insert initial message
    for (const msg of INITIAL_MESSAGES) {
        await db.insert(messages).values({
            userId,
            role: msg.role,
            content: msg.content,
            createdAt: new Date(msg.timestamp)
        });
    }
    return INITIAL_MESSAGES;
  }

  return dbMessages.map(m => ({
    id: m.id.toString(),
    role: m.role as 'user' | 'model',
    content: m.content,
    timestamp: m.createdAt || new Date(),
    isCrisis: m.isCrisis || false
  }));
}

export async function saveMessage(message: Message) {
    const userId = await getUserId();
    await db.insert(messages).values({
        userId,
        role: message.role,
        content: message.content,
        isCrisis: message.isCrisis,
        createdAt: new Date(message.timestamp)
    });
}

// --- NOTE ACTIONS ---

export async function getClinicalNotes(): Promise<ClinicalNote[]> {
    const userId = await getUserId();
    const notes = await db.query.clinicalNotes.findMany({
        where: eq(clinicalNotes.userId, userId),
        orderBy: [desc(clinicalNotes.sessionDate)]
    });

    if (notes.length === 0) {
        // Seed Notes logic could go here, but let's leave notes empty or rely on client mock fallback if strictly needed
        // For now, let's return the DB state (which might be empty)
        return []; 
    }

    return notes.map(n => ({
        id: n.id.toString(),
        date: n.sessionDate ? new Date(n.sessionDate).toLocaleDateString() : '',
        type: (n.type as any) || 'Follow-up',
        subjective: n.subjective || '',
        objective: n.objective || '',
        assessment: n.assessment || '',
        plan: n.plan || '',
        summary: n.summary || ''
    }));
}

export async function saveClinicalNote(note: ClinicalNote) {
    const userId = await getUserId();
    await db.insert(clinicalNotes).values({
        userId,
        sessionDate: new Date(), // Use current time or parse note.date
        type: note.type,
        subjective: note.subjective,
        objective: note.objective,
        assessment: note.assessment,
        plan: note.plan,
        summary: note.summary
    });
    revalidatePath('/');
}

// --- APPOINTMENT ACTIONS ---

export async function getMyAppointments(): Promise<Appointment[]> {
    const userId = await getUserId();
    const apps = await db.query.appointments.findMany({
        where: eq(appointments.userId, userId),
        orderBy: [asc(appointments.scheduledTime)]
    });

    if (apps.length === 0) {
        // Seed Appointments
        // In a real app we wouldn't auto-seed appointments per user unless it's a demo
        // returning mock for now to keep UI populated if DB is empty
        return MOCK_APPOINTMENTS; 
    }

    return apps.map(a => ({
        id: a.id.toString(),
        patientName: 'Me', // The user is the patient
        time: a.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: (a.status as any) || 'PENDING',
        platform: (a.platform as any) || 'Telegram'
    }));
}