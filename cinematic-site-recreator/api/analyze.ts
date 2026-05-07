import type { VercelRequest, VercelResponse } from '@vercel/node'
import { scrapePage } from './lib/scraper.js'
import { analyzeWithGemini } from './lib/gemini.js'
import { analyzeWithClaude } from './lib/claude.js'
import { analyzeWithOpenAI } from './lib/openai.js'
import { generateMockResult } from './lib/mock.js'

export const maxDuration = 60

type Provider = 'gemini' | 'claude' | 'openai'

function pickProvider(): Provider | null {
  const pref = process.env.AI_PROVIDER ?? 'auto'

  if (pref === 'gemini') return process.env.GOOGLE_AI_API_KEY ? 'gemini' : null
  if (pref === 'claude') return process.env.ANTHROPIC_API_KEY ? 'claude' : null
  if (pref === 'openai') return process.env.OPENAI_API_KEY ? 'openai' : null

  // auto: Gemini → Claude → OpenAI
  if (process.env.GOOGLE_AI_API_KEY) return 'gemini'
  if (process.env.ANTHROPIC_API_KEY) return 'claude'
  if (process.env.OPENAI_API_KEY) return 'openai'
  return null
}

async function runAnalysis(provider: Provider, url: string) {
  const page = await scrapePage(url)
  if (provider === 'gemini') return { result: await analyzeWithGemini(page), source: 'gemini' }
  if (provider === 'claude') return { result: await analyzeWithClaude(page), source: 'claude' }
  return { result: await analyzeWithOpenAI(page), source: 'openai' }
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
    return res.json({ result: generateMockResult(normalized), source: 'mock', warning: 'No API keys configured' })
  }

  try {
    console.log(`[analyze] Scraping ${normalized} → ${provider}`)
    const data = await runAnalysis(provider, normalized)
    console.log(`[analyze] Done — source: ${data.source}`)
    return res.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[analyze] ${provider} failed: ${msg}`)

    // Try fallbacks in order
    const fallbacks: Provider[] = ['gemini', 'claude', 'openai'].filter(p => p !== provider) as Provider[]
    const keyMap: Record<Provider, string | undefined> = {
      gemini: process.env.GOOGLE_AI_API_KEY,
      claude: process.env.ANTHROPIC_API_KEY,
      openai: process.env.OPENAI_API_KEY,
    }

    for (const fb of fallbacks) {
      if (!keyMap[fb]) continue
      try {
        console.log(`[analyze] Trying fallback: ${fb}`)
        const data = await runAnalysis(fb, normalized)
        return res.json({ ...data, warning: `${provider} failed, used ${fb}` })
      } catch { continue }
    }

    console.log('[analyze] All providers failed — mock fallback')
    return res.json({ result: generateMockResult(normalized), source: 'mock-fallback', warning: msg })
  }
}
