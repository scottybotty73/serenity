import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Message } from '../types';

// Initialize the client. The API_KEY is expected to be in the environment.
// In a real Next.js app, this would be server-side.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const THERAPIST_SYSTEM_PROMPT = `
You are Serenity, an expert AI Psychotherapist. 
Your goal is to provide evidence-based support using CBT (Cognitive Behavioral Therapy) and DBT (Dialectical Behavior Therapy) techniques.

CORE GUIDELINES:
1. Empathy: Be warm, validating, and non-judgmental.
2. Curiosity: Ask probing questions to understand the root cause of distress.
3. Structure: Keep the session focused. If the user spirals, gently bring them back to the present moment or the topic at hand.
4. Safety: If you detect self-harm or violence, you MUST prioritize safety planning and provide resources immediately.

CONTEXT:
Patient: Alex Thompson
Diagnosis: GAD, Mild Depression.
Current Stressor: Work presentation.

When responding, keep it concise (under 150 words) unless explaining a complex concept.
`;

export const generateTherapistResponse = async (history: Message[], userMessage: string): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview'; // Using the latest model as per guidelines
    
    // Construct the conversation history for the model
    // Note: In a real app, we would map this to the specific content format expected by the SDK
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: THERAPIST_SYSTEM_PROMPT,
        temperature: 0.7, // Slightly creative for empathy, but stable
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
      },
    });

    // In a real scenario, we would replay history here. 
    // For this stateless prototype, we'll just send the last user message + context.
    // Ideally, we use chat.sendMessage for the turn-by-turn.
    
    const result = await chat.sendMessage({
      message: userMessage
    });

    return result.text || "I'm listening. Could you tell me more?";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "I'm having a little trouble connecting to my cognitive engine right now. But I'm here. How are you feeling in this moment?";
  }
};

export const performClinicalAnalysis = async (sessionTranscript: string) => {
    // This would run as a background job in the real app to generate SOAP notes
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze this therapy session transcript and output a JSON object with:
            1. subjective (patient's reported state)
            2. objective (observable facts)
            3. assessment (clinical impression)
            4. plan (next steps)
            
            Transcript: ${sessionTranscript}`,
            config: {
                responseMimeType: "application/json"
            }
        });
        return response.text;
    } catch (e) {
        console.error("Analysis failed", e);
        return null;
    }
}
