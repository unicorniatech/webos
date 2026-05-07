import OpenAI from 'openai'
import type { ScrapedPage, AnalysisResult } from './types'
import { SYSTEM_PROMPT, buildPrompt } from './prompt'

export async function analyzeWithOpenAI(page: ScrapedPage): Promise<AnalysisResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const res = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o',
    max_tokens: 8000,
    temperature: 0.4,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildPrompt(page) },
    ],
  })
  return JSON.parse(res.choices[0]?.message?.content ?? '{}') as AnalysisResult
}
