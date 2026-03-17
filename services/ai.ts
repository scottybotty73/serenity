import { Message, ClinicalProfile, ClinicalNote } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper to handle API requests
const callAiApi = async (payload: any) => {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return await response.json();
};

export const generateTherapistResponse = async (history: Message[], userMessage: string, profile: ClinicalProfile): Promise<{text: string, isCrisis: boolean}> => {
  try {
    const data = await callAiApi({ 
      action: 'chat', 
      history, 
      userMessage, 
      profile 
    });
    return { text: data.text || "I'm having trouble connecting to my cognitive core.", isCrisis: data.isCrisis || false };
  } catch (error) {
    console.error("AI Service Error:", error);
    return { text: "I'm momentarily disconnected. Please try again.", isCrisis: false };
  }
};

export const generateSOAPNote = async (messages: Message[]): Promise<ClinicalNote | null> => {
  if (messages.length < 2) return null;

  try {
    const { soap, embedding } = await callAiApi({ 
      action: 'soap', 
      messages 
    });
    
    return {
      id: uuidv4(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: soap.type || 'Follow-up',
      subjective: soap.subjective || '',
      objective: soap.objective || '',
      assessment: soap.assessment || '',
      plan: soap.plan || '',
      summary: soap.summary || '',
      embedding: embedding
    };
  } catch (e) {
    console.error("SOAP Note Generation failed", e);
    return null;
  }
};

export const updateProfileFromSession = async (currentProfile: ClinicalProfile, messages: Message[]): Promise<ClinicalProfile> => {
  try {
    const { text } = await callAiApi({ 
      action: 'profile_update', 
      currentProfile, 
      messages 
    });

    const updated = JSON.parse(text || '{}');
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
        const { text } = await callAiApi({ 
            action: 'briefing', 
            appointments, 
            profile 
        });
        return text || "System ready.";
    } catch (e) {
        return "System online. Ready for sessions.";
    }
}