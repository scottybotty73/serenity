import { GoogleGenAI } from "@google/genai";
import { Message, ClinicalProfile, ClinicalNote } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const THERAPIST_SYSTEM_PROMPT = (profile: ClinicalProfile) => `
You are Serenity, an expert AI Psychotherapist. 
Your goal is to provide evidence-based support using CBT and DBT techniques.

PATIENT CONTEXT:
Name: ${profile.name}
Diagnoses: ${profile.diagnosis.join(', ')}
Key People: ${profile.keyPeople.map(p => `${p.name} (${p.relation})`).join(', ')}

CORE GUIDELINES:
1. Empathy: Be warm, validating, and non-judgmental.
2. Structure: Keep the session focused.
3. Safety: If you detect self-harm, prioritize safety planning.
4. Memory: Refer to previous context if available.

When responding, keep it concise (under 150 words) unless explaining a complex concept.
`;

export const generateTherapistResponse = async (history: Message[], userMessage: string, profile: ClinicalProfile): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    
    // Format history correctly for the new SDK
    const historyContent = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const chat = ai.chats.create({
      model: model,
      history: historyContent,
      config: {
        systemInstruction: THERAPIST_SYSTEM_PROMPT(profile),
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage({
      message: userMessage
    });

    return result.text || "I'm here. Can you tell me more?";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "I'm momentarily disconnected from my cognitive engine. Please give me a moment.";
  }
};

export const generateSOAPNote = async (messages: Message[]): Promise<ClinicalNote | null> => {
  if (messages.length < 2) return null;

  try {
    const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    
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

    const data = JSON.parse(response.text || '{}');
    
    return {
      id: uuidv4(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: data.type || 'Follow-up',
      subjective: data.subjective || '',
      objective: data.objective || '',
      assessment: data.assessment || '',
      plan: data.plan || '',
      summary: data.summary || ''
    };
  } catch (e) {
    console.error("SOAP Note Generation failed", e);
    return null;
  }
};

export const updateProfileFromSession = async (currentProfile: ClinicalProfile, messages: Message[]): Promise<ClinicalProfile> => {
  try {
    const transcript = messages.slice(-10).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

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

    const updated = JSON.parse(response.text || '{}');
    if (updated.name && updated.diagnosis) {
        return updated;
    }
    return currentProfile;
  } catch (e) {
    console.error("Profile update failed", e);
    return currentProfile;
  }
};

export const generateMorningBriefing = async (appointments: any[], profile: ClinicalProfile): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are an AI assistant for a therapist. 
            Generate a short, 2-sentence morning status update for the dashboard.
            
            Context:
            - Agent Status: Just woke up
            - Upcoming Appointments: ${appointments.length}
            - Primary Patient: ${profile.name} (Diagnosis: ${profile.diagnosis.join(', ')})
            `,
        });
        return response.text || "System ready.";
    } catch (e) {
        return "System online. Ready for sessions.";
    }
}