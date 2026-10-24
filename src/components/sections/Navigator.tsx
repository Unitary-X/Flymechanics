import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '~/content/site.content'
import { ScrubVideo, type ScrubHandle } from '~/components/motion/ScrubVideo'
import { useMotion } from '~/components/motion/MotionProvider'
import { calmPinFactor } from '~/config/motion'
import { registerAnchors, scheduleRefresh, useAfterQuietOrScrolled } from '~/lib/scroll'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// Timeline units: 1.7 units per 100vh (the same scroll speed as the other stages). The last clip finishes, then a short hold.
const T = 7.9

/**
 * Captions follow the order the planet clips fly: Chennai, Singapore, Europe, New York, then the overview.
 * The caption TEXT is the spec's (section 6); only the order differs from the spec's list, because the clips
 * show Singapore before they cross to Europe. Owner to approve this order.
 */
const c = site.navigator.captions
const STEPS: { at: number; caption: string; count: number }[] = [
  { at: 0, caption: c[0], count: 0 }, // Chennai (Hub)
  { at: 1.5, caption: c[2], count: 1 }, // Southeast Asia — Singapore
  { at: 3.2, caption: c[1], count: 3 }, // Europe — London & Frankfurt
  { at: 5.6, caption: c[3], count: 4 }, // North America — New York
  { at: 7.0, caption: c[4], count: 4 }, // Four routes, one hub
]

/**
 * Chapter 05. The real planet footage flies from India to Europe to North America as you scroll, with the
 * caption and route counter following it. It ends on the New York clip. Without motion a still from the first
 * clip is shown with the finished caption.
 */
export function Navigator() {
  const { active, mode } = useMotion()
  // Calm shortens every pinned scroll by 40% (spec 21.7).
  const pinFactor = mode === 'calm' ? calmPinFactor : 1
  const idle = useAfterQuietOrScrolled() // built on the first interaction (or at once if the page opens scrolled)
  const sectionRef = useRef<HTMLElement>(null)
  const v1 = useRef<ScrubHandle>(null)
  const v2 = useRef<ScrubHandle>(null)
  const v3 = useRef<ScrubHandle>(null)

  useEffect(() => {
    if (!active || !idle) return
    const section = sectionRef.current
    if (!section) return

    const captionEl = section.querySelector<HTMLElement>('[data-nav-caption]')
    const countEl = section.querySelector<HTMLElement>('[data-nav-count]')
    const barEl = section.querySelector<HTMLElement>('[data-nav-bar]')

    let pinTrigger: ScrollTrigger | undefined
    let step = -1
    const apply = (time: number) => {
      let idx = 0
      STEPS.forEach((s, i) => {
        if (time >= s.at) idx = i
      })
      if (idx === step) return
      step = idx
      if (captionEl) captionEl.textContent = STEPS[idx].caption
      if (countEl) countEl.textContent = `${STEPS[idx].count} / 4 routes`
    }

    const ctx = gsap.context(() => {
      const p1 = { p: 0 }
      const p2 = { p: 0 }
      const p3 = { p: 0 }
      apply(0)

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${Math.round((T / 1.7) * 100 * pinFactor)}%`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            apply(self.progress * T)
            if (barEl) barEl.style.transform = `scaleX(${self.progress.toFixed(4)})`
          },
        },
      })
      pinTrigger = tl.scrollTrigger

      tl.fromTo('[data-nav-media]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
        .fromTo('[data-nav-text]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.1)
        // Clip 1: India, with Chennai and the Singapore edge.
        .to(p1, { p: 1, duration: 2.4, onUpdate: () => v1.current?.seek(p1.p) }, 0.3)
        // Clip 2: across Arabia to Europe (Frankfurt and London).
        .to('[data-nav-v="2"]', { opacity: 1, duration: 0.5 }, 2.55)
        .to(p2, { p: 1, duration: 2.5, onUpdate: () => v2.current?.seek(p2.p) }, 2.7)
        // Clip 3: the Atlantic to the US east coast (New York).
        .to('[data-nav-v="3"]', { opacity: 1, duration: 0.5 }, 5.2)
        .to(p3, { p: 1, duration: 2.0, onUpdate: () => v3.current?.seek(p3.p) }, 5.3)
        .to({}, { duration: 0.2 }, T)
    }, section)

    const unregister = registerAnchors({ navigator: 0 }, pinTrigger!)
    scheduleRefresh()

    return () => {
      unregister()
      ctx.revert()
      // Static layout: the finished caption.
      if (captionEl) captionEl.textContent = STEPS[STEPS.length - 1].caption
      if (countEl) countEl.textContent = '4 / 4 routes'
      if (barEl) barEl.style.transform = 'scaleX(1)'
    }
  }, [active, pinFactor, idle])

  const last = STEPS[STEPS.length - 1]

  return (
    <section
      ref={sectionRef}
      id="navigator"
      data-theme="dark"
      className={`nav-section ${active ? 'nav--motion' : ''}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100svh',
        padding: 'var(--margin) var(--margin) calc(var(--margin) + var(--hud-bottom))',
      }}
    >
      <div data-nav-media aria-hidden="true" className="absolute inset-0">
        {/* Planet clips, stacked: each fades in over the last. Static mode shows the first clip's still. */}
        <div data-nav-v="1" className="absolute inset-0">
          <ScrubVideo ref={v1} mediaKey="nav1" lazy poster="start" />
        </div>
        <div data-nav-v="2" className="absolute inset-0">
          <ScrubVideo ref={v2} mediaKey="nav2" lazy poster="start" />
        </div>
        <div data-nav-v="3" className="absolute inset-0">
          <ScrubVideo ref={v3} mediaKey="nav3" lazy poster="start" />
        </div>
        <div className="scrim-h absolute inset-0" />
        <div className="scrim-v absolute inset-0" />
      </div>

      <div
        className="relative z-10 grid gap-5 md:max-w-[min(42vw,580px)]"
        style={{ paddingTop: 'calc(var(--hud-top) + 8px)' }}
      >
        <p data-nav-text className="t-label m-0" style={{ color: 'var(--on-black-78)' }}>
          {site.navigator.eyebrow}
        </p>
        <h2 data-nav-text className="t-display m-0" style={{ fontSize: 'clamp(32px, 4.6vw, 72px)' }}>
          {site.navigator.title}
        </h2>
        <p data-nav-text className="t-body m-0" style={{ color: 'var(--on-black-78)' }}>
          {site.navigator.body}
        </p>

        <div data-nav-text className="grid gap-3" style={{ borderTop: '1px solid var(--line-dark)', paddingTop: 16 }}>
          <p data-nav-caption aria-live="polite" className="m-0" style={{ fontSize: 18, fontWeight: 600, minHeight: '1.4em' }}>
            {last.caption}
          </p>
          <p data-nav-count className="t-label m-0" style={{ color: 'var(--gold)' }}>
            4 / 4 routes
          </p>
          <div aria-hidden="true" style={{ height: 2, background: 'var(--line-dark)' }}>
            <div
              data-nav-bar
              style={{ height: '100%', background: 'var(--gold)', transformOrigin: 'left', transform: 'scaleX(1)' }}
            />
          </div>
          <a href="#services" className="t-label" style={{ color: 'var(--on-black-78)', width: 'fit-content', textDecoration: 'underline' }}>
            Skip animation
          </a>
        </div>
      </div>
    </section>
  )
}
