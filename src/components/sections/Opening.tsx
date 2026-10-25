import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '~/content/site.content'
import { FitText } from '~/components/motion/FitText'
import { ScrubVideo, type ScrubHandle } from '~/components/motion/ScrubVideo'
import { useMotion } from '~/components/motion/MotionProvider'
import { calmPinFactor } from '~/config/motion'
import { registerAnchors } from '~/lib/scroll'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const FULL = 'inset(0% 0% 0% 0% round 0px)'
const words = site.statement.split(' ')

// Timeline units. Hero 3.4 units at 200vh, statement 4.25 units at 250vh: the same scroll speed (1.7 units per 100vh).
const HERO_END = 3.4
const K = 1.37 // statement scale
const st = (x: number) => HERO_END + x * K

/**
 * Chapters 01 and 02 as one pinned stage, so the handover is exact (spec 21.2).
 *  01 Hero: a full-bleed sky film (an airliner seen from below, climbing away) behind a white wordmark, the tagline
 *     and two buttons. Scrolling plays the film (the sky turns golden), the text lifts away, and the film closes into
 *     the aircraft-window frame.
 *  02 Statement: the same frame continues with the window film, which grows to full bleed while the words
 *     light up one by one (spec 21.1 #6). The clip ends on bright city, so the chapter dips to dark.
 * Without motion (tier C, Pause, reduced motion, Save-Data) the two chapters are plain stacked sections.
 */
export function Opening() {
  const { active, mode } = useMotion()
  // Calm shortens every pinned scroll by 40% (spec 21.7).
  const pinFactor = mode === 'calm' ? calmPinFactor : 1
  const stageRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLElement>(null)
  const heroFilmRef = useRef<HTMLDivElement>(null)
  const stFilmRef = useRef<HTMLDivElement>(null)
  const heroVideo = useRef<ScrubHandle>(null)
  const stVideo = useRef<ScrubHandle>(null)

  useEffect(() => {
    if (!active) return
    const stage = stageRef.current
    const hero = heroRef.current
    const statement = statementRef.current
    const heroFilm = heroFilmRef.current
    const stFilm = stFilmRef.current
    const dot = hero?.querySelector<HTMLElement>('[data-dot]')
    const letters = hero?.querySelectorAll<HTMLElement>('[data-letter]')
    const wordmark = hero?.querySelector<HTMLElement>('[data-wordmark]')
    if (!stage || !hero || !statement || !heroFilm || !stFilm || !dot || !letters || !wordmark) return

    let pinTrigger: ScrollTrigger | undefined
    const ctx = gsap.context(() => {
      const windowClip = () =>
        getComputedStyle(document.documentElement).getPropertyValue('--window').trim() || FULL

      // Load-in: the wordmark rises letter by letter, once (not scrubbed). Skipped when the page opens mid-scroll.
      if (window.scrollY < 8) {
        gsap.set(wordmark, { clipPath: 'inset(-20% -5% 0% -5%)' })
        // Rise only (no fade): the first paint stays solid, which keeps the largest paint early.
        gsap.from(letters, {
          yPercent: 110,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.03,
          onComplete: () => gsap.set(wordmark, { clearProps: 'clipPath' }),
        })
      }

      const heroP = { p: 0 }
      const stP = { p: 0 }
      let pastHero = false

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: `+=${Math.round(((HERO_END + 3.1 * K) / 1.7) * 100 * pinFactor)}%`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const past = self.progress * (HERO_END + 3.1 * K) >= HERO_END
            if (past !== pastHero) {
              pastHero = past
              window.dispatchEvent(new CustomEvent('fm:pasthero', { detail: past }))
            }
          },
        },
      })

      pinTrigger = tl.scrollTrigger

      // ---- Chapter 01 ----
      tl.set(statement, { opacity: 0 }, 0)
        .to('[data-hero-fade]', { opacity: 0, y: -24, duration: 0.5, stagger: 0.05 }, 0.1)
        .to(letters, { yPercent: -45, opacity: 0, duration: 0.7, stagger: 0.025 }, 0.25)
        .to(dot, { opacity: 0, duration: 0.4 }, 0.5)
        // The dark tint that keeps the white text readable clears as the text leaves.
        .to('[data-hero-scrim]', { opacity: 0, duration: 1 }, 0.2)
        // The film plays as you scroll: the airliner climbs away and the sky turns golden.
        .to(heroP, { p: 1, duration: 2.4, onUpdate: () => heroVideo.current?.seek(heroP.p) }, 0.2)
        // Close into the window frame; the page is black around it.
        .fromTo(heroFilm, { clipPath: FULL }, { clipPath: windowClip, duration: 0.8, ease: 'power2.inOut' }, 2.6)

      // ---- Handover: chapter 02 starts in the same frame ----
      tl.set(statement, { opacity: 1 }, HERO_END)
        .set(hero, { autoAlpha: 0 }, HERO_END)

      // ---- Chapter 02 ----
      tl.fromTo(stFilm, { clipPath: windowClip }, { clipPath: FULL, duration: 1 * K, ease: 'power2.inOut' }, st(0.9))
        .to(stP, { p: 1, duration: 3 * K, onUpdate: () => stVideo.current?.seek(stP.p) }, st(0))
        .fromTo('[data-w]', { opacity: 0.15 }, { opacity: 1, duration: 0.14 * K, stagger: 0.05 * K }, st(0.1))
        .to('[data-scrim]', { opacity: 1, duration: 0.8 * K }, st(0.9))
        .to('[data-st-text]', { opacity: 0, duration: 0.3 * K }, st(2.45))
        .to('[data-dip]', { opacity: 1, duration: 0.5 * K }, st(2.6))
        .to({}, { duration: 0.1 }, st(3.1))
    }, stage)
    const unregister = registerAnchors({ hero: 0, statement: HERO_END / (HERO_END + 3.1 * K) }, pinTrigger!)
    return () => {
      unregister()
      ctx.revert()
      window.dispatchEvent(new CustomEvent('fm:pasthero', { detail: false }))
    }
  }, [active, pinFactor])

  return (
    <div
      ref={stageRef}
      // Motion and static layouts are switched by class, never by inline style: GSAP restores inline styles
      // when it reverts, which would undo React's changes.
      className={`stage ${active ? 'stage--motion' : ''}`}
    >
      {/* Without JavaScript the two chapters simply stack as normal sections. */}
      <noscript>
        <style>{`.stage{height:auto!important}.stage-layer{position:relative!important;opacity:1!important;visibility:visible!important}`}</style>
      </noscript>

      {/* Spec 7.2: H1 for SEO and screen readers while the wordmark is the visible title. It sits outside the
          hero layer, which is hidden after the handover, so the page always has its heading. */}
      <h1 className="sr-only">Corporate travel management in Chennai</h1>

      {/* ---------------------------------------------------------------- 01 Hero */}
      <section
        ref={heroRef}
        id="hero"
        data-theme="dark"
        className="stage-layer hero2 overflow-hidden"
        style={{
          zIndex: 1,
          minHeight: '100svh',
          padding: 'var(--margin) var(--margin) calc(var(--margin) + var(--hud-bottom) + 12px)',
        }}
      >
        {/* The sky film fills the whole screen from the first frame. Without motion it is the still first frame. */}
        <div ref={heroFilmRef} data-hero-film aria-hidden="true" className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
          <ScrubVideo ref={heroVideo} mediaKey="hero" poster="start" />
        </div>
        <div data-hero-scrim aria-hidden="true" className="hero-scrim" />

        <nav data-hero-fade aria-label="Page sections" className="hero-nav">
          <a href="#services">Services</a>
          <a href="#approach">Approach</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="hero-copy">
          <p data-hero-fade className="hero-kicker">
            {site.descriptor}
          </p>
          <div className="hero-wordmark" aria-hidden="true">
            <FitText text="FLYMECHANICS" />
          </div>
          <p data-hero-fade className="hero-tagline">
            {site.tagline}
          </p>
        </div>

        <div data-hero-fade className="hero-cta">
          <a href="#services" className="pill pill--glass">
            {site.cta.services}
          </a>
          <a href={site.cta.memberLoginHref} className="pill pill--glass">
            {site.cta.memberLogin}
          </a>
        </div>
      </section>

      {/* ---------------------------------------------------------------- 02 Statement */}
      <section
        ref={statementRef}
        id="statement"
        data-theme="dark"
        className="stage-layer stage-layer--late overflow-hidden"
        style={{
          zIndex: 2,
          minHeight: '100svh',
          padding: 'var(--margin) var(--margin) calc(var(--margin) + var(--hud-bottom))',
        }}
      >
        <div ref={stFilmRef} className="absolute inset-0" style={{ clipPath: 'var(--window)' }} aria-hidden="true">
          <ScrubVideo ref={stVideo} mediaKey="statement" poster={active ? 'start' : 'end'} />
          <div
            data-scrim
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(5,7,13,0.78) 0%, rgba(5,7,13,0.5) 45%, rgba(5,7,13,0.05) 100%)',
            }}
          />
        </div>

        <div
          data-st-text
          className="relative z-10 grid gap-5 md:max-w-[36vw]"
          style={{ paddingTop: 'calc(var(--hud-top) + 8px)' }}
        >
          <p className="t-label m-0" style={{ color: 'var(--on-black-78)' }}>
            ( Who we are )
          </p>
          <p className="t-statement m-0">
            {words.map((w, i) => (
              <span key={i} data-w className="inline-block" style={{ marginRight: '0.28em' }}>
                {w}
              </span>
            ))}
          </p>
        </div>

        <div
          data-dip
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{ background: 'var(--black)', opacity: 0 }}
        />
      </section>
    </div>
  )
}
