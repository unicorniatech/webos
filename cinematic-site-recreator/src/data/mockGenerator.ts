import type {
  AnalysisResult,
  CinematicConcept,
  BuildSection,
  CopyEntry,
} from '../types'

function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname.replace('www.', '')
  } catch {
    return url.replace(/https?:\/\//, '').replace('www.', '').split('/')[0]
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function inferIndustry(domain: string): {
  industry: string
  offer: string
  audience: string
} {
  const d = domain.toLowerCase()
  if (/food|rest|eat|kitchen|cook|pizza|sushi|burger/.test(d))
    return {
      industry: 'Food & Restaurant',
      offer: 'Premium dining experiences and food delivery',
      audience: 'Food enthusiasts 25–45, urban professionals',
    }
  if (/tech|soft|dev|app|digital|saas|cloud|io\./.test(d))
    return {
      industry: 'Technology & Software',
      offer: 'Digital products and software solutions',
      audience: 'Startups, SMBs, and enterprise decision-makers',
    }
  if (/health|med|clinic|care|wellness|fit|gym/.test(d))
    return {
      industry: 'Health & Wellness',
      offer: 'Medical services and wellness programs',
      audience: 'Health-conscious individuals 30–60',
    }
  if (/shop|store|market|buy|commerce|fashion|wear/.test(d))
    return {
      industry: 'E-Commerce & Retail',
      offer: 'Online shopping and premium product discovery',
      audience: 'Online shoppers 20–45',
    }
  if (/real|home|house|prop|estate|realty|habitat/.test(d))
    return {
      industry: 'Real Estate',
      offer: 'Property buying, selling, and investment consulting',
      audience: 'Homebuyers, investors, property owners 30–60',
    }
  if (/edu|learn|course|school|academy|teach|tutor/.test(d))
    return {
      industry: 'Education & E-Learning',
      offer: 'Online courses and professional development',
      audience: 'Students and professionals seeking skill growth',
    }
  if (/travel|tour|trip|hotel|fly|vacation|resort/.test(d))
    return {
      industry: 'Travel & Tourism',
      offer: 'Curated travel packages, booking, and experiences',
      audience: 'Experience-seekers and luxury travelers 25–55',
    }
  if (/agency|brand|market|creative|studio|design/.test(d))
    return {
      industry: 'Creative Agency & Marketing',
      offer: 'Branding, design, and digital marketing services',
      audience: 'Businesses seeking growth and visual identity',
    }
  return {
    industry: 'Business Services',
    offer: 'Professional services and tailored solutions',
    audience: 'Business owners and decision-makers 30–55',
  }
}

function pickPalette(domain: string) {
  const hash = domain.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const palettes = [
    { primary: '#6c63ff', secondary: '#4a44cc', accent: '#00d4ff', bg: '#0d0d14' },
    { primary: '#ff6b6b', secondary: '#cc4f4f', accent: '#ffd166', bg: '#100909' },
    { primary: '#06d6a0', secondary: '#049e76', accent: '#118ab2', bg: '#080f0d' },
    { primary: '#f72585', secondary: '#b5179e', accent: '#7209b7', bg: '#0d0812' },
    { primary: '#4361ee', secondary: '#3a0ca3', accent: '#4cc9f0', bg: '#080b18' },
    { primary: '#e63946', secondary: '#c1121f', accent: '#ffd60a', bg: '#100809' },
    { primary: '#2ec4b6', secondary: '#1a8f87', accent: '#ff9f1c', bg: '#080e0e' },
    { primary: '#8338ec', secondary: '#5c0099', accent: '#ff006e', bg: '#0c0814' },
  ]
  return palettes[hash % palettes.length]
}

export function generateMockResult(url: string): AnalysisResult {
  const domain = extractDomain(url)
  const namePart = domain.split('.')[0]
  const name = capitalize(namePart)
  const { industry, offer, audience } = inferIndustry(domain)
  const pal = pickPalette(domain)

  const websiteAnalysis = {
    url,
    brand: {
      businessName: name,
      industry,
      offer,
      targetAudience: audience,
      personality: 'Professional, trustworthy, innovative',
      emotionalTone: 'Confident, aspirational, approachable',
      trustSignals: [
        '10+ years in the industry',
        'Featured in top media outlets',
        '50,000+ satisfied customers',
        'ISO certified quality standards',
      ],
      differentiators: [
        'Proprietary technology platform',
        'End-to-end customer support',
        'Results-guaranteed approach',
        'Premium quality at competitive pricing',
      ],
    },
    visual: {
      primaryColor: pal.primary,
      secondaryColor: pal.secondary,
      accentColor: pal.accent,
      backgroundColor: pal.bg,
      typographyStyle: 'Clean sans-serif, strong hierarchy, display fonts for headlines',
      imageStyle: 'High-contrast photography, editorial aesthetic, authentic human moments',
      borderRadius: 'Soft (8–16px), modern card system',
      motionStyle: 'Subtle scroll reveals, smooth transitions, minimal distractions',
    },
    sections: [
      'Header / Navigation',
      'Cinematic Hero',
      'Brand Story',
      'Services / Products',
      'Process / How It Works',
      'Social Proof / Testimonials',
      'Stats & Numbers',
      'Gallery / Portfolio',
      'CTA Section',
      'Contact / Footer',
    ],
    mainCTA: 'Get Started Free',
    secondaryCTA: 'See How It Works',
    frictionPoints: [
      'Hero lacks clear value proposition above the fold',
      'Navigation overloaded with secondary links',
      'Mobile layout breaks at 375px viewport',
      'CTA buttons lack contrast and urgency',
      'Load time above 4s on mobile 3G',
      'No social proof in the first scroll',
    ],
    opportunities: [
      'Add kinetic hero text for immediate attention capture',
      'Introduce scroll-based storytelling in About section',
      'Consolidate navigation to 5 core items max',
      'Add sticky CTA bar on mobile',
      'Implement trust badges near primary CTA',
      'Use video background with low opacity for immersion',
    ],
  }

  const brandCard = {
    summary: `${name} is a ${industry} brand positioned to serve ${audience}. It communicates through confidence and visual precision.`,
    positioning: `The premium, reliable choice for ${audience.split(',')[0]} who demand results over promises.`,
    colors: [
      { name: 'Primary', hex: pal.primary, usage: 'CTAs, headlines, brand marks' },
      { name: 'Secondary', hex: pal.secondary, usage: 'Hover states, gradients, depth' },
      { name: 'Accent', hex: pal.accent, usage: 'Highlights, icons, active states' },
      { name: 'Background', hex: pal.bg, usage: 'Page base, dark sections' },
      { name: 'Surface', hex: '#1a1a2e', usage: 'Cards, panels, modals' },
      { name: 'Text Primary', hex: '#f0f0f8', usage: 'Headlines, important copy' },
      { name: 'Text Secondary', hex: '#9898b8', usage: 'Body text, labels, captions' },
    ],
    typography: {
      heading: 'Syne — Bold 700/800, wide tracking for hero titles',
      body: 'Inter — Regular 400/500, 16–18px for comfortable reading',
      accent: 'Syne Mono — Technical details, code snippets, labels',
    },
    uiDirection:
      'Dark premium with glassmorphism cards, crisp white text, electric accent highlights on key elements',
    toneOfVoice:
      'Authoritative but approachable. Direct and clear. Confident without being arrogant.',
    heroHeadlines: [
      `The Future of ${industry} Is Here`,
      `${name} — Built for Those Who Demand More`,
      `Transform Your ${industry.split(' ')[0]} Experience`,
      `Premium ${industry.split(' ')[0]} Solutions, Delivered`,
    ],
    taglines: [
      `Where Excellence Meets ${industry.split(' ')[0]}`,
      'Beyond Expectations. Every Time.',
      `The Standard for Modern ${industry.split(' ')[0]}`,
    ],
    ctas: ['Get Started Today', 'See It in Action', 'Start Free Trial', 'Book a Demo', 'Explore Our Work'],
    motionDirection:
      'Parallax hero with depth layers. Scroll-reveal sections with stagger. Magnetic CTA hover. Kinetic counter animations. Smooth page transitions.',
  }

  const cinematicConcepts: CinematicConcept[] = [
    {
      id: 1,
      title: 'The Reveal',
      description: `A single concept assembles itself from abstract fragments as the user scrolls, building anticipation and revealing ${name}'s core value proposition piece by piece.`,
      cameraMovement: 'Slow push-in with subtle zoom, bokeh depth shift on scroll',
      scrollBehavior: 'Frame-by-frame assembly triggered by scrollY position',
      emotionalIntent: 'Wonder, anticipation, premium craftsmanship',
      imagePrompt: `Cinematic dark studio product reveal, fragments assembling in zero gravity, ${pal.primary} particle light trails, ultra-sharp 8K render, dramatic rim lighting, shallow depth of field`,
      videoPrompt: `A ${industry} concept assembles from glowing particles in a dark cinematic environment. Camera slowly pushes in. Particles snap together with a satisfying flash. Ambient ${pal.accent} glow. 120fps slow motion. Hollywood-grade VFX.`,
      bestUseCase: 'Product launch, SaaS hero, premium service intro',
      icon: '✦',
    },
    {
      id: 2,
      title: 'The Journey',
      description:
        'A horizontal landscape transforms as the user scrolls — from a problem state (dark, chaotic) to a solution state (bright, ordered). Perfect for before/after storytelling.',
      cameraMovement: 'Horizontal pan synchronized with scroll velocity',
      scrollBehavior: 'Horizontal parallax scroll, scene transformation at midpoint',
      emotionalIntent: 'Transformation, relief, progress, aspiration',
      imagePrompt: `Split cinematic scene: left half dark storm representing chaos, right half golden sunrise representing clarity and order. ${name} brand mark at the center divide. Photorealistic render, anamorphic lens.`,
      videoPrompt: `Time-lapse: a dark stormy landscape transforms into a golden sunrise city. Camera pans right. Midway, the ${name} logo appears in light rays. Dramatic orchestral swell. Anamorphic lens flare. 4K cinematic.`,
      bestUseCase: 'Agency portfolio, transformation story, before/after service demo',
      icon: '→',
    },
    {
      id: 3,
      title: 'The Orbit',
      description: `${name}'s core offering sits at center as key benefits orbit in 3D space. Rotating on scroll, each orbit stop reveals a feature with a micro-animation and label.`,
      cameraMovement: '360° orbit rotation, subtle tilt on mouse move',
      scrollBehavior: 'Orbit rotation speed tied to scroll, stops at feature reveal points',
      emotionalIntent: 'Innovation, control, ecosystem mastery',
      imagePrompt: `3D holographic sphere with orbiting feature cards, ${pal.primary} and ${pal.accent} neon rings, dark space environment, ultra-detailed sci-fi aesthetic, 8K cinematic render`,
      videoPrompt: `Futuristic 3D dashboard sphere rotates slowly. Feature cards pop in orbit one by one with ${pal.accent} glow. Data streams flow between elements. Clean sci-fi aesthetic. 60fps. Ambient electronic score.`,
      bestUseCase: 'Tech platform, SaaS features showcase, innovation-forward brand',
      icon: '◎',
    },
  ]

  const buildSections: BuildSection[] = [
    {
      name: 'Header',
      description: 'Transparent to solid on scroll, glassmorphism effect',
      components: ['Logo', 'NavLinks', 'CTAButton', 'MobileMenu'],
      priority: 'high',
    },
    {
      name: 'HeroCinematic',
      description: 'Fullscreen with scroll-based animation and kinetic headline',
      components: ['KineticText', 'ScrollIndicator', 'HeroCTA', 'BackgroundScene'],
      priority: 'high',
    },
    {
      name: 'BrandStory',
      description: 'Emotional intro with animated stats and credibility signals',
      components: ['SectionTitle', 'StatsCounter', 'StoryParagraph', 'CredibilityBadges'],
      priority: 'high',
    },
    {
      name: 'Services',
      description: 'Interactive accordion cards with hover expansion',
      components: ['ServiceCard', 'AccordionPanel', 'ServiceIcon', 'BenefitList'],
      priority: 'high',
    },
    {
      name: 'ProcessSteps',
      description: 'Numbered steps with connecting animated line',
      components: ['StepNumber', 'StepCard', 'ConnectingLine', 'StepIcon'],
      priority: 'medium',
    },
    {
      name: 'SocialProof',
      description: 'Testimonial carousel with avatar and star rating',
      components: ['TestimonialCard', 'StarRating', 'Avatar', 'CarouselControl'],
      priority: 'medium',
    },
    {
      name: 'CTASection',
      description: 'Full-width cinematic CTA with ambient glow',
      components: ['HeadlineLarge', 'DualCTA', 'BackgroundGlow', 'Particles'],
      priority: 'high',
    },
    {
      name: 'Footer',
      description: 'Clean footer with links, social icons, and legal',
      components: ['FooterLogo', 'NavColumns', 'SocialLinks', 'LegalLinks'],
      priority: 'medium',
    },
  ]

  const buildPlan = {
    conceptName: 'Dark Orbit Premium',
    stack: ['Vite 5', 'React 18', 'TypeScript 5', 'TailwindCSS 3', 'Framer Motion 11', 'Inter + Syne (Google Fonts)'],
    sections: buildSections,
    estimatedTime: '3–5 days for full implementation',
    checklist: [
      '✓ Setup Vite + React + TypeScript + Tailwind',
      '✓ Install Framer Motion for scroll animations',
      '✓ Configure custom font families in Tailwind',
      '✓ Build AppShell and layout structure',
      '✓ Implement Header with scroll-transparent behavior',
      '✓ Build HeroCinematic with parallax',
      '○ Create BrandStory with counter animations',
      '○ Build Services accordion section',
      '○ Implement ProcessSteps with animated line',
      '○ Add SocialProof carousel',
      '○ Create CTASection with particle background',
      '○ Build responsive Footer',
      '○ Mobile QA across all breakpoints',
      '○ Performance audit (Lighthouse 90+)',
      '○ Deploy to Vercel',
    ],
  }

  const copyEntries: CopyEntry[] = [
    {
      section: 'Hero',
      originalIntent: 'Introduce the brand and main service',
      improvedCopy: `The Future of ${industry} Is Here.\n\n${name} combines cutting-edge approach with human expertise to deliver results that move your business forward. No fluff. Just results.`,
      cta: 'Start Your Journey',
      notes: 'Lead with the transformation promise, not the features. Keep headline under 8 words.',
    },
    {
      section: 'Brand Story',
      originalIntent: 'Build trust with background information',
      improvedCopy: `We started ${name} because we were tired of the status quo in ${industry}. Slow results. Generic solutions. Broken promises.\n\nSo we built something different — a system that puts your success at the center of everything we do.`,
      cta: 'Learn Our Story',
      notes: 'Start with the pain, then the mission. Use "we" to sound human, not corporate.',
    },
    {
      section: 'Services',
      originalIntent: 'List available services/products',
      improvedCopy: `Everything You Need. Nothing You Don't.\n\nOur suite of ${industry} solutions is built for performance, designed for clarity, and backed by real results.`,
      cta: 'Explore All Services',
      notes: 'Use benefit-first language. Avoid feature lists. Emphasize outcomes.',
    },
    {
      section: 'Process',
      originalIntent: 'Explain how the service works',
      improvedCopy: `Three Steps to Extraordinary Results\n\n1. Discover — We learn your goals, challenges, and vision.\n2. Build — We craft a tailored solution just for you.\n3. Launch — You grow. We celebrate together.`,
      cta: 'Book a Free Consult',
      notes: 'Keep it to 3 steps max. Make step 3 feel like a win for the client.',
    },
    {
      section: 'Social Proof',
      originalIntent: 'Show testimonials and trust indicators',
      improvedCopy: `Trusted by 50,000+ professionals across 30 countries. Our clients don't just stay — they grow with us.`,
      cta: 'Read Success Stories',
      notes: 'Lead with numbers. Follow with emotion. Feature real names and faces.',
    },
    {
      section: 'Final CTA',
      originalIntent: 'Convert visitors into leads',
      improvedCopy: `Ready to Change Everything?\n\nJoin thousands of businesses that already made the switch. The best time to start was yesterday. The second best time is right now.`,
      cta: "Get Started — It's Free",
      notes: 'Create urgency without false scarcity. "Free" dramatically improves conversion.',
    },
  ]

  const deploymentGuide = {
    steps: [
      { title: 'Install dependencies', command: 'npm install', description: 'Install all project dependencies' },
      { title: 'Start dev server', command: 'npm run dev', description: 'Opens http://localhost:5173 in your browser' },
      { title: 'Build for production', command: 'npm run build', description: 'Generates optimized files in /dist' },
      { title: 'Preview production build', command: 'npm run preview', description: 'Test the built version locally before deploy' },
      { title: 'Deploy to Vercel', command: 'vercel --prod', description: 'Requires Vercel CLI: npm i -g vercel' },
    ],
    platforms: ['Vercel (recommended)', 'Netlify', 'GitHub Pages', 'Cloudflare Pages', 'Railway'],
    envVars: ['VITE_SITE_URL', 'VITE_ANALYTICS_ID', 'VITE_CONTACT_EMAIL', 'VITE_WHATSAPP_NUMBER'],
    notes:
      'No backend required for this static build. Connect to a CMS like Contentful or Sanity for dynamic content. Add Google Analytics or Plausible for visitor tracking.',
  }

  return {
    websiteAnalysis,
    brandCard,
    cinematicConcepts,
    buildPlan,
    copywritingMap: { entries: copyEntries },
    deploymentGuide,
  }
}
