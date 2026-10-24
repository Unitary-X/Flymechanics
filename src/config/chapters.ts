// One source of truth for chapters: header menu, scroll-spy, HUD, URL hashes.
// Names follow FLYMECHANICS_BUILD_SPEC.md section 21.2. Scroll lengths are in vh (spec 21.2).
export interface Chapter {
  id: string // DOM id and URL hash
  n: number
  name: string
  theme: 'light' | 'dark'
  pinVh: number // pinned scroll length in desktop screen heights x 100
  inMenu?: string // label in the menu overlay, if listed there
}

export const chapters: readonly Chapter[] = [
  { id: 'hero', n: 1, name: 'Takeoff', theme: 'light', pinVh: 200 },
  { id: 'statement', n: 2, name: 'Who we are', theme: 'dark', pinVh: 250 },
  { id: 'handle', n: 3, name: 'We handle', theme: 'dark', pinVh: 300 },
  { id: 'scramble', n: 4, name: 'Time flies', theme: 'dark', pinVh: 160 },
  { id: 'navigator', n: 5, name: 'The navigator', theme: 'dark', pinVh: 480, inMenu: 'Navigator' },
  { id: 'services', n: 6, name: 'Services', theme: 'light', pinVh: 1080, inMenu: 'Services' },
  { id: 'approach', n: 7, name: 'Approach', theme: 'light', pinVh: 150, inMenu: 'Approach' },
  { id: 'faq', n: 8, name: 'FAQ', theme: 'light', pinVh: 100, inMenu: 'FAQ' },
  { id: 'contact', n: 9, name: "Let's fly", theme: 'dark', pinVh: 150, inMenu: 'Contact' },
] as const

// Menu order follows the spec (5.3): Services, Navigator, Approach, FAQ, Contact.
const menuOrder = ['services', 'navigator', 'approach', 'faq', 'contact']
export const menuChapters = menuOrder
  .map((id) => chapters.find((c) => c.id === id))
  .filter((c): c is Chapter => c !== undefined && c.inMenu !== undefined)
