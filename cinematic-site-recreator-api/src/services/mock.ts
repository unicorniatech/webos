import type { AnalysisResult } from '../types/index.js'

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function inferIndustry(domain: string) {
  const d = domain.toLowerCase()
  if (/food|rest|eat|kitchen|cook/.test(d))
    return { industry: 'Food & Restaurant', offer: 'Premium dining and food delivery', audience: 'Food enthusiasts 25–45' }
  if (/tech|soft|dev|app|digital|saas/.test(d))
    return { industry: 'Technology & Software', offer: 'Digital products and software solutions', audience: 'Startups and enterprise decision-makers' }
  if (/health|med|clinic|care|wellness/.test(d))
    return { industry: 'Health & Wellness', offer: 'Medical services and wellness programs', audience: 'Health-conscious individuals 30–60' }
  if (/shop|store|market|buy|commerce/.test(d))
    return { industry: 'E-Commerce', offer: 'Online shopping and product discovery', audience: 'Online shoppers 20–45' }
  return { industry: 'Business Services', offer: 'Professional services and solutions', audience: 'Business owners and decision-makers 30–55' }
}

function pickPalette(domain: string) {
  const hash = domain.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const palettes = [
    { primary: '#6c63ff', secondary: '#4a44cc', accent: '#00d4ff', bg: '#0d0d14' },
    { primary: '#ff6b6b', secondary: '#cc4f4f', accent: '#ffd166', bg: '#100909' },
    { primary: '#06d6a0', secondary: '#049e76', accent: '#118ab2', bg: '#080f0d' },
    { primary: '#f72585', secondary: '#b5179e', accent: '#7209b7', bg: '#0d0812' },
    { primary: '#4361ee', secondary: '#3a0ca3', accent: '#4cc9f0', bg: '#080b18' },
  ]
  return palettes[hash % palettes.length]
}

export function generateMockResult(url: string): AnalysisResult {
  const domain = extractDomain(url)
  const name = capitalize(domain.split('.')[0])
  const { industry, offer, audience } = inferIndustry(domain)
  const pal = pickPalette(domain)

  return {
    websiteAnalysis: {
      url,
      brand: {
        businessName: name,
        industry,
        offer,
        targetAudience: audience,
        personality: 'Professional, trustworthy, innovative',
        emotionalTone: 'Confident, aspirational, approachable',
        trustSignals: ['10+ years in the industry', '50,000+ satisfied customers', 'ISO certified'],
        differentiators: ['Proprietary platform', 'End-to-end support', 'Results guaranteed'],
      },
      visual: {
        primaryColor: pal.primary,
        secondaryColor: pal.secondary,
        accentColor: pal.accent,
        backgroundColor: pal.bg,
        typographyStyle: 'Clean sans-serif with display headlines',
        imageStyle: 'High-contrast editorial photography',
        borderRadius: 'Soft (8–16px)',
        motionStyle: 'Subtle scroll reveals, smooth transitions',
      },
      sections: ['Header', 'Hero', 'Brand Story', 'Services', 'Process', 'Testimonials', 'CTA', 'Footer'],
      mainCTA: 'Get Started Free',
      secondaryCTA: 'See How It Works',
      frictionPoints: ['No social proof above the fold', 'CTA lacks contrast', 'Mobile layout issues'],
      opportunities: ['Add kinetic hero text', 'Scroll-based storytelling', 'Trust badges near CTA'],
    },
    brandCard: {
      summary: `${name} is a ${industry} brand serving ${audience}.`,
      positioning: `The premium choice for ${audience} who demand results.`,
      colors: [
        { name: 'Primary', hex: pal.primary, usage: 'CTAs, headlines' },
        { name: 'Secondary', hex: pal.secondary, usage: 'Hover states, depth' },
        { name: 'Accent', hex: pal.accent, usage: 'Highlights, icons' },
        { name: 'Background', hex: pal.bg, usage: 'Page base' },
        { name: 'Surface', hex: '#1a1a2e', usage: 'Cards, panels' },
        { name: 'Text Primary', hex: '#f0f0f8', usage: 'Headlines' },
        { name: 'Text Secondary', hex: '#9898b8', usage: 'Body text' },
      ],
      typography: {
        heading: 'Syne Bold 700/800',
        body: 'Inter Regular 400/500',
        accent: 'Syne Mono — labels and tags',
      },
      uiDirection: 'Dark premium with glassmorphism cards',
      toneOfVoice: 'Authoritative but approachable. Direct and clear.',
      heroHeadlines: [`The Future of ${industry}`, `${name} — Built for More`, `Transform Your ${industry}`],
      taglines: [`Where Excellence Meets ${industry}`, 'Beyond Expectations.'],
      ctas: ['Get Started Today', 'See It in Action', 'Book a Demo'],
      motionDirection: 'Parallax hero, scroll-reveal sections, magnetic CTA hover.',
    },
    cinematicConcepts: [
      {
        id: 1, title: 'The Reveal', icon: '✦',
        description: `Core concept assembles from fragments as user scrolls, revealing ${name}'s value.`,
        cameraMovement: 'Slow push-in with bokeh depth shift',
        scrollBehavior: 'Frame-by-frame assembly via scrollY',
        emotionalIntent: 'Wonder, anticipation, premium craftsmanship',
        imagePrompt: `Cinematic dark studio product reveal, fragments assembling in zero gravity, ${pal.primary} particle trails, 8K render, dramatic rim lighting`,
        videoPrompt: `Product assembles from glowing particles. Camera slowly pushes in. Particles snap together. ${pal.accent} ambient glow. 120fps. Hollywood VFX.`,
        bestUseCase: 'Product launch, SaaS hero',
      },
      {
        id: 2, title: 'The Journey', icon: '→',
        description: 'Landscape transforms from problem (dark) to solution (bright) as user scrolls.',
        cameraMovement: 'Horizontal pan synced to scroll',
        scrollBehavior: 'Horizontal parallax, scene transformation at midpoint',
        emotionalIntent: 'Transformation, relief, aspiration',
        imagePrompt: `Split cinematic scene: dark storm left, golden sunrise right. ${name} logo at center divide. Anamorphic lens.`,
        videoPrompt: `Dark stormy landscape transforms to golden sunrise. ${name} logo appears in light. Orchestral swell. 4K cinematic.`,
        bestUseCase: 'Agency portfolio, before/after storytelling',
      },
      {
        id: 3, title: 'The Orbit', icon: '◎',
        description: `Core offering at center, key benefits orbit in 3D. Each orbit stop reveals a feature.`,
        cameraMovement: '360° orbit, subtle tilt on mouse move',
        scrollBehavior: 'Orbit rotation tied to scroll, stops at feature points',
        emotionalIntent: 'Innovation, control, mastery',
        imagePrompt: `3D holographic sphere, orbiting cards, ${pal.primary} and ${pal.accent} neon rings, sci-fi dark space, 8K`,
        videoPrompt: `3D sphere rotates. Feature cards appear in orbit with ${pal.accent} glow. Ambient electronic score. 60fps.`,
        bestUseCase: 'Tech platform, SaaS features',
      },
    ],
    buildPlan: {
      conceptName: 'Dark Orbit Premium',
      stack: ['Vite 5', 'React 18', 'TypeScript 5', 'TailwindCSS 3', 'Framer Motion 11'],
      sections: [
        { name: 'Header', description: 'Sticky glassmorphism header', components: ['Logo', 'Nav', 'CTAButton'], priority: 'high' },
        { name: 'HeroCinematic', description: 'Fullscreen cinematic hero', components: ['KineticText', 'ScrollScene', 'HeroCTA'], priority: 'high' },
        { name: 'Services', description: 'Accordion cards', components: ['ServiceCard', 'AccordionPanel'], priority: 'high' },
        { name: 'SocialProof', description: 'Testimonial carousel', components: ['TestimonialCard', 'StarRating'], priority: 'medium' },
        { name: 'Footer', description: 'Clean footer with links', components: ['FooterLogo', 'SocialLinks'], priority: 'medium' },
      ],
      estimatedTime: '3–5 days',
      checklist: ['○ Setup stack', '○ Build Header', '○ Build Hero', '○ Build Services', '○ Add animations', '○ Deploy'],
    },
    copywritingMap: {
      entries: [
        { section: 'Hero', originalIntent: 'Introduce brand', improvedCopy: `The Future of ${industry} Is Here.\n\n${name} delivers results that move your business forward.`, cta: 'Start Your Journey', notes: 'Lead with transformation, not features.' },
        { section: 'Brand Story', originalIntent: 'Build trust', improvedCopy: `We built ${name} because the industry needed something better. Faster. Smarter. More human.`, cta: 'Learn Our Story', notes: 'Start with pain, end with mission.' },
        { section: 'Services', originalIntent: 'List services', improvedCopy: 'Everything You Need. Nothing You Don\'t.\n\nBuilt for performance, designed for clarity.', cta: 'Explore Services', notes: 'Benefit-first language. Avoid feature lists.' },
        { section: 'Final CTA', originalIntent: 'Convert visitors', improvedCopy: 'Ready to Change Everything?\n\nJoin thousands who already made the switch.', cta: "Get Started — It's Free", notes: '"Free" dramatically improves conversion.' },
      ],
    },
    deploymentGuide: {
      steps: [
        { title: 'Install', command: 'npm install', description: 'Install all dependencies' },
        { title: 'Dev server', command: 'npm run dev', description: 'http://localhost:5173' },
        { title: 'Build', command: 'npm run build', description: 'Outputs to /dist' },
        { title: 'Deploy', command: 'vercel --prod', description: 'Needs Vercel CLI' },
      ],
      platforms: ['Vercel', 'Netlify', 'Cloudflare Pages'],
      envVars: ['VITE_API_URL', 'VITE_ANALYTICS_ID'],
      notes: 'Static build — no backend required unless using real API analysis.',
    },
  }
}
