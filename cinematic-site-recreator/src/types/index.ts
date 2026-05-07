export interface BrandIdentity {
  businessName: string
  industry: string
  offer: string
  targetAudience: string
  personality: string
  emotionalTone: string
  trustSignals: string[]
  differentiators: string[]
}

export interface ColorSwatch {
  name: string
  hex: string
  usage: string
}

export interface VisualIdentity {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  typographyStyle: string
  imageStyle: string
  borderRadius: string
  motionStyle: string
}

export interface WebsiteAnalysis {
  url: string
  brand: BrandIdentity
  visual: VisualIdentity
  sections: string[]
  mainCTA: string
  secondaryCTA: string
  frictionPoints: string[]
  opportunities: string[]
}

export interface BrandCardData {
  summary: string
  positioning: string
  colors: ColorSwatch[]
  typography: { heading: string; body: string; accent: string }
  uiDirection: string
  toneOfVoice: string
  heroHeadlines: string[]
  taglines: string[]
  ctas: string[]
  motionDirection: string
}

export interface CinematicConcept {
  id: number
  title: string
  description: string
  cameraMovement: string
  scrollBehavior: string
  emotionalIntent: string
  imagePrompt: string
  videoPrompt: string
  bestUseCase: string
  icon: string
}

export interface BuildSection {
  name: string
  description: string
  components: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface BuildPlanData {
  conceptName: string
  stack: string[]
  sections: BuildSection[]
  estimatedTime: string
  checklist: string[]
}

export interface CopyEntry {
  section: string
  originalIntent: string
  improvedCopy: string
  cta: string
  notes: string
}

export interface CopywritingMapData {
  entries: CopyEntry[]
}

export interface DeployStep {
  title: string
  command?: string
  description: string
}

export interface DeploymentGuideData {
  steps: DeployStep[]
  platforms: string[]
  envVars: string[]
  notes: string
}

export interface AnalysisResult {
  websiteAnalysis: WebsiteAnalysis
  brandCard: BrandCardData
  cinematicConcepts: CinematicConcept[]
  buildPlan: BuildPlanData
  copywritingMap: CopywritingMapData
  deploymentGuide: DeploymentGuideData
}

export type PhaseId =
  | 'idle'
  | 'analyzing'
  | 'brand-analysis'
  | 'brand-card'
  | 'cinematic-concepts'
  | 'build-plan'
  | 'copywriting'
  | 'deployment'
  | 'complete'
