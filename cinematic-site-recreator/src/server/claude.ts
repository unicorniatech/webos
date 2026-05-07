import Anthropic from '@anthropic-ai/sdk'
import type { ScrapedPage } from './types'
import type { AnalysisResult } from '../types'
import { buildAnalysisPrompt, SYSTEM_PROMPT } from './prompt'

export async function analyzeWithClaude(page: ScrapedPage): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildAnalysisPrompt(page) }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    return JSON.parse(clean) as AnalysisResult
  } catch {
    throw new Error(`Claude returned invalid JSON: ${clean.slice(0, 200)}`)
  }
}
