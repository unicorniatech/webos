import { generateMockResult } from '../data/mockGenerator'
import type { AnalysisResult } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function analyzeWebsite(url: string): Promise<AnalysisResult> {
  // Try real API first
  try {
    const res = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(60_000), // Claude + scraping can take ~15s
    })

    if (!res.ok) throw new Error(`API ${res.status}`)

    const data = await res.json() as { result: AnalysisResult; source: string; warning?: string }

    if (data.warning) {
      console.warn('[analyzer] Backend warning:', data.warning)
    }
    console.info(`[analyzer] Source: ${data.source}`)

    return data.result
  } catch (err) {
    // If backend is not running, silently fall back to local mock
    console.warn('[analyzer] Backend unavailable, using local mock:', err)
    await new Promise(r => setTimeout(r, 2200))
    return generateMockResult(url)
  }
}

export async function generateConceptImage(
  prompt: string,
  conceptId: number,
): Promise<{ base64: string; mimeType: string } | null> {
  try {
    const res = await fetch(`${API_URL}/api/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, conceptId, aspectRatio: '16:9' }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateConceptVideo(
  prompt: string,
  conceptId: number,
): Promise<{ operationName: string; status: string; videoUrl?: string } | null> {
  try {
    const res = await fetch(`${API_URL}/api/video/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, conceptId, durationSeconds: 8 }),
      signal: AbortSignal.timeout(360_000), // Video takes minutes
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export function validateUrl(url: string): {
  valid: boolean
  normalized: string
  error?: string
} {
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
