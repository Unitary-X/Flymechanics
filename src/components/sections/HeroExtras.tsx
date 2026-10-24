import { useEffect, useRef, useState } from 'react'
import { site } from '~/content/site.content'
import { media, MOBILE_MAX } from '~/config/media'
import { useMotion } from '~/components/motion/MotionProvider'
import { useAfterLayout } from '~/lib/scroll'

/**
 * The sunrise flight, playing slowly behind the wordmark. A white knock-out layer on top lets it show only through
 * the letters. Decorative (aria-hidden). With motion off, Pause or reduced motion it is the still frame; the film file
 * is only fetched after the first paint, and it pauses once the hero has been scrolled past.
 */
export function WordmarkFilm() {
  const { active, tier } = useMotion()
  const ready = useAfterLayout()
  const [src, setSrc] = useState<string | undefined>(undefined)
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!active || !ready) {
      setSrc(undefined)
      return
    }
    // On a phone the wordmark is a thin strip: a still frame looks the same and costs nothing while scrolling starts.
    if (window.innerWidth < MOBILE_MAX) {
      setSrc(undefined)
      return
    }
    setSrc(tier === 'B' ? media.hero.mobile : media.hero.desktop)
  }, [active, ready, tier])

  useEffect(() => {
    const onPast = (e: Event) => {
      const v = ref.current
      if (!v) return
      if ((e as CustomEvent<boolean>).detail) v.pause()
      else void v.play().catch(() => {})
    }
    window.addEventListener('fm:pasthero', onPast)
    return () => window.removeEventListener('fm:pasthero', onPast)
  }, [])

  return (
    <div className="wordmark-film" aria-hidden="true">
      <video
        ref={(el) => {
          ref.current = el
          if (el) el.playbackRate = 0.7 // slow and calm
        }}
        src={src}
        poster={media.hero.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        disablePictureInPicture
        disableRemotePlayback
      />
    </div>
  )
}

/** Chennai's coordinates (from the spec's city table) and the live local time. Real information, nothing invented. */
export function ChennaiClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <p data-hero-fade className="hero-clock t-label m-0">
      <span>Chennai</span>
      <span>13.08° N, 80.27° E</span>
      <span>
        {time || '--:--'} IST
      </span>
    </p>
  )
}

/** A slow line of the six approved service names. Decorative: the real list is in the page. Stops on Pause and Off. */
export function ServiceTicker() {
  const items = site.handle.list
  const row = (
    <ul className="hero-ticker-row">
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  )
  return (
    <div data-hero-fade className="hero-ticker" aria-hidden="true">
      <div className="hero-ticker-track">
        {row}
        {row}
      </div>
    </div>
  )
}
