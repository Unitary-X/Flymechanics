import { useEffect, useState } from 'react'
import type Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let timer = 0

/**
 * Recalculate every pin and trigger once things have settled: after each stage builds its timeline and after
 * fonts and the page load. Debounced so several callers cause one refresh.
 */
export function scheduleRefresh(delay = 60) {
  if (typeof window === 'undefined') return
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    // Read layout first so the pins measure the settled page, then recalculate everything.
    void document.body.offsetHeight
    ScrollTrigger.refresh()
  }, delay)
}

// ---- Chapter anchors inside pinned stages --------------------------------------------------------
// A chapter that lives inside a pinned stage has no scroll position of its own, so links to it
// (#statement, #scramble) are resolved from the stage's trigger and the point where the chapter takes over.

interface Anchor {
  st: ScrollTrigger
  progress: number
}
const anchors = new Map<string, Anchor>()
let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

/** Register chapters of one stage: id -> progress (0..1) of the stage's scroll at which the chapter starts. */
export function registerAnchors(entries: Record<string, number>, st: ScrollTrigger) {
  const ids = Object.keys(entries)
  ids.forEach((id) => anchors.set(id, { st, progress: entries[id] }))
  return () => ids.forEach((id) => anchors.delete(id))
}

/** Scroll position (px) of a registered chapter, or null when the id is an ordinary element. */
export function anchorY(id: string): number | null {
  const a = anchors.get(id)
  if (!a) return null
  // A hair past the start so the handover has happened.
  const p = a.progress > 0 ? a.progress + 0.004 : 0
  return Math.round(a.st.start + p * (a.st.end - a.st.start))
}

export function jumpTo(y: number, immediate = false) {
  if (lenis) lenis.scrollTo(y, { immediate })
  else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' })
}

// ---- Shared live scroll state (written by the scroll engine, read by effects) ---------------------
export const motionState = {
  /** Smoothed scroll velocity, -1..1 (about 30 px per frame at the extremes). */
  velocity: 0,
  /** Whole-page scroll progress 0..1. */
  progress: 0,
}

/** Scroll position (px) where a chapter starts: its stage anchor when it lives in a pinned stage, else its top. */
export function chapterStart(id: string): number | null {
  const y = anchorY(id)
  if (y !== null) return y
  const el = document.getElementById(id)
  return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null
}

// ---- Staged start ---------------------------------------------------------------------------------
/**
 * Resolves a moment after the page has loaded and the pinned chapters have been measured. Heavy extras (films,
 * particles, mist, HUD) wait for it, so the first screen paints fast and the film files do not compete with it.
 * It also fixes lazy loading: a chapter's position is only real once the pin spacing exists.
 */
const settled: Promise<void> =
  typeof window === 'undefined'
    ? new Promise<void>(() => {})
    : new Promise<void>((resolve) => {
        const done = () => window.setTimeout(resolve, 1200)
        if (document.readyState === 'complete') done()
        else window.addEventListener('load', done, { once: true })
      })

// A page that really has pinned chapters is only measured once ScrollTrigger has refreshed after they registered.
// On a slow device that can be later than the load event, and lazy loading must not guess before then.
const pinsMeasured: Promise<void> =
  typeof window === 'undefined'
    ? new Promise<void>(() => {})
    : new Promise<void>((resolve) => {
        const check = () => {
          if (anchors.size > 0) {
            ScrollTrigger.removeEventListener('refresh', check)
            resolve()
          }
        }
        ScrollTrigger.addEventListener('refresh', check)
        // Static pages (motion off, reduced motion) never pin anything: do not wait for pins forever.
        void settled.then(() => window.setTimeout(resolve, 2500))
      })

export const layoutReady: Promise<void> = Promise.all([settled, pinsMeasured]).then(() => undefined)

/** False on the server and during the first moments after load; true once heavy extras may start. */
export function useAfterLayout(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    void layoutReady.then(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])
  return ready
}

// ---- Quiet start for extras ----------------------------------------------------------------------
/**
 * Resolves on the visitor's first real interaction (touch, wheel, key, pointer, scroll) or once the page has been
 * quiet for several seconds, whichever comes first. Decorative work (mist, particles, HUD, reveal effects for
 * chapters far below the fold) waits for it, so it never competes with loading and first paint.
 */
const quiet: Promise<void> =
  typeof window === 'undefined'
    ? new Promise<void>(() => {})
    : new Promise<void>((resolve) => {
        const events = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll']
        const go = () => {
          events.forEach((e) => window.removeEventListener(e, go))
          resolve()
        }
        events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }))
        void settled.then(() => window.setTimeout(go, 5300))
      })

/** True after the first interaction or the quiet period, plus an optional stagger so several do not start at once. */
export function useAfterQuiet(staggerMs = 0): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    let t = 0
    void quiet.then(() => {
      t = window.setTimeout(() => alive && setReady(true), staggerMs)
    })
    return () => {
      alive = false
      window.clearTimeout(t)
    }
  }, [staggerMs])
  return ready
}

/** True once the browser is idle after hydration (with a timeout): needed soon, but not inside the first paint. */
export function useAfterIdle(timeoutMs = 1500): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    const hasIdle = 'requestIdleCallback' in window
    const id = hasIdle
      ? window.requestIdleCallback(() => alive && setReady(true), { timeout: timeoutMs })
      : window.setTimeout(() => alive && setReady(true), 300)
    return () => {
      alive = false
      if (hasIdle) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
    }
  }, [timeoutMs])
  return ready
}

/**
 * For pinned chapters below the first screen: build them on the first interaction or after the quiet period, but at
 * once when the page opens already scrolled (a reload or a link into the middle), because their layout is needed now.
 */
export function useAfterQuietOrScrolled(): boolean {
  const quietReady = useAfterQuiet(0)
  const [scrolled] = useState(() => typeof window !== 'undefined' && (window.scrollY > 50 || window.location.hash.length > 1))
  return quietReady || scrolled
}
