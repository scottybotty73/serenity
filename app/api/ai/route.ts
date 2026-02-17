import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const THERAPIST_SYSTEM_PROMPT = (profile: any) => `
You are Serenity, an expert AI Psychotherapist.
Your goal is to provide evidence-based support using CBT and DBT techniques.

PATIENT CONTEXT:
Name: ${profile.name}
Diagnoses: ${profile.diagnosis?.join(', ')}
Key People: ${profile.keyPeople?.map((p: any) => `${p.name} (${p.relation})`).join(', ')}

CORE GUIDELINES:
1. Empathy: Be warm, validating, and non-judgmental.
2. Structure: Keep the session focused.
3. Safety: If you detect self-harm, prioritize safety planning.
4. Memory: Refer to previous context if available.

When responding, keep it concise (under 150 words) unless explaining a complex concept.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. Chat Response
    if (action === 'chat') {
        const { history, userMessage, profile } = body;
        
        const historyContent = history.map((msg: any) => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        const chat = ai.chats.create({
            model: 'gemini-3-pro-preview',
            history: historyContent,
            config: {
                systemInstruction: THERAPIST_SYSTEM_PROMPT(profile),
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage({ message: userMessage });
        return NextResponse.json({ text: result.text });
    }

    // 2. SOAP Note Generation
    if (action === 'soap') {
        const { messages } = body;
        const transcript = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a clinical SOAP note (JSON format) for this therapy session transcript.
            
            Transcript:
            ${transcript}
            
            Return JSON with keys: subjective, objective, assessment, plan, summary, type (Initial/Follow-up/Crisis).`,
            config: {
                responseMimeType: "application/json"
            }
        });
        return NextResponse.json({ text: response.text });
    }

    // 3. Profile Update
    if (action === 'profile_update') {
        const { currentProfile, messages } = body;
        const transcript = messages.slice(-10).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze this recent conversation and update the clinical profile JSON.
            Only add NEW information. Do not remove existing valid data.
            
            Current Profile: ${JSON.stringify(currentProfile)}
            
            Recent Conversation:
            ${transcript}
            
            Return the fully updated ClinicalProfile JSON object.`,
            config: {
                responseMimeType: "application/json"
            }
        });
        return NextResponse.json({ text: response.text });
    }

    // 4. Morning Briefing
    if (action === 'briefing') {
        const { appointments, profile } = body;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are an AI assistant for a therapist. 
            Generate a short, 2-sentence morning status update for the dashboard.
            
            Context:
            - Agent Status: Just woke up
            - Upcoming Appointments: ${appointments.length}
            - Primary Patient: ${profile.name} (Diagnosis: ${profile.diagnosis?.join(', ')})
            `,
        });
        return NextResponse.json({ text: response.text });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}