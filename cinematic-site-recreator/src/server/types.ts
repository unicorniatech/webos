export interface ScrapedPage {
  url: string
  title: string
  description: string
  headings: string[]
  navItems: string[]
  bodyText: string
  ctaTexts: string[]
  imageAlts: string[]
  colorHints: string[]
}
