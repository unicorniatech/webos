import { generateMockResult } from '../data/mockGenerator'
import type { AnalysisResult } from '../types'

// Uses relative /api/ — works on Vercel and local (with vite proxy)
const API_BASE = import.meta.env.VITE_API_URL ?? ''

export async function analyzeWebsite(url: string): Promise<AnalysisResult> {
  try {
    const res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(60_000),
    })

    if (!res.ok) throw new Error(`API ${res.status}`)

    const data = await res.json() as { result: AnalysisResult; source: string; warning?: string }
    if (data.warning) console.warn('[analyzer]', data.warning)
    console.info('[analyzer] source:', data.source)
    return data.result
  } catch (err) {
    console.warn('[analyzer] API unavailable, using local mock:', err)
    await new Promise(r => setTimeout(r, 2200))
    return generateMockResult(url)
  }
}

export async function generateConceptImage(prompt: string, conceptId: number) {
  try {
    const res = await fetch(`${API_BASE}/api/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, conceptId, aspectRatio: '16:9' }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) return null
    return res.json() as Promise<{ base64: string; mimeType: string }>
  } catch { return null }
}

export function validateUrl(url: string): { valid: boolean; normalized: string; error?: string } {
  const trimmed = url.trim()
  if (!trimmed) return { valid: false, normalized: '', error: 'Please enter a URL' }
  const withProtocol = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(withProtocol)
    if (!parsed.hostname || !parsed.hostname.includes('.'))
      return { valid: false, normalized: '', error: 'Please enter a valid domain (e.g. apple.com)' }
    return { valid: true, normalized: withProtocol }
  } catch {
    return { valid: false, normalized: '', error: 'Invalid URL format' }
  }
}
