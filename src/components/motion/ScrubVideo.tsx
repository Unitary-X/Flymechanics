import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { media, MOBILE_MAX, type MediaKey } from '~/config/media'
import { useMotion } from './MotionProvider'
import { layoutReady } from '~/lib/scroll'

// Films below the first screen are fetched in the background, in page order, but only in the pauses between scrolling:
// downloading and decoding other films while the visitor is scrubbing the one on screen makes the scrub stutter. Each
// film waits a little longer after the last scroll than the one before it. A film that comes within a few screens of
// the viewport still loads at once.
const WARM_IDLE_MS = 800
const WARM_STEP_MS = 500
let warmOrder = 0
let interacted = false
let lastActivity = 0
let listening = false
function listenForActivity() {
  if (listening || typeof window === 'undefined') return
  listening = true
  const mark = () => {
    interacted = true
    lastActivity = performance.now()
  }
  ;(['wheel', 'touchstart', 'touchmove', 'scroll', 'keydown', 'pointerdown'] as const).forEach((e) =>
    window.addEventListener(e, mark, { passive: true }),
  )
}

type Files = (typeof media)[MediaKey]
type Connection = { saveData?: boolean; downlink?: number; effectiveType?: string }

/**
 * Which encode to use. Portrait phones get the sharp portrait crop, other small or weaker devices the light landscape
 * file. Desktops get the 1080p file only when the screen really has the pixels and the browser reports a fast
 * connection (10 Mbps or more, no Save-Data); browsers that do not report it get the normal 1600 file.
 */
export function pickFilm(files: Files, tier: string): string {
  const w = window.innerWidth
  const h = window.innerHeight
  if (w < MOBILE_MAX) return h > w * 1.1 ? files.portrait : files.mobile
  if (tier === 'B') return files.mobile
  const c = (navigator as Navigator & { connection?: Connection }).connection
  const fast = !!c && !c.saveData && (c.downlink ?? 0) >= 10 && (c.effectiveType ?? '4g') === '4g'
  return fast && w * (window.devicePixelRatio || 1) >= 1700 ? files.large : files.desktop
}

export interface ScrubHandle {
  /** Show the frame at progress 0..1 of the clip. Calls are coalesced to one seek per animation frame. */
  seek: (progress: number) => void
}

interface ScrubVideoProps {
  mediaKey: MediaKey
  /** Load the file when the element is within a few screens, or earlier in the background (see WARM_STEP_MS). */
  lazy?: boolean
  /** Which still to show while no video is loaded (and in tier C, reduced motion, Pause). */
  poster: 'start' | 'end'
  className?: string
}

/**
 * A silent video that is never played: scroll sets its time. Posters are shown until the first frame is ready
 * and whenever motion is off. The element is decorative (aria-hidden) and never takes focus.
 */
export const ScrubVideo = forwardRef<ScrubHandle, ScrubVideoProps>(function ScrubVideo(
  { mediaKey, lazy = false, poster, className = '' },
  ref,
) {
  const { active, tier } = useMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const target = useRef(0)
  const raf = useRef(0)
  const [src, setSrc] = useState<string | undefined>(undefined)
  const files = media[mediaKey]
  const [order] = useState(() => (lazy ? warmOrder++ : 0))

  const apply = useCallback(() => {
    raf.current = 0
    const v = videoRef.current
    if (!v || !Number.isFinite(v.duration) || v.duration === 0) return
    // Never interrupt a seek that is still decoding: a new currentTime cancels it, so on a slow device a fast scroll
    // would keep restarting the seek and the picture would freeze until the scroll stopped. Instead the latest
    // target is applied the moment the current seek lands (onSeeked), so frames keep arriving at the decoder's pace.
    if (v.seeking) return
    const t = target.current * Math.max(v.duration - 0.04, 0)
    if (Math.abs(v.currentTime - t) > 0.004) v.currentTime = t
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      seek(p: number) {
        target.current = Math.min(1, Math.max(0, p))
        // Scroll animations call this from inside the animation frame already, so seek at once: deferring to the
        // next frame made the picture update only every second frame.
        apply()
      },
    }),
    [apply],
  )

  // Choose the file once motion is allowed, and only after the first screen has painted and the pins are measured
  // (a chapter's position is not real before that). Phones and weaker devices get the lighter encode.
  useEffect(() => {
    if (!active) {
      setSrc(undefined)
      return
    }
    let cancelled = false
    let io: IntersectionObserver | undefined
    const pick = () => pickFilm(files, tier)
    void layoutReady.then(() => {
      if (cancelled) return
      const el = videoRef.current
      if (!lazy || !el) {
        setSrc(pick())
        return
      }
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setSrc(pick())
            io?.disconnect()
          }
        },
        { rootMargin: '300% 0px' },
      )
      io.observe(el)
    })
    return () => {
      cancelled = true
      io?.disconnect()
    }
  }, [active, tier, lazy, files])

  // Background loading for capable desktops (tier A) and for phones the browser reports as on a 4g connection (their
  // films are small); everything else only loads what is near.
  useEffect(() => {
    if (!lazy || !active) return
    listenForActivity()
    const c = (navigator as Navigator & { connection?: Connection }).connection
    const phoneOk = window.innerWidth < MOBILE_MAX && !!c && !c.saveData && c.effectiveType === '4g'
    if (tier !== 'A' && !phoneOk) return
    let cancelled = false
    const timer = window.setInterval(() => {
      // Wait for a first interaction, then for a pause in scrolling that grows with this film's place in the page.
      if (!interacted || performance.now() - lastActivity < WARM_IDLE_MS + order * WARM_STEP_MS) return
      window.clearInterval(timer)
      void layoutReady.then(() => {
        if (!cancelled) setSrc((cur) => cur ?? pickFilm(files, tier))
      })
    }, 300)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [lazy, order, active, tier, files])

  // iPhones and iPads often will not decode a paused video until it has been "played" once after a touch. A silent
  // play-then-pause on the first gesture unlocks every film, so scrolling can drive them straight away.
  useEffect(() => {
    if (!src) return
    const v = videoRef.current
    if (!v) return
    const unlock = () => {
      v.muted = true
      const p = v.play()
      if (p) {
        void p
          .then(() => {
            v.pause()
            apply()
          })
          .catch(() => {})
      }
    }
    const events = ['touchstart', 'pointerdown', 'keydown'] as const
    events.forEach((e) => window.addEventListener(e, unlock, { once: true, passive: true }))
    return () => events.forEach((e) => window.removeEventListener(e, unlock))
  }, [src, apply])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      // The poster is used in static mode, and with motion once the film has been chosen (never in the first paint):
      // a small still shows at once while the film file arrives, so a fast scroll never meets an empty frame.
      poster={!active || src ? (poster === 'start' ? files.poster : files.posterEnd) : undefined}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden="true"
      onLoadedMetadata={apply}
      onLoadedData={apply}
      onSeeked={apply}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  )
})
