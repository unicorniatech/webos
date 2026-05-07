import Anthropic from '@anthropic-ai/sdk'
import type { ScrapedPage, AnalysisResult } from './types'
import { SYSTEM_PROMPT, buildPrompt } from './prompt'

export async function analyzeWithClaude(page: ScrapedPage): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPrompt(page) }],
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  return JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()) as AnalysisResult
}
