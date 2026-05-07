import OpenAI from 'openai'
import type { ScrapedPage, AnalysisResult } from '../types/index.js'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are a senior brand analyst, UX strategist, and creative director.
You receive scraped website data and return a COMPLETE, VALID JSON object that matches the schema exactly.
Return ONLY the JSON object — no markdown fences, no explanation, no extra text.
All string arrays must have at least 3 items. All color hex values must be valid 6-digit hex codes.`

function buildUserPrompt(page: ScrapedPage): string {
  return `Analyze this website and return the full analysis as JSON.

WEBSITE DATA:
URL: ${page.url}
Title: ${page.title}
Description: ${page.description}
Headings: ${page.headings.join(' | ')}
Navigation: ${page.navItems.join(' | ')}
CTAs found: ${page.ctaTexts.join(' | ')}
Image descriptions: ${page.imageAlts.join(' | ')}
Colors detected: ${page.colorHints.join(', ') || 'none detected'}
Body text sample: ${page.bodyText.slice(0, 2000)}

Return this exact JSON structure (fill every field with real analysis — no placeholders):

{
  "websiteAnalysis": {
    "url": "${page.url}",
    "brand": {
      "businessName": "string",
      "industry": "string",
      "offer": "string",
      "targetAudience": "string",
      "personality": "string",
      "emotionalTone": "string",
      "trustSignals": ["string", "string", "string"],
      "differentiators": ["string", "string", "string"]
    },
    "visual": {
      "primaryColor": "#hex",
      "secondaryColor": "#hex",
      "accentColor": "#hex",
      "backgroundColor": "#hex",
      "typographyStyle": "string",
      "imageStyle": "string",
      "borderRadius": "string",
      "motionStyle": "string"
    },
    "sections": ["string x6+"],
    "mainCTA": "string",
    "secondaryCTA": "string",
    "frictionPoints": ["string", "string", "string"],
    "opportunities": ["string", "string", "string"]
  },
  "brandCard": {
    "summary": "string",
    "positioning": "string",
    "colors": [
      { "name": "Primary", "hex": "#hex", "usage": "string" },
      { "name": "Secondary", "hex": "#hex", "usage": "string" },
      { "name": "Accent", "hex": "#hex", "usage": "string" },
      { "name": "Background", "hex": "#hex", "usage": "string" },
      { "name": "Surface", "hex": "#hex", "usage": "string" },
      { "name": "Text Primary", "hex": "#hex", "usage": "string" },
      { "name": "Text Secondary", "hex": "#hex", "usage": "string" }
    ],
    "typography": { "heading": "string", "body": "string", "accent": "string" },
    "uiDirection": "string",
    "toneOfVoice": "string",
    "heroHeadlines": ["string", "string", "string", "string"],
    "taglines": ["string", "string", "string"],
    "ctas": ["string", "string", "string", "string"],
    "motionDirection": "string"
  },
  "cinematicConcepts": [
    { "id": 1, "title": "string", "description": "string", "cameraMovement": "string", "scrollBehavior": "string", "emotionalIntent": "string", "imagePrompt": "string (50+ words)", "videoPrompt": "string (50+ words)", "bestUseCase": "string", "icon": "✦" },
    { "id": 2, "title": "string", "description": "string", "cameraMovement": "string", "scrollBehavior": "string", "emotionalIntent": "string", "imagePrompt": "string (50+ words)", "videoPrompt": "string (50+ words)", "bestUseCase": "string", "icon": "→" },
    { "id": 3, "title": "string", "description": "string", "cameraMovement": "string", "scrollBehavior": "string", "emotionalIntent": "string", "imagePrompt": "string (50+ words)", "videoPrompt": "string (50+ words)", "bestUseCase": "string", "icon": "◎" }
  ],
  "buildPlan": {
    "conceptName": "string",
    "stack": ["Vite 5", "React 18", "TypeScript 5", "TailwindCSS 3", "Framer Motion 11"],
    "sections": [
      { "name": "string", "description": "string", "components": ["string", "string"], "priority": "high" },
      { "name": "string", "description": "string", "components": ["string", "string"], "priority": "high" },
      { "name": "string", "description": "string", "components": ["string", "string"], "priority": "medium" },
      { "name": "string", "description": "string", "components": ["string", "string"], "priority": "medium" },
      { "name": "string", "description": "string", "components": ["string", "string"], "priority": "low" }
    ],
    "estimatedTime": "string",
    "checklist": ["○ item x6"]
  },
  "copywritingMap": {
    "entries": [
      { "section": "Hero", "originalIntent": "string", "improvedCopy": "string", "cta": "string", "notes": "string" },
      { "section": "Brand Story", "originalIntent": "string", "improvedCopy": "string", "cta": "string", "notes": "string" },
      { "section": "Services", "originalIntent": "string", "improvedCopy": "string", "cta": "string", "notes": "string" },
      { "section": "Process", "originalIntent": "string", "improvedCopy": "string", "cta": "string", "notes": "string" },
      { "section": "Social Proof", "originalIntent": "string", "improvedCopy": "string", "cta": "string", "notes": "string" },
      { "section": "Final CTA", "originalIntent": "string", "improvedCopy": "string", "cta": "string", "notes": "string" }
    ]
  },
  "deploymentGuide": {
    "steps": [
      { "title": "Install dependencies", "command": "npm install", "description": "Install all project dependencies" },
      { "title": "Start dev server", "command": "npm run dev", "description": "Opens http://localhost:5173" },
      { "title": "Build for production", "command": "npm run build", "description": "Generates optimized files in /dist" },
      { "title": "Deploy to Vercel", "command": "vercel --prod", "description": "Requires Vercel CLI installed" }
    ],
    "platforms": ["Vercel", "Netlify", "Cloudflare Pages", "Railway"],
    "envVars": ["VITE_API_URL", "VITE_ANALYTICS_ID"],
    "notes": "string"
  }
}`
}

export async function analyzeWithOpenAI(page: ScrapedPage): Promise<AnalysisResult> {
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o',
    max_tokens: 8000,
    temperature: 0.4,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(page) },
    ],
  })

  const text = response.choices[0]?.message?.content ?? ''

  try {
    return JSON.parse(text) as AnalysisResult
  } catch {
    throw new Error(`OpenAI returned invalid JSON: ${text.slice(0, 200)}`)
  }
}
