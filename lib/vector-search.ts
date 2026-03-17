import { GoogleGenAI } from "@google/genai";
import { db } from "./db";
import { clinicalNotes } from "./schema";
import { eq, sql } from "drizzle-orm";

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error('API_KEY missing');

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: { parts: [{ text }] }
  });

  return response.embeddings?.[0]?.values || [];
}

export async function searchSimilarNotes(userId: string, query: string, limit: number = 5): Promise<any[]> {
  const queryEmbedding = await generateEmbedding(query);

  // Use pgvector cosine similarity operator <=>
  const results = await db
    .select()
    .from(clinicalNotes)
    .where(eq(clinicalNotes.userId, userId))
    .orderBy(sql`${clinicalNotes.summaryEmbedding} <=> ${JSON.stringify(queryEmbedding)}`)
    .limit(limit);

  return results;
}