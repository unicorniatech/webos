import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.json({
    status: 'ok',
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    google: !!process.env.GOOGLE_AI_API_KEY,
    provider: process.env.AI_PROVIDER ?? 'auto',
    model: process.env.OPENAI_MODEL ?? 'gpt-4o',
    timestamp: new Date().toISOString(),
  })
}
