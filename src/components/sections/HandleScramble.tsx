import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '~/content/site.content'
import { ScrubVideo, type ScrubHandle } from '~/components/motion/ScrubVideo'
import { ScrambleText, type ScrambleHandle } from '~/components/motion/ScrambleText'
import { useMotion } from '~/components/motion/MotionProvider'
import { calmPinFactor } from '~/config/motion'
import { registerAnchors, scheduleRefresh, useAfterQuietOrScrolled } from '~/lib/scroll'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// Timeline units: 1.7 units per 100vh, the same scroll speed as the opening stage.
const D3 = 5.1 // chapter 03, 300vh
const L = 2.72 // chapter 04, 160vh
const TOTAL = D3 + L

const ORBIT_LETTERS = ['F', 'L', 'Y']

/**
 * Chapters 03 and 04 as one pinned stage (460vh), so the handover is exact.
 *  03 We handle: the still-life film plays behind the service list. The list sits in a dark text-safe column on
 *     the left; the letters F, L, Y orbit in the open area on the right (spec 7.4, 21.1 #2). The film ends on the
 *     brass compass, then the chapter dips to dark.
 *  04 Scramble film: the cloud flight plays; "Time flies." decodes before the bright cloud wall, the second line
 *     after it, so no text sits on the white-out (spec 7.5, addendum chapter 04).
 * Without motion the two chapters are plain stacked sections showing final copy.
 */
export function HandleScramble() {
  const { active, mode } = useMotion()
  // Calm shortens every pinned scroll by 40% (spec 21.7).
  const pinFactor = mode === 'calm' ? calmPinFactor : 1
  const idle = useAfterQuietOrScrolled() // built on the first interaction (or at once if the page opens scrolled)
  const stageRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLElement>(null)
  const scrambleRef = useRef<HTMLElement>(null)
  const stillVideo = useRef<ScrubHandle>(null)
  const scrVideo = useRef<ScrubHandle>(null)
  const line1 = useRef<ScrambleHandle>(null)
  const line2 = useRef<ScrambleHandle>(null)

  useEffect(() => {
    if (!active || !idle) return
    const stage = stageRef.current
    const handle = handleRef.current
    const scramble = scrambleRef.current
    const orbEls = Array.from(stage?.querySelectorAll<HTMLElement>('[data-orb]') ?? [])
    if (!stage || !handle || !scramble || orbEls.length === 0) return

    const orb = { t: 0 }
    // Elliptical orbit in the open area. Desktop: right of the text column. Phone: lower middle, below the list.
    const place = () => {
      const W = stage.clientWidth
      const H = stage.clientHeight
      const phone = W < 820
      const cx = phone ? 0.5 * W : 0.69 * W
      const cy = phone ? 0.74 * H : 0.5 * H
      const a = phone ? 0.34 * W : 0.2 * W
      const b = phone ? 0.1 * H : 0.22 * H
      const turn = orb.t * Math.PI * 2 * 0.9
      orbEls.forEach((el, i) => {
        const th = turn + (i * Math.PI * 2) / orbEls.length - Math.PI / 2
        const s = Math.sin(th)
        const x = cx + a * Math.cos(th) - el.offsetWidth / 2
        const y = cy + b * s - el.offsetHeight / 2
        el.style.transform = `translate3d(${x}px,${y}px,0) scale(${0.82 + 0.22 * ((s + 1) / 2)})`
        el.style.zIndex = String(Math.round(s * 10) + 10)
        el.style.opacity = String(0.55 + 0.45 * ((s + 1) / 2))
      })
    }

    let pinTrigger: ScrollTrigger | undefined
    const ctx = gsap.context(() => {
      const stP = { p: 0 }
      const scP = { p: 0 }
      const l1P = { p: 0 }
      const l2P = { p: 0 }

      place()
      line1.current?.render(0)
      line2.current?.render(0)

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: `+=${Math.round((TOTAL / 1.7) * 100 * pinFactor)}%`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: place,
        },
      })

      pinTrigger = tl.scrollTrigger

      // ---- Chapter 03: We handle ----
      tl.set(scramble, { opacity: 0 }, 0)
        .set('[data-orbs]', { autoAlpha: 0 }, 0)
        .to(stP, { p: 1, duration: D3, onUpdate: () => stillVideo.current?.seek(stP.p) }, 0)
        .fromTo('[data-h-label], [data-h-item]', { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12 }, 0.1)
        .fromTo('[data-h-line]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 1.0)
        // F, L, Y rise out of the dark and orbit with the scroll.
        .to('[data-orbs]', { autoAlpha: 1, duration: 0.6 }, 0.5)
        .to(orb, { t: 1, duration: D3 - 0.4, onUpdate: place }, 0.4)
        // The list dims as the camera pushes toward the compass (spec 21.2, 70 to 100%).
        .to('[data-h-label], [data-h-item], [data-h-line]', { opacity: 0.25, duration: 0.9 }, D3 * 0.72)
        .to('[data-orbs]', { autoAlpha: 0, duration: 0.7 }, D3 - 1.3)
        .to('[data-h-dip]', { opacity: 1, duration: 0.5 }, D3 - 0.5)

      // ---- Handover (black on black) ----
      tl.set(handle, { autoAlpha: 0 }, D3).set(scramble, { opacity: 1 }, D3)

      // ---- Chapter 04: Scramble film ----
      tl.set('[data-s-l1], [data-s-l2]', { opacity: 0 }, 0)
        .fromTo('[data-s-dip]', { opacity: 1 }, { opacity: 0, duration: 0.45 }, D3)
        .to(scP, { p: 1, duration: L, onUpdate: () => scrVideo.current?.seek(scP.p) }, D3)
        // Line 1 decodes in the calm opening seconds and leaves before the cloud wall (about 40 to 50% of the clip).
        .set('[data-s-l1]', { opacity: 1 }, D3 + 0.1)
        .to(l1P, { p: 1, duration: 0.6, onUpdate: () => line1.current?.render(l1P.p) }, D3 + 0.1)
        .to('[data-s-l1]', { opacity: 0, duration: 0.2 }, D3 + 0.85)
        // Line 2 decodes once the sky is open again.
        .set('[data-s-l2]', { opacity: 1 }, D3 + 1.55)
        .to(l2P, { p: 1, duration: 0.6, onUpdate: () => line2.current?.render(l2P.p) }, D3 + 1.55)
        .to({}, { duration: 0.1 }, TOTAL)
    }, stage)
    const unregister = registerAnchors({ handle: 0, scramble: D3 / TOTAL }, pinTrigger!)
    scheduleRefresh()

    return () => {
      unregister()
      ctx.revert()
      // Back to the final text for the static layout.
      line1.current?.render(1)
      line2.current?.render(1)
    }
  }, [active, pinFactor, idle])

  return (
    <div ref={stageRef} className={`stage ${active ? 'stage--motion' : ''}`}>
      <noscript>
        <style>{`.stage{height:auto!important}.stage-layer{position:relative!important;opacity:1!important;visibility:visible!important}`}</style>
      </noscript>

      {/* ---------------------------------------------------------------- 03 We handle */}
      <section
        ref={handleRef}
        id="handle"
        data-theme="dark"
        data-still
        className="stage-layer overflow-hidden"
        style={{
          zIndex: 1,
          minHeight: '100svh',
          padding: 'var(--margin) var(--margin) calc(var(--margin) + var(--hud-bottom))',
        }}
      >
        <div className="absolute inset-0" aria-hidden="true">
          <ScrubVideo ref={stillVideo} mediaKey="stillLife" lazy poster="start" />
          {/* Dark text-safe column behind the list (brief C8): the props drift into the left edge. */}
          <div className="scrim-h absolute inset-0" />
          <div className="scrim-v absolute inset-0" />
        </div>

        <div className="relative z-10 grid gap-5 md:max-w-[min(40vw,640px)]" style={{ paddingTop: 'calc(var(--hud-top) + 8px)' }}>
          <p data-h-label className="t-label m-0" style={{ color: 'var(--on-black-78)' }}>
            {site.handle.label}
          </p>
          <ul className="m-0 list-none p-0">
            {site.handle.list.map((item) => (
              <li
                key={item}
                data-h-item
                style={{
                  borderTop: '1px solid var(--line-dark)',
                  padding: '9px 0',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  fontSize: 'clamp(20px, 2.2vw, 40px)',
                }}
              >
                {item}
              </li>
            ))}
          </ul>
          <p data-h-line className="t-body m-0" style={{ color: 'var(--on-black-78)', maxWidth: '34ch' }}>
            {site.handle.line}
          </p>
        </div>

        {/* F, L, Y orbit in the open area. Decorative; placed by script, away from the text column. */}
        <div data-orbs aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
          {ORBIT_LETTERS.map((ch) => (
            <span
              key={ch}
              data-orb
              className="t-display absolute left-0 top-0 select-none"
              style={{ color: '#fff', fontSize: 'clamp(84px, 14vw, 260px)', willChange: 'transform' }}
            >
              {ch}
            </span>
          ))}
        </div>

        <div data-h-dip aria-hidden="true" className="pointer-events-none absolute inset-0 z-20" style={{ background: 'var(--black)', opacity: 0 }} />
      </section>

      {/* ---------------------------------------------------------------- 04 Scramble film */}
      <section
        ref={scrambleRef}
        id="scramble"
        data-theme="dark"
        data-scr
        className="stage-layer stage-layer--late overflow-hidden"
        style={{
          zIndex: 2,
          minHeight: '100svh',
          padding: 'var(--margin) var(--margin) calc(var(--margin) + var(--hud-bottom))',
        }}
      >
        <div className="absolute inset-0" aria-hidden="true">
          <ScrubVideo ref={scrVideo} mediaKey="scramble" lazy poster="start" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(5,7,13,0.74) 0%, rgba(5,7,13,0.42) 55%, rgba(5,7,13,0.12) 100%)' }} />
        </div>

        <div className="relative z-10 flex min-h-[calc(100svh-var(--hud-bottom)-2*var(--margin))] items-center">
          <div className="scr-lines grid gap-4 md:max-w-[56vw]">
            <p data-s-l1 className="t-row m-0">
              <ScrambleText ref={line1} text={site.scramble.first} />
            </p>
            <p data-s-l2 className="t-row m-0">
              <ScrambleText ref={line2} text={site.scramble.second} />
            </p>
          </div>
        </div>

        <div data-s-dip aria-hidden="true" className="pointer-events-none absolute inset-0 z-20" style={{ background: 'var(--black)', opacity: 0 }} />
      </section>
    </div>
  )
}
