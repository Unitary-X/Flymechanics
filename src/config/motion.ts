// Motion tokens and tiers (spec section 8 and 21.6). Presets are added per phase.
export const durations = { d1: 150, d2: 300, d3: 600, d4: 1000 } as const

export const easings = {
  enter: 'cubic-bezier(.22,1,.36,1)',
  ui: 'cubic-bezier(.4,0,.2,1)',
} as const

export type MotionMode = 'full' | 'calm' | 'off'
export type Tier = 'A' | 'B' | 'C'

export const STORAGE_KEYS = {
  mode: 'fm.motion.mode',
  paused: 'fm.motion.paused',
} as const

// Tier meaning (video build): A = full, B = lower bitrate files, no particles or skew, C = posters and final states.
export const tierFeatures: Record<Tier, { scrub: boolean; particles: boolean; skew: boolean; smoothScroll: boolean }> = {
  A: { scrub: true, particles: true, skew: true, smoothScroll: true },
  B: { scrub: true, particles: false, skew: false, smoothScroll: true },
  C: { scrub: false, particles: false, skew: false, smoothScroll: false },
}

// Calm shortens pinned scrolls by 40% (spec 21.7).
export const calmPinFactor = 0.6
