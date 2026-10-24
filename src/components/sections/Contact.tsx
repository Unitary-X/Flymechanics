import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '~/content/site.content'
import { FitText } from '~/components/motion/FitText'
import { ScrubVideo, type ScrubHandle } from '~/components/motion/ScrubVideo'
import { useMotion } from '~/components/motion/MotionProvider'
import { WithMarkers } from '~/components/ui/OwnerConfirm'
import { QuoteForm } from '~/components/ui/QuoteForm'
import { scheduleRefresh, useAfterQuiet } from '~/lib/scroll'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const EMERGENCY = site.faq[3].a // the single emergency statement, used everywhere (spec 14)

/**
 * Chapter 09. Close and landing. The blue-hour runway film stays on screen and plays while the heading, the quote
 * form and the details scroll over it; the giant wordmark rises from the bottom edge and its gold dot glows once.
 */
export function Contact() {
  const { active } = useMotion()
  const ready = useAfterQuiet(1200) // reveal effects for far-below chapters start after the first interaction or a quiet moment
  const ref = useRef<HTMLElement>(null)
  const video = useRef<ScrubHandle>(null)
  const c = site.contact

  useEffect(() => {
    if (!active || !ready) return
    const section = ref.current
    if (!section) return
    const wordmark = section.querySelector<HTMLElement>('[data-wordmark]')
    const letters = section.querySelectorAll<HTMLElement>('[data-letter]')
    const dot = section.querySelector<HTMLElement>('[data-dot]')

    const ctx = gsap.context(() => {
      const p = { v: 0 }
      gsap.to(p, {
        v: 1,
        ease: 'none',
        onUpdate: () => video.current?.seek(p.v),
        scrollTrigger: { trigger: section, start: 'top 80%', end: 'bottom bottom', scrub: 0.5 },
      })
      gsap.from('[data-close-rise]', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: 'top 60%', once: true },
      })

      // The wordmark rises from the bottom edge, then the gold dot glows once.
      if (wordmark && letters.length > 0) {
        gsap.set(wordmark, { clipPath: 'inset(-20% -5% 0% -5%)' })
        gsap.from(letters, {
          yPercent: 110,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.035,
          scrollTrigger: { trigger: wordmark, start: 'top 98%', once: true },
          onComplete: () => {
            gsap.set(wordmark, { clearProps: 'clipPath' })
            if (dot) {
              gsap.fromTo(
                dot,
                { boxShadow: '0 0 0 0 rgba(242,181,68,0)' },
                { boxShadow: '0 0 70px 24px rgba(242,181,68,0.75)', duration: 0.7, yoyo: true, repeat: 1, ease: 'sine.inOut' },
              )
            }
          },
        })
      }
    }, section)
    scheduleRefresh()
    return () => ctx.revert()
  }, [active, ready])

  return (
    <section ref={ref} id="contact" data-theme="dark" className="close">
      <div className="close-stick" aria-hidden="true">
        <ScrubVideo ref={video} mediaKey="close" lazy poster="start" />
        <div className="close-scrim" />
      </div>

      <div className="close-flow">
        <div className="close-top">
          <h2 data-close-rise className="t-display m-0 close-heading">
            {site.close.heading}
          </h2>
          <p data-close-rise className="t-body m-0 close-sub">
            {site.close.sub}
          </p>
          <p data-close-rise className="close-pills m-0">
            <a href="#quote-form" className="pill pill--outline">
              {site.cta.quote} ↓
            </a>
            <a href={c.whatsapp} className="pill pill--outline">
              {site.cta.whatsapp} ↗
            </a>
          </p>
        </div>

        <div className="close-grid">
          <div data-close-rise className="close-details">
            <dl className="m-0">
              <div>
                <dt className="t-label">Phone</dt>
                <dd>
                  <a href={c.phoneHref}>{c.phoneDisplay}</a>
                </dd>
              </div>
              <div>
                <dt className="t-label">Email</dt>
                <dd>
                  <a href={`mailto:${c.email}`}>{c.email}</a>
                </dd>
              </div>
              <div>
                <dt className="t-label">Hours</dt>
                <dd>
                  {c.hours.map((h) => (
                    <span key={h} style={{ display: 'block' }}>
                      {h}
                    </span>
                  ))}
                  <span style={{ display: 'block', color: 'var(--on-black-78)' }}>{c.tz}</span>
                </dd>
              </div>
              <div>
                <dt className="t-label">Address</dt>
                <dd>
                  <WithMarkers text={c.address} />
                </dd>
              </div>
              <div>
                <dt className="t-label">After hours</dt>
                <dd>
                  <WithMarkers text={EMERGENCY} />
                </dd>
              </div>
            </dl>
          </div>

          <div data-close-rise className="close-form">
            <QuoteForm />
          </div>
        </div>

        <footer className="close-footer">
          <div className="close-wordmark" aria-hidden="true" style={{ color: '#fff' }}>
            <FitText text="FLYMECHANICS" />
          </div>
          <div className="close-links">
            <p className="m-0">
              © {new Date().getFullYear()} <WithMarkers text={c.legalEntity} />
            </p>
            <nav aria-label="Footer" className="close-nav">
              <a href="/#services">Services</a>
              <a href="/#navigator">Navigator</a>
              <a href="/#approach">Approach</a>
              <a href="/#faq">FAQ</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href={`mailto:${c.email}`}>{c.email}</a>
              <a href="/#hero">Back to top ↑</a>
            </nav>
          </div>
        </footer>
      </div>
    </section>
  )
}
