import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '~/content/site.content'
import { useMotion } from '~/components/motion/MotionProvider'
import { scheduleRefresh, useAfterQuiet } from '~/lib/scroll'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

/**
 * Chapter 07. White page, the statement, and three columns (Data, Experience, Value) that each draw a gold rule
 * and rise in. A thin route ribbon draws behind them as you scroll (addendum, chapter 07). It is decorative.
 * Proof counters stay out until the owner confirms real numbers (spec 7.8).
 */
export function Approach() {
  const { active } = useMotion()
  const ready = useAfterQuiet(800) // reveal effects for far-below chapters start after the first interaction or a quiet moment
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!active || !ready) return
    const section = ref.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.from('[data-apr-rise]', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      })
      gsap.fromTo(
        '[data-apr-rule]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.15,
          transformOrigin: 'left',
          scrollTrigger: { trigger: '[data-apr-cols]', start: 'top 85%', once: true },
        },
      )
      // The ribbon draws with the scroll through the section.
      gsap.fromTo(
        '[data-apr-ribbon]',
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'bottom 30%', scrub: 0.6 },
        },
      )
    }, section)
    scheduleRefresh()
    return () => ctx.revert()
  }, [active, ready])

  const a = site.approach

  return (
    <section ref={ref} id="approach" data-theme="light" className="apr">
      <svg className="apr-ribbon" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path
          data-apr-ribbon
          d="M -20 330 C 220 60, 520 420, 780 120 S 980 40, 1040 10"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={0}
          fill="none"
          stroke="var(--gold)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      </svg>

      <div className="apr-inner">
        <div className="apr-top">
          <p data-apr-rise className="t-label m-0" style={{ color: 'var(--grey-60)' }}>
            {a.label}
          </p>
          <h2 data-apr-rise className="t-statement m-0" style={{ maxWidth: '24ch' }}>
            {a.statement}
          </h2>
        </div>

        <div data-apr-cols className="apr-cols">
          {a.columns.map((c) => (
            <div key={c.t} className="apr-col">
              <div data-apr-rule className="apr-rule" aria-hidden="true" />
              <h3 data-apr-rise className="t-row m-0" style={{ fontSize: 'clamp(30px, 3.2vw, 52px)' }}>
                {c.t}
              </h3>
              <p data-apr-rise className="t-body m-0">
                {c.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
