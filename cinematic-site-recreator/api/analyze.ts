import type { VercelRequest, VercelResponse } from '@vercel/node'
import { scrapePage } from './lib/scraper.js'
import { analyzeWithClaude } from './lib/claude.js'
import { analyzeWithOpenAI } from './lib/openai.js'
import { generateMockResult } from './lib/mock.js'

export const maxDuration = 60

function pickProvider(): 'claude' | 'openai' | null {
  const pref = process.env.AI_PROVIDER ?? 'auto'
  if (pref === 'claude') return process.env.ANTHROPIC_API_KEY ? 'claude' : null
  if (pref === 'openai') return process.env.OPENAI_API_KEY ? 'openai' : null
  if (process.env.ANTHROPIC_API_KEY) return 'claude'
  if (process.env.OPENAI_API_KEY) return 'openai'
  return null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { url, mock } = req.body as { url?: string; mock?: boolean }
  if (!url) return res.status(400).json({ error: 'url is required' })

  const normalized = url.startsWith('http') ? url : `https://${url}`
  try { new URL(normalized) } catch { return res.status(400).json({ error: 'Invalid URL' }) }

  if (mock) return res.json({ result: generateMockResult(normalized), source: 'mock' })

  const provider = pickProvider()
  if (!provider) {
    return res.json({ result: generateMockResult(normalized), source: 'mock', warning: 'No API keys set' })
  }

  try {
    console.log(`[analyze] Scraping: ${normalized}`)
    const page = await scrapePage(normalized)
    console.log(`[analyze] Calling ${provider}...`)
    const result = provider === 'claude' ? await analyzeWithClaude(page) : await analyzeWithOpenAI(page)
    return res.json({ result, source: provider })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[analyze] ${provider} error: ${msg}`)

    const fallback = provider === 'claude' && process.env.OPENAI_API_KEY ? 'openai'
      : provider === 'openai' && process.env.ANTHROPIC_API_KEY ? 'claude' : null

    if (fallback) {
      try {
        const page = await scrapePage(normalized)
        const result = fallback === 'claude' ? await analyzeWithClaude(page) : await analyzeWithOpenAI(page)
        return res.json({ result, source: fallback, warning: `${provider} failed, used ${fallback}` })
      } catch { /* fall through */ }
    }

    return res.json({ result: generateMockResult(normalized), source: 'mock-fallback', warning: msg })
  }
}
