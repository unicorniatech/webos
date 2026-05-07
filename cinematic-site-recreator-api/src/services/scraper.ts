import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import type { ScrapedPage } from '../types/index.js'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

export async function scrapePage(url: string): Promise<ScrapedPage> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(12000),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)

  const html = await res.text()
  const $ = cheerio.load(html)

  // Remove noise
  $('script, style, noscript, iframe, svg').remove()

  const title = $('title').text().trim() || $('h1').first().text().trim()
  const description =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim() ||
    ''

  const headings: string[] = []
  $('h1, h2, h3').each((_, el) => {
    const t = $(el).text().trim()
    if (t && t.length < 200) headings.push(t)
  })

  const navItems: string[] = []
  $('nav a, header a').each((_, el) => {
    const t = $(el).text().trim()
    if (t && t.length < 60) navItems.push(t)
  })

  const ctaTexts: string[] = []
  $('button, a[class*="btn"], a[class*="cta"], [class*="button"]').each((_, el) => {
    const t = $(el).text().trim()
    if (t && t.length < 80) ctaTexts.push(t)
  })

  const imageAlts: string[] = []
  $('img[alt]').each((_, el) => {
    const alt = $(el).attr('alt')?.trim()
    if (alt && alt.length > 2 && alt.length < 120) imageAlts.push(alt)
  })

  // Gather inline color hints from style attributes
  const colorHints: string[] = []
  const colorRx = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g
  const styleContent = $('[style]')
    .map((_, el) => $(el).attr('style') ?? '')
    .get()
    .join(' ')
  const found = styleContent.match(colorRx) ?? []
  colorHints.push(...[...new Set(found)].slice(0, 8))

  // Main readable text (capped at 4000 chars for Claude context efficiency)
  const bodyText = $('main, article, section, .content, body')
    .first()
    .text()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000)

  return {
    url,
    title,
    description,
    headings: [...new Set(headings)].slice(0, 20),
    navItems: [...new Set(navItems)].slice(0, 12),
    bodyText,
    ctaTexts: [...new Set(ctaTexts)].slice(0, 10),
    imageAlts: [...new Set(imageAlts)].slice(0, 10),
    colorHints,
  }
}
