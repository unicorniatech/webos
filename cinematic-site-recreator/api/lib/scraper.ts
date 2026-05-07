import * as cheerio from 'cheerio'
import type { ScrapedPage } from './types.js'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

export async function scrapePage(url: string): Promise<ScrapedPage> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const $ = cheerio.load(await res.text())
  $('script,style,noscript,iframe,svg').remove()

  const collect = (sel: string, max = 15, maxLen = 200) => {
    const out: string[] = []
    $(sel).each((_, el) => { const t = $(el).text().trim(); if (t && t.length < maxLen) out.push(t) })
    return [...new Set(out)].slice(0, max)
  }

  const colorHints: string[] = []
  const styleContent = $('[style]').map((_, el) => $(el).attr('style') ?? '').get().join(' ')
  const found = styleContent.match(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g) ?? []
  colorHints.push(...[...new Set(found)].slice(0, 8))

  return {
    url,
    title: $('title').text().trim() || $('h1').first().text().trim(),
    description: $('meta[name="description"]').attr('content')?.trim() || $('meta[property="og:description"]').attr('content')?.trim() || '',
    headings: collect('h1,h2,h3', 20),
    navItems: collect('nav a,header a', 12, 60),
    bodyText: $('main,article,section,body').first().text().replace(/\s+/g, ' ').trim().slice(0, 4000),
    ctaTexts: collect('button,a[class*="btn"],a[class*="cta"]', 10, 80),
    imageAlts: collect('img[alt]', 10, 120),
    colorHints,
  }
}
