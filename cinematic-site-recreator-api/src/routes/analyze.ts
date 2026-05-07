import { Hono } from 'hono'
import { scrapePage } from '../services/scraper.js'
import { analyzeWithClaude } from '../services/claude.js'
import { analyzeWithOpenAI } from '../services/openai.js'
import { generateMockResult } from '../services/mock.js'

export const analyzeRouter = new Hono()

type Provider = 'claude' | 'openai' | 'auto'

function pickProvider(requested: Provider): 'claude' | 'openai' | null {
  if (requested === 'claude') {
    return process.env.ANTHROPIC_API_KEY ? 'claude' : null
  }
  if (requested === 'openai') {
    return process.env.OPENAI_API_KEY ? 'openai' : null
  }
  // auto: prefer Claude, fallback to OpenAI
  if (process.env.ANTHROPIC_API_KEY) return 'claude'
  if (process.env.OPENAI_API_KEY) return 'openai'
  return null
}

analyzeRouter.post('/', async c => {
  const body = await c.req.json<{
    url: string
    provider?: Provider
    mock?: boolean
  }>()

  if (!body.url) return c.json({ error: 'url is required' }, 400)

  const url = body.url.startsWith('http') ? body.url : `https://${body.url}`
  try { new URL(url) } catch {
    return c.json({ error: 'Invalid URL format' }, 400)
  }

  // Force mock mode
  if (body.mock === true) {
    return c.json({ result: generateMockResult(url), source: 'mock' })
  }

  const provider = pickProvider(body.provider ?? 'auto')

  if (!provider) {
    console.log('[analyze] No API keys found — returning mock')
    return c.json({ result: generateMockResult(url), source: 'mock', warning: 'No API keys configured' })
  }

  try {
    console.log(`[analyze] Scraping: ${url}`)
    const page = await scrapePage(url)
    console.log(`[analyze] Scraped "${page.title}" — calling ${provider}...`)

    const result = provider === 'claude'
      ? await analyzeWithClaude(page)
      : await analyzeWithOpenAI(page)

    return c.json({ result, source: provider })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[analyze] ${provider} failed: ${message}`)

    // Try the other provider before giving up
    const fallbackProvider = provider === 'claude' && process.env.OPENAI_API_KEY
      ? 'openai'
      : provider === 'openai' && process.env.ANTHROPIC_API_KEY
      ? 'claude'
      : null

    if (fallbackProvider) {
      try {
        console.log(`[analyze] Trying fallback: ${fallbackProvider}`)
        const page = await scrapePage(url)
        const result = fallbackProvider === 'claude'
          ? await analyzeWithClaude(page)
          : await analyzeWithOpenAI(page)
        return c.json({ result, source: fallbackProvider, warning: `Primary (${provider}) failed, used fallback` })
      } catch (fallbackErr) {
        console.error(`[analyze] Fallback also failed: ${fallbackErr}`)
      }
    }

    console.log('[analyze] All providers failed — returning mock')
    return c.json({ result: generateMockResult(url), source: 'mock-fallback', warning: message })
  }
})
