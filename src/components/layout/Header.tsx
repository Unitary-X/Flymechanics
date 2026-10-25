import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '~/content/site.content'
import { useMotion } from '~/components/motion/MotionProvider'
import { Menu } from './Menu'

/**
 * Fixed header: tiny logo and MENU use mix-blend-mode: difference so they stay legible on white and black.
 * The Request a quote pill appears once the hero is out of view (spec 5.3).
 */
export function Header() {
  const { active } = useMotion()
  const [open, setOpen] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  // Over the first screen's sky film the logo and MENU are plain white; everywhere else they blend (legible on white
  // and black). Starts true so the first paint over the film is already white.
  const [overHero, setOverHero] = useState(true)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])

  // The quote pill appears once chapter 02 has taken over from the hero. With motion the opening stage
  // announces the handover; without motion the hero is a normal section, so scroll position decides.
  useEffect(() => {
    const onPast = (e: Event) => setPastHero((e as CustomEvent<boolean>).detail)
    window.addEventListener('fm:pasthero', onPast)
    return () => window.removeEventListener('fm:pasthero', onPast)
  }, [])
  useEffect(() => {
    const home = window.location.pathname === '/'
    const limit = () => window.innerHeight * (active ? 1.5 : 0.9)
    const check = () => setOverHero(home && window.scrollY < limit())
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [active])
  useEffect(() => {
    if (active) return
    let raf = 0
    const check = () => {
      raf = 0
      setPastHero(window.scrollY > window.innerHeight * 0.8)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [active])

  return (
    <>
      {/* The blend sits on the header element itself: a fixed element with z-index is its own stacking
          context, so a blend set on its children would only see the header's own transparent background. */}
      <header
        className={`${overHero ? 'hud-plain' : 'hud-blend'} fixed inset-x-0 top-0 z-[80] flex items-start justify-between`}
        style={{ padding: 'var(--margin)', pointerEvents: 'none' }}
      >
        <a
          href="/#hero"
          aria-label={`${site.brand}, back to top`}
          data-past={pastHero}
          className="t-label hdr-logo"
          style={{ pointerEvents: 'auto', textDecoration: 'none', padding: '8px 4px', color: 'inherit' }}
        >
          {site.wordmark}
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          className="t-label"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
          style={{ all: 'unset', pointerEvents: 'auto', cursor: 'pointer', padding: '8px 4px', textTransform: 'uppercase', fontWeight: 500, fontSize: 12, letterSpacing: '0.04em', color: 'inherit' }}
        >
          {open ? 'Close' : 'Menu'} ≡
        </button>
      </header>

      {/* Quote pill is not blended (a gold pill would invert). It sits to the left of MENU. */}
      <a
        href="/#contact"
        className="pill pill--gold fixed z-[81]"
        aria-hidden={!pastHero}
        tabIndex={pastHero ? 0 : -1}
        style={{
          top: 'var(--margin)',
          right: 'calc(var(--margin) + 84px)',
          height: 34,
          opacity: pastHero ? 1 : 0,
          transform: pastHero ? 'none' : 'translateY(-8px)',
          pointerEvents: pastHero ? 'auto' : 'none',
          transition: 'opacity var(--dur-2) var(--ease-enter), transform var(--dur-2) var(--ease-enter)',
        }}
      >
        {site.cta.quote}
      </a>
      <Menu open={open} onClose={close} returnFocusTo={menuButtonRef} />
    </>
  )
}
