import { GoogleGenAI } from '@google/genai'
import type { ScrapedPage, AnalysisResult } from './types.js'
import { SYSTEM_PROMPT, buildPrompt } from './prompt.js'

export async function analyzeWithGemini(page: ScrapedPage): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY ?? '' })

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
    contents: buildPrompt(page),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      temperature: 0.4,
      maxOutputTokens: 8000,
    },
  })

  const text = response.text()
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    return JSON.parse(clean) as AnalysisResult
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${clean.slice(0, 200)}`)
  }
}
