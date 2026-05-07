import type { VercelRequest, VercelResponse } from '@vercel/node'
import { scrapePage } from '../src/server/scraper'
import { analyzeWithClaude } from '../src/server/claude'
import { analyzeWithOpenAI } from '../src/server/openai'
import { generateMockResult } from '../src/server/mock'

function pickProvider(): 'claude' | 'openai' | null {
  const pref = process.env.AI_PROVIDER ?? 'auto'
  if (pref === 'claude') return process.env.ANTHROPIC_API_KEY ? 'claude' : null
  if (pref === 'openai') return process.env.OPENAI_API_KEY ? 'openai' : null
  // auto
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
  try { new URL(normalized) } catch {
    return res.status(400).json({ error: 'Invalid URL format' })
  }

  if (mock) {
    return res.json({ result: generateMockResult(normalized), source: 'mock' })
  }

  const provider = pickProvider()

  if (!provider) {
    return res.json({
      result: generateMockResult(normalized),
      source: 'mock',
      warning: 'No API keys configured — set ANTHROPIC_API_KEY or OPENAI_API_KEY in Vercel',
    })
  }

  try {
    console.log(`[analyze] Scraping: ${normalized}`)
    const page = await scrapePage(normalized)
    console.log(`[analyze] Calling ${provider}...`)

    const result = provider === 'claude'
      ? await analyzeWithClaude(page)
      : await analyzeWithOpenAI(page)

    return res.json({ result, source: provider })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[analyze] ${provider} failed: ${message}`)

    // Try the other provider as fallback
    const fallback = provider === 'claude' && process.env.OPENAI_API_KEY ? 'openai'
      : provider === 'openai' && process.env.ANTHROPIC_API_KEY ? 'claude'
      : null

    if (fallback) {
      try {
        const page = await scrapePage(normalized)
        const result = fallback === 'claude'
          ? await analyzeWithClaude(page)
          : await analyzeWithOpenAI(page)
        return res.json({ result, source: fallback, warning: `${provider} failed, used ${fallback}` })
      } catch { /* fall through to mock */ }
    }

    console.log('[analyze] Falling back to mock')
    return res.json({ result: generateMockResult(normalized), source: 'mock-fallback', warning: message })
  }
}
