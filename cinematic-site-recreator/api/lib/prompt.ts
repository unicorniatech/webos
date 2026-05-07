import type { ScrapedPage } from './types'

export const SYSTEM_PROMPT = `You are a senior brand analyst, UX strategist, and creative director.
Return ONLY a valid JSON object matching the schema exactly. No markdown, no explanation.
All arrays need at least 3 items. All hex values must be valid 6-digit hex codes.`

export function buildPrompt(page: ScrapedPage): string {
  return `Analyze this website and return JSON:

URL: ${page.url}
Title: ${page.title}
Description: ${page.description}
Headings: ${page.headings.join(' | ')}
Nav: ${page.navItems.join(' | ')}
CTAs: ${page.ctaTexts.join(' | ')}
Images: ${page.imageAlts.join(' | ')}
Colors: ${page.colorHints.join(', ') || 'none'}
Body: ${page.bodyText.slice(0, 2000)}

Return this JSON (no placeholders — real analysis):
{
  "websiteAnalysis": {
    "url": "${page.url}",
    "brand": { "businessName":"","industry":"","offer":"","targetAudience":"","personality":"","emotionalTone":"","trustSignals":[],"differentiators":[] },
    "visual": { "primaryColor":"#hex","secondaryColor":"#hex","accentColor":"#hex","backgroundColor":"#hex","typographyStyle":"","imageStyle":"","borderRadius":"","motionStyle":"" },
    "sections": [],"mainCTA":"","secondaryCTA":"","frictionPoints":[],"opportunities":[]
  },
  "brandCard": {
    "summary":"","positioning":"",
    "colors": [{"name":"Primary","hex":"#hex","usage":""},{"name":"Secondary","hex":"#hex","usage":""},{"name":"Accent","hex":"#hex","usage":""},{"name":"Background","hex":"#hex","usage":""},{"name":"Surface","hex":"#hex","usage":""},{"name":"Text Primary","hex":"#hex","usage":""},{"name":"Text Secondary","hex":"#hex","usage":""}],
    "typography":{"heading":"","body":"","accent":""},"uiDirection":"","toneOfVoice":"",
    "heroHeadlines":[],"taglines":[],"ctas":[],"motionDirection":""
  },
  "cinematicConcepts": [
    {"id":1,"title":"","description":"","cameraMovement":"","scrollBehavior":"","emotionalIntent":"","imagePrompt":"","videoPrompt":"","bestUseCase":"","icon":"✦"},
    {"id":2,"title":"","description":"","cameraMovement":"","scrollBehavior":"","emotionalIntent":"","imagePrompt":"","videoPrompt":"","bestUseCase":"","icon":"→"},
    {"id":3,"title":"","description":"","cameraMovement":"","scrollBehavior":"","emotionalIntent":"","imagePrompt":"","videoPrompt":"","bestUseCase":"","icon":"◎"}
  ],
  "buildPlan": {
    "conceptName":"","stack":["Vite 5","React 18","TypeScript 5","TailwindCSS 3","Framer Motion 11"],
    "sections":[{"name":"","description":"","components":[],"priority":"high"},{"name":"","description":"","components":[],"priority":"high"},{"name":"","description":"","components":[],"priority":"medium"},{"name":"","description":"","components":[],"priority":"medium"},{"name":"","description":"","components":[],"priority":"low"}],
    "estimatedTime":"","checklist":[]
  },
  "copywritingMap": {
    "entries":[
      {"section":"Hero","originalIntent":"","improvedCopy":"","cta":"","notes":""},
      {"section":"Brand Story","originalIntent":"","improvedCopy":"","cta":"","notes":""},
      {"section":"Services","originalIntent":"","improvedCopy":"","cta":"","notes":""},
      {"section":"Process","originalIntent":"","improvedCopy":"","cta":"","notes":""},
      {"section":"Social Proof","originalIntent":"","improvedCopy":"","cta":"","notes":""},
      {"section":"Final CTA","originalIntent":"","improvedCopy":"","cta":"","notes":""}
    ]
  },
  "deploymentGuide": {
    "steps":[{"title":"Install","command":"npm install","description":""},{"title":"Dev","command":"npm run dev","description":""},{"title":"Build","command":"npm run build","description":""},{"title":"Deploy","command":"vercel --prod","description":""}],
    "platforms":["Vercel","Netlify","Cloudflare Pages"],"envVars":["VITE_API_URL"],"notes":""
  }
}`
}
