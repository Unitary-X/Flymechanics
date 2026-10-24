import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { media, MOBILE_MAX, type MediaKey } from '~/config/media'
import { useMotion } from './MotionProvider'
import { layoutReady } from '~/lib/scroll'

export interface ScrubHandle {
  /** Show the frame at progress 0..1 of the clip. Calls are coalesced to one seek per animation frame. */
  seek: (progress: number) => void
}

interface ScrubVideoProps {
  mediaKey: MediaKey
  /** Load the file only when the element is within about two screens (one chapter ahead). */
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

  const apply = useCallback(() => {
    raf.current = 0
    const v = videoRef.current
    if (!v || !Number.isFinite(v.duration) || v.duration === 0) return
    const t = target.current * Math.max(v.duration - 0.04, 0)
    if (Math.abs(v.currentTime - t) > 0.004) v.currentTime = t
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      seek(p: number) {
        target.current = Math.min(1, Math.max(0, p))
        if (!raf.current) raf.current = requestAnimationFrame(apply)
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
    const pick = () => (window.innerWidth < MOBILE_MAX || tier === 'B' ? files.mobile : files.desktop)
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
        { rootMargin: '150% 0px' },
      )
      io.observe(el)
    })
    return () => {
      cancelled = true
      io?.disconnect()
    }
  }, [active, tier, lazy, files])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      // The poster is only used (and fetched) in static mode. With motion the stage shows its own backdrop until the
      // film's first frame is ready, which keeps stills out of the first paint.
      poster={!active ? (poster === 'start' ? files.poster : files.posterEnd) : undefined}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden="true"
      onLoadedMetadata={apply}
      onLoadedData={apply}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  )
})
