import OpenAI from 'openai'
import type { ScrapedPage } from './types'
import type { AnalysisResult } from '../types'
import { buildAnalysisPrompt, SYSTEM_PROMPT } from './prompt'

export async function analyzeWithOpenAI(page: ScrapedPage): Promise<AnalysisResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o',
    max_tokens: 8000,
    temperature: 0.4,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildAnalysisPrompt(page) },
    ],
  })

  const text = response.choices[0]?.message?.content ?? ''

  try {
    return JSON.parse(text) as AnalysisResult
  } catch {
    throw new Error(`OpenAI returned invalid JSON: ${text.slice(0, 200)}`)
  }
}
