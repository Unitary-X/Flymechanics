import { useEffect, useRef, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '~/content/site.content'
import { ScrubVideo, type ScrubHandle } from '~/components/motion/ScrubVideo'
import { useMotion } from '~/components/motion/MotionProvider'
import { OwnerConfirm } from '~/components/ui/OwnerConfirm'
import type { MediaKey } from '~/config/media'
import { scheduleRefresh, useAfterQuiet } from '~/lib/scroll'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// One clip and one glow colour per service, in the approved order (spec 7.7). The glow stays inside the media.
const ROWS: { key: MediaKey; glow: string }[] = [
  { key: 's01', glow: 'var(--glow-amber)' },
  { key: 's02', glow: 'var(--glow-teal)' },
  { key: 's03', glow: 'var(--glow-blue)' },
  { key: 's04', glow: 'var(--glow-violet)' },
  { key: 's05', glow: 'var(--glow-green)' },
  { key: 's06', glow: 'var(--glow-steel)' },
]

const WINDOW = 'inset(18% 22% 18% 22% round 180px)'
const FULL = 'inset(0% 0% 0% 0% round 0px)'

type Service = (typeof site.services)[number]

/**
 * Chapter 06. Each service is a full-screen film that stays on screen while its text card scrolls over it
 * (a sticky film layer, so any amount of text fits on any screen). The film opens from an aircraft-window shape to
 * full bleed as the row arrives and plays through the whole pass.
 */
export function Services() {
  return (
    <div id="services">
      <h2 className="sr-only">Services</h2>
      {site.services.map((s, i) => (
        <ServiceRow key={s.n} service={s} index={i} />
      ))}
    </div>
  )
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const { active } = useMotion()
  const ready = useAfterQuiet(300) // reveal effects for far-below chapters start after the first interaction or a quiet moment
  const rowRef = useRef<HTMLElement>(null)
  const video = useRef<ScrubHandle>(null)
  const { key, glow } = ROWS[index]
  const note = 'note' in service ? service.note : undefined
  const partners = 'partners' in service ? service.partners : undefined
  const right = index % 2 === 1

  useEffect(() => {
    if (!active || !ready) return
    const row = rowRef.current
    if (!row) return

    const ctx = gsap.context(() => {
      const stick = row.querySelector<HTMLElement>('[data-svc-stick]')
      const glowEl = row.querySelector<HTMLElement>('[data-svc-glow]')
      if (!stick || !glowEl) return
      const p = { v: 0 }

      // The card's lines rise in once, as the row enters.
      gsap.from(row.querySelectorAll('[data-svc-rise]'), {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: row, start: 'top 70%', once: true },
      })

      // The window opens to full bleed as the row arrives (spec 21.1 #5).
      gsap.fromTo(
        stick,
        { clipPath: WINDOW },
        { clipPath: FULL, ease: 'none', scrollTrigger: { trigger: row, start: 'top 88%', end: 'top 8%', scrub: 0.5 } },
      )
      // The film plays through the whole pass.
      gsap.to(p, {
        v: 1,
        ease: 'none',
        onUpdate: () => video.current?.seek(p.v),
        scrollTrigger: { trigger: row, start: 'top 70%', end: 'bottom 30%', scrub: 0.5 },
      })
      // A soft coloured light crosses the film (inside the media only).
      gsap.fromTo(
        glowEl,
        { xPercent: -80 },
        { xPercent: 80, ease: 'none', scrollTrigger: { trigger: row, start: 'top 80%', end: 'bottom 20%', scrub: 0.6 } },
      )
    }, row)
    scheduleRefresh()

    return () => ctx.revert()
  }, [active, ready])

  return (
    <section
      ref={rowRef}
      id={`s${service.n}`}
      data-theme="light"
      className={`svc ${right ? 'svc--right' : ''}`}
      style={{ '--glow': glow } as CSSProperties}
    >
      <div data-svc-stick className="svc-stick" aria-hidden="true">
        <ScrubVideo ref={video} mediaKey={key} lazy poster="start" />
        <div data-svc-glow className="svc-glow" />
      </div>

      <div className="svc-flow">
        <div className="svc-card">
          <div data-svc-rise className="svc-head">
            <h2 className="svc-title m-0">{service.title}</h2>
            <span aria-hidden="true" className="svc-num">
              {`S'${service.n}`}
            </span>
          </div>

          <p data-svc-rise className="svc-meta t-label m-0">
            <span aria-hidden="true">©26</span>
            <span>{service.tags}</span>
          </p>

          <p data-svc-rise className="t-label m-0" style={{ color: 'var(--grey-60)' }}>
            {site.deliverablesLabel}
          </p>
          <p data-svc-rise className="t-body m-0">
            {service.body}
          </p>
          <ul data-svc-rise className="svc-items">
            {service.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {note && (
            <p data-svc-rise className="svc-note m-0">
              {note}
            </p>
          )}
          {partners && (
            <p data-svc-rise className="svc-note m-0" style={{ color: 'var(--ink)' }}>
              <OwnerConfirm>{partners}</OwnerConfirm>
            </p>
          )}
          <p data-svc-rise className="svc-links m-0">
            <a href="#services" className="pill pill--outline">
              All services ↪
            </a>
            <a href="#contact" className="pill pill--outline">
              {site.cta.quote} ↗
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
