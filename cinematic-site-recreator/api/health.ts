import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const pref = process.env.AI_PROVIDER ?? 'auto'
  const active =
    pref !== 'auto' ? pref :
    process.env.GOOGLE_AI_API_KEY ? 'gemini' :
    process.env.ANTHROPIC_API_KEY ? 'claude' :
    process.env.OPENAI_API_KEY ? 'openai' : 'mock'

  res.json({
    status: 'ok',
    active_provider: active,
    gemini: !!process.env.GOOGLE_AI_API_KEY,
    gemini_model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString(),
  })
}
