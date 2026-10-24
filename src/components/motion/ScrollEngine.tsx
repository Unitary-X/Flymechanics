import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tierFeatures } from '~/config/motion'
import { useMotion } from './MotionProvider'
import { anchorY, chapterStart, jumpTo, layoutReady, motionState, scheduleRefresh, setLenis } from '~/lib/scroll'

// Chapters inside pinned stages only get a scroll position once their stage has been built.
const PINNED = new Set(['hero', 'statement', 'handle', 'scramble', 'navigator'])

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  // Our own refresh (debounced, after fonts and layout settle) replaces the automatic one on 'load'.
  ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,resize' })
}

/**
 * Smooth scroll for desktop only (touch keeps native momentum, spec 8), wired to ScrollTrigger.
 * It never traps scroll: wheel, keys and touch behave normally, and it stops while the menu is open.
 */
export function ScrollEngine() {
  const { active, tier } = useMotion()
  const smooth = active && tierFeatures[tier].smoothScroll

  useEffect(() => {
    if (!smooth) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    // Smooth scroll is loaded only where it is used (fine pointers), so touch devices never download or parse it.
    let cleanup = () => {}
    let cancelled = false
    void Promise.all([import('lenis'), import('lenis/dist/lenis.css')]).then(([mod]) => {
      if (cancelled) return
      const Lenis = mod.default
      const lenis = new Lenis({ autoRaf: false })
      setLenis(lenis)
      const onScroll = () => ScrollTrigger.update()
      lenis.on('scroll', onScroll)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      const onLock = (ev: Event) => {
        if ((ev as CustomEvent<boolean>).detail) lenis.stop()
        else lenis.start()
      }
      window.addEventListener('fm:scrolllock', onLock)
      cleanup = () => {
        window.removeEventListener('fm:scrolllock', onLock)
        gsap.ticker.remove(tick)
        lenis.off('scroll', onScroll)
        setLenis(null)
        lenis.destroy()
      }
    })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [smooth])

  // Live scroll velocity and page progress, for the HUD, particles, audio and velocity effects.
  // The page height is cached (reading it every frame forces a layout) and style is only written when a value changes.
  useEffect(() => {
    let last = window.scrollY
    let v = 0
    let max = 0
    let lastV = ''
    // The two velocity variables are written only on the film containers that use them. Written on <html> they are
    // inherited by every element, so each frame of scrolling re-computed the style of the whole page (about a sixth
    // of the main thread on a phone-sized layout).
    let targets: HTMLElement[] = []
    const collect = () => {
      targets = Array.from(document.querySelectorAll<HTMLElement>('.stage, .nav-section, .svc-stick, .close-stick'))
    }
    const write = (name: string, value: string) => targets.forEach((t) => t.style.setProperty(name, value))
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight
      collect()
    }
    measure()
    ScrollTrigger.addEventListener('refresh', measure)
    window.addEventListener('resize', measure)
    const tick = () => {
      const y = window.scrollY
      if (y === last && v === 0) return // nothing is moving: no work at all
      const raw = Math.max(-1, Math.min(1, (y - last) / 40))
      last = y
      v += (raw - v) * 0.18
      if (Math.abs(v) < 0.001) v = 0
      motionState.velocity = v
      motionState.progress = max > 0 ? y / max : 0
      const s = v.toFixed(3)
      if (s !== lastV) {
        lastV = s
        write('--v', s)
        write('--va', Math.abs(v).toFixed(3))
      }
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      write('--v', '0')
      write('--va', '0')
      ScrollTrigger.removeEventListener('refresh', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Links to chapters inside pinned stages (#statement, #scramble ...) jump to where that chapter takes over.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]')
      const raw = a?.getAttribute('href') ?? ''
      // '/#id' links are in-page jumps only while we are on the home page; elsewhere they navigate normally.
      const id = raw.startsWith('#') ? raw.slice(1) : raw.startsWith('/#') && window.location.pathname === '/' ? raw.slice(2) : ''
      if (!a || !id) return
      // Chapters inside pinned stages resolve from their stage; any other id is an ordinary element.
      const target = document.getElementById(id)
      const y = anchorY(id) ?? (target ? Math.round(target.getBoundingClientRect().top + window.scrollY) : null)
      if (y === null) return
      e.preventDefault()
      history.replaceState(null, '', `#${id}`)
      // Wait a beat so a closing menu has released the scroll lock.
      window.setTimeout(() => jumpTo(y), 80)
    }
    document.addEventListener('click', onClick)

    // A page opened on a chapter hash lands on that chapter once the pins are measured.
    const id = window.location.hash.slice(1)
    let tries = 0
    let t = 0
    let touched = false
    const markTouched = () => {
      touched = true
    }
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown']
    events.forEach((ev) => window.addEventListener(ev, markTouched, { once: true, passive: true }))
    const land = () => {
      if (touched) return
      const y = anchorY(id) ?? (PINNED.has(id) ? null : chapterStart(id))
      if (y !== null) jumpTo(y, true)
      else if (tries++ < 20) t = window.setTimeout(land, 400)
    }
    if (id) {
      // Land once the pinned chapters are measured, then once more after the final refresh has settled any shift.
      void layoutReady.then(() => {
        t = window.setTimeout(() => {
          land()
          t = window.setTimeout(land, 1500)
        }, 200)
      })
    }

    return () => {
      document.removeEventListener('click', onClick)
      events.forEach((ev) => window.removeEventListener(ev, markTouched))
      window.clearTimeout(t)
    }
  }, [])

  // Pin lengths depend on layout. Recalculate once fonts and the page have settled.
  useEffect(() => {
    // One refresh once fonts and the page have both settled (not one per event).
    const loaded = new Promise<void>((r) => {
      if (document.readyState === 'complete') r()
      else window.addEventListener('load', () => r(), { once: true })
    })
    void Promise.all([document.fonts?.ready ?? Promise.resolve(), loaded]).then(() => scheduleRefresh(150))
  }, [])

  return null
}
