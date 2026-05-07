import type { AnalysisResult } from './types'

function extractDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() }
function palette(domain: string) {
  const h = domain.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return [
    { primary: '#6c63ff', secondary: '#4a44cc', accent: '#00d4ff', bg: '#0d0d14' },
    { primary: '#ff6b6b', secondary: '#cc4f4f', accent: '#ffd166', bg: '#100909' },
    { primary: '#06d6a0', secondary: '#049e76', accent: '#118ab2', bg: '#080f0d' },
    { primary: '#f72585', secondary: '#b5179e', accent: '#7209b7', bg: '#0d0812' },
    { primary: '#4361ee', secondary: '#3a0ca3', accent: '#4cc9f0', bg: '#080b18' },
  ][h % 5]
}
function industry(d: string) {
  if (/food|rest|eat|cook/.test(d)) return { i: 'Food & Restaurant', o: 'Premium dining', a: 'Food lovers 25–45' }
  if (/tech|soft|dev|app|saas/.test(d)) return { i: 'Technology', o: 'Software solutions', a: 'Startups and enterprises' }
  if (/health|med|clinic|care/.test(d)) return { i: 'Health & Wellness', o: 'Medical services', a: 'Health-conscious 30–60' }
  return { i: 'Business Services', o: 'Professional solutions', a: 'Business owners 30–55' }
}

export function generateMockResult(url: string): AnalysisResult {
  const domain = extractDomain(url)
  const name = cap(domain.split('.')[0])
  const { i, o, a } = industry(domain.toLowerCase())
  const pal = palette(domain)
  return {
    websiteAnalysis: {
      url, brand: { businessName: name, industry: i, offer: o, targetAudience: a, personality: 'Professional, trustworthy', emotionalTone: 'Confident, aspirational', trustSignals: ['10+ years experience', '50k+ customers', 'ISO certified'], differentiators: ['Proprietary platform', 'End-to-end support', 'Guaranteed results'] },
      visual: { primaryColor: pal.primary, secondaryColor: pal.secondary, accentColor: pal.accent, backgroundColor: pal.bg, typographyStyle: 'Clean sans-serif with display headlines', imageStyle: 'High-contrast editorial photography', borderRadius: 'Soft 8–16px', motionStyle: 'Subtle scroll reveals' },
      sections: ['Header', 'Hero', 'Brand Story', 'Services', 'Process', 'Testimonials', 'CTA', 'Footer'],
      mainCTA: 'Get Started Free', secondaryCTA: 'See How It Works',
      frictionPoints: ['No social proof above fold', 'CTA lacks contrast', 'Mobile layout issues'],
      opportunities: ['Add kinetic hero text', 'Scroll-based storytelling', 'Trust badges near CTA'],
    },
    brandCard: {
      summary: `${name} is a ${i} brand serving ${a}.`, positioning: `The premium choice for ${a}.`,
      colors: [{ name: 'Primary', hex: pal.primary, usage: 'CTAs, headlines' }, { name: 'Secondary', hex: pal.secondary, usage: 'Hover states' }, { name: 'Accent', hex: pal.accent, usage: 'Highlights' }, { name: 'Background', hex: pal.bg, usage: 'Page base' }, { name: 'Surface', hex: '#1a1a2e', usage: 'Cards' }, { name: 'Text Primary', hex: '#f0f0f8', usage: 'Headlines' }, { name: 'Text Secondary', hex: '#9898b8', usage: 'Body' }],
      typography: { heading: 'Syne Bold 700', body: 'Inter Regular 400', accent: 'Syne Mono' },
      uiDirection: 'Dark premium with glassmorphism cards', toneOfVoice: 'Authoritative but approachable',
      heroHeadlines: [`The Future of ${i}`, `${name} — Built for More`, `Transform Your ${i}`, 'Beyond Expectations'],
      taglines: [`Where Excellence Meets ${i}`, 'Beyond Expectations.', 'The New Standard'],
      ctas: ['Get Started', 'See It in Action', 'Book a Demo', 'Explore'],
      motionDirection: 'Parallax hero, scroll-reveal sections, magnetic CTA',
    },
    cinematicConcepts: [
      { id: 1, title: 'The Reveal', icon: '✦', description: `Core concept assembles from fragments, revealing ${name}'s value.`, cameraMovement: 'Slow push-in with bokeh', scrollBehavior: 'Frame-by-frame via scrollY', emotionalIntent: 'Wonder, anticipation', imagePrompt: `Cinematic dark studio reveal, fragments assembling, ${pal.primary} particles, 8K render`, videoPrompt: `Product assembles from particles. Camera pushes in. ${pal.accent} glow. 120fps Hollywood VFX.`, bestUseCase: 'Product launch, SaaS hero' },
      { id: 2, title: 'The Journey', icon: '→', description: 'Landscape transforms from problem to solution as user scrolls.', cameraMovement: 'Horizontal pan synced to scroll', scrollBehavior: 'Horizontal parallax', emotionalIntent: 'Transformation, aspiration', imagePrompt: `Split scene: dark storm left, golden sunrise right. ${name} logo at center. Anamorphic lens.`, videoPrompt: `Dark landscape transforms to golden sunrise. ${name} logo appears. Orchestral swell. 4K.`, bestUseCase: 'Agency portfolio, before/after' },
      { id: 3, title: 'The Orbit', icon: '◎', description: `Core offering at center, benefits orbit in 3D. Each stop reveals a feature.`, cameraMovement: '360° orbit, tilt on mouse', scrollBehavior: 'Orbit tied to scroll', emotionalIntent: 'Innovation, mastery', imagePrompt: `3D holographic sphere, orbiting cards, ${pal.primary} neon rings, sci-fi space, 8K`, videoPrompt: `3D sphere rotates. Features appear with ${pal.accent} glow. Electronic score. 60fps.`, bestUseCase: 'Tech platform, SaaS features' },
    ],
    buildPlan: {
      conceptName: 'Dark Orbit Premium', stack: ['Vite 5', 'React 18', 'TypeScript 5', 'TailwindCSS 3', 'Framer Motion 11'],
      sections: [{ name: 'Header', description: 'Sticky glassmorphism', components: ['Logo', 'Nav', 'CTA'], priority: 'high' }, { name: 'Hero', description: 'Cinematic fullscreen', components: ['KineticText', 'Scene'], priority: 'high' }, { name: 'Services', description: 'Accordion cards', components: ['ServiceCard', 'Accordion'], priority: 'high' }, { name: 'SocialProof', description: 'Testimonials', components: ['TestimonialCard'], priority: 'medium' }, { name: 'Footer', description: 'Clean footer', components: ['Links', 'Social'], priority: 'low' }],
      estimatedTime: '3–5 days', checklist: ['○ Setup stack', '○ Header', '○ Hero', '○ Services', '○ Animations', '○ Deploy'],
    },
    copywritingMap: { entries: [
      { section: 'Hero', originalIntent: 'Introduce brand', improvedCopy: `The Future of ${i} Is Here.\n\n${name} delivers results that move your business forward.`, cta: 'Start Your Journey', notes: 'Lead with transformation.' },
      { section: 'Brand Story', originalIntent: 'Build trust', improvedCopy: `We built ${name} because the industry needed something better.`, cta: 'Learn Our Story', notes: 'Start with pain.' },
      { section: 'Services', originalIntent: 'List services', improvedCopy: "Everything You Need. Nothing You Don't.", cta: 'Explore Services', notes: 'Benefit-first language.' },
      { section: 'Process', originalIntent: 'How it works', improvedCopy: '3 Steps to Results\n1. Discover\n2. Build\n3. Launch', cta: 'Book a Consult', notes: 'Max 3 steps.' },
      { section: 'Social Proof', originalIntent: 'Show trust', improvedCopy: 'Trusted by 50,000+ professionals worldwide.', cta: 'Read Stories', notes: 'Lead with numbers.' },
      { section: 'Final CTA', originalIntent: 'Convert', improvedCopy: "Ready to Change Everything?\nJoin thousands who already made the switch.", cta: "Get Started — It's Free", notes: '"Free" boosts conversion.' },
    ]},
    deploymentGuide: { steps: [{ title: 'Install', command: 'npm install', description: 'Install deps' }, { title: 'Dev', command: 'npm run dev', description: 'localhost:5173' }, { title: 'Build', command: 'npm run build', description: 'Output to /dist' }, { title: 'Deploy', command: 'vercel --prod', description: 'Needs Vercel CLI' }], platforms: ['Vercel', 'Netlify', 'Cloudflare Pages'], envVars: ['VITE_API_URL'], notes: 'Static build — no backend required with mock mode.' },
  }
}
