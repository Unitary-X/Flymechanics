import { useEffect, useId, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '~/content/site.content'
import { useMotion } from '~/components/motion/MotionProvider'
import { WithMarkers } from '~/components/ui/OwnerConfirm'
import { scheduleRefresh, useAfterQuiet } from '~/lib/scroll'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

/** Chapter 08. Line-style accordion: one open at a time, keyboard accessible, aria-expanded (spec 7.9). */
export function Faq() {
  const { active } = useMotion()
  const ready = useAfterQuiet(1000) // reveal effects for far-below chapters start after the first interaction or a quiet moment
  const uid = useId()
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (!active || !ready) return
    const section = ref.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.from('[data-faq-rise]', {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: 'top 72%', once: true },
      })
      gsap.fromTo(
        '[data-faq-line]',
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'expo.out', stagger: 0.1, transformOrigin: 'left', scrollTrigger: { trigger: section, start: 'top 72%', once: true } },
      )
    }, section)
    scheduleRefresh()
    return () => ctx.revert()
  }, [active, ready])

  return (
    <section ref={ref} id="faq" data-theme="light" className="faq">
      <div className="faq-inner">
        <p data-faq-rise className="t-label m-0" style={{ color: 'var(--grey-60)' }}>
          ( FAQ )
        </p>
        <h2 className="sr-only">Frequently asked questions</h2>

        <div className="faq-list">
          {site.faq.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} data-faq-rise className="faq-item">
                <div data-faq-line className="faq-line" aria-hidden="true" />
                <h3 className="m-0">
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-a${i}`}
                    id={`${uid}-q${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span aria-hidden="true" className="faq-icon">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                <div
                  id={`${uid}-a${i}`}
                  role="region"
                  aria-labelledby={`${uid}-q${i}`}
                  className="faq-a"
                  data-open={isOpen}
                >
                  <div className="faq-a-inner">
                    <p className="t-body m-0">
                      <WithMarkers text={item.a} />
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="faq-line" style={{ background: 'var(--line-light)' }} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
